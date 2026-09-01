# 后端 Spring Security 执行流程

> 本文基于本项目实际代码整理，梳理请求从进入到被拦截、再到按角色放行的完整链路。

## 相关代码文件

| 文件 | 职责 |
| --- | --- |
| `SecurityConfig.java` | Spring Security 核心配置：白名单放行（支持 `方法:路径` 前缀，如 `GET:/articles`）、其余请求需认证、注册 JWT 过滤器、开启方法级安全 |
| `JwtAuthenticationFilter.java` | 自定义 JWT 过滤器：**只负责解析 token**（兼容 `token` / `Authorization: Bearer` 两种头），解析成功构造认证对象写入 SecurityContext，不做白名单判断 |
| `SecurityProperties.java` | 读取 `interceptor.whitelist` 白名单配置 |
| `LoginServiceImpl.java` | 登录逻辑：校验用户名密码后把 role 写进 JWT claims |
| `application.yaml` | 白名单、jwt 密钥/过期时间等配置 |
| `SysUser.java` | 用户实体，`role` 字段取值 `admin` / `user` |

---

## 一、整体执行流程

```
请求进来
  │
  ▼
Spring Security 过滤器链(@EnableWebSecurity 注册的 springSecurityFilterChain)
  │
  ├─ ① JwtAuthenticationFilter ──(自定义，只负责解析 token)
  │     ├─ 取 token(token 头 / Authorization: Bearer 头)
  │     ├─ 没有 token ──► 放行
  │     ├─ 解析失败 ──► 放行(不设置认证)
  │     └─ 解析成功 ──► 构造认证对象,塞进 SecurityContext
  │        ★ 无论是否白名单,只要带了 token 就解析(白名单不短路)
  │
  ├─ ② 授权过滤器(AuthorizationFilter)
  │     └─ 根据 SecurityConfig 的规则判断:
  │           · 白名单(带 GET: 前缀只放行该方法的读操作)→ permitAll(不要求登录)
  │           · 其他任何请求 → authenticated(必须有认证信息)
  │           没登录的请求在这被拦下返回 403
  │
  ▼
③ Controller 方法
  └─ 方法上有 @PreAuthorize? ──► 方法级安全拦截器再校验一次角色(超纲校验)
```

> 核心变化：**白名单只决定"URL 要不要登录"，不决定"token 解析不解析"**。过滤器永远解析 token，
> 放行与否交给 `SecurityConfig` 的 URL 规则 + `@PreAuthorize`。这样白名单路径上的写操作（如 `POST /articles`）
> 也能用方法注解做角色控制，而不是整个路径裸奔。

## 二、它到底怎么"拦截不同用户"

关键点：**不是按"用户"拦截，而是按 token 里的 role 字段区分。**

1. **登录时**（`LoginServiceImpl.java:56-59`）：把数据库里 `sys_user.role` 的值（admin/user）写进 JWT 的 claims。

```java
Map<String, Object> claims = new HashMap<>();
claims.put("role", user.getRole());      // "admin" 或 "user"
claims.put("username", user.getUsername());
String token = jwtUtils.generateJwt(user.getId().toString(), claims);
```

2. **请求时**（`JwtAuthenticationFilter.java`）：先从两种头里取 token——

```java
String token = request.getHeader("token");
if (!StringUtils.hasLength(token)) {
    String auth = request.getHeader("Authorization");
    if (StringUtils.hasLength(auth) && auth.startsWith(TOKEN_PREFIX)) {  // TOKEN_PREFIX = "Bearer "
        token = auth.substring(TOKEN_PREFIX.length());
    }
}
```

有 token 就解析，取出 `role`，加上 `ROLE_` 前缀并转大写，变成一个权限 `SimpleGrantedAuthority("ROLE_ADMIN")`，再连同 `userId` 一起封装成 `UsernamePasswordAuthenticationToken` 放进 `SecurityContextHolder`。

```java
String userId = claims.getSubject();
String role = claims.get("role", String.class);
String username = claims.get("username", String.class);

// 角色需要加上 "ROLE_" 前缀(Spring Security 默认规则)
SimpleGrantedAuthority authority =
        new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()); // 例如:ROLE_ADMIN
UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(
                userId,                 // principal(用户 ID)
                null,                   // credentials(无密码)
                Collections.singletonList(authority)  // 权限列表
        );
SecurityContextHolder.getContext().setAuthentication(authentication);
```

3. **之后 Spring Security 的判断全部读这个 SecurityContext**：
   - 有没有认证信息 → 决定 `authenticated()` 是否通过（拦不拦"没登录的人"）
   - 权限列表里有没有 `ROLE_ADMIN` → 决定 `@PreAuthorize` 是否放行（拦不拦"角色不对的人"）

所以 `admin` 用户和 `user` 用户的唯一区别，就是各自 token 里的 role 不同，最终落到 SecurityContext 里的权限一个是 `ROLE_ADMIN`、一个是 `ROLE_USER`。

> 小细节：数据库里 role 是小写，过滤器里 `toUpperCase()` 转成了大写，所以权限实际是 `ROLE_ADMIN` / `ROLE_USER`。
> token 前缀用常量 `TOKEN_PREFIX = "Bearer "`，避免魔法数字。

## 三、Controller 上区分角色的注解

`SecurityConfig.java` 已开启 `@EnableGlobalMethodSecurity(prePostEnabled = true)`，所以直接就能用 `@PreAuthorize`，不用再改配置。**前提是过滤器要能把 token 解析进 SecurityContext**——现在过滤器始终解析，这个前提成立。

常见写法：

```java
// 只有管理员能访问
@PreAuthorize("hasRole('ADMIN')")          // 校验权限里有没有 ROLE_ADMIN

// 只有普通用户能访问
@PreAuthorize("hasRole('USER')")

// 管理员或普通用户都能访问(等价于"登录了就行")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")

// 也可以直接写完整权限名(和 hasRole 等价,因为权限就是 ROLE_xxx)
@PreAuthorize("hasAuthority('ROLE_ADMIN')")

// 用 SpEL 组合条件
@PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
```

用法示例（文章管理的预期形态：读公开、写只有管理员）：

```java
@RestController
@RequestMapping("/articles")
public class ArticleController {

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")   // 只有管理员能新增
    public Result<...> create(@RequestBody ArticleDto dto) { ... }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")   // 只有管理员能修改
    public Result<...> update(@PathVariable Long id, @RequestBody ArticleDto dto) { ... }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")   // 只有管理员能删除
    public Result<Void> delete(@PathVariable Long id) { ... }

    @GetMapping("/{id}")
    public Result<...> detail(@PathVariable Long id) { ... }  // 白名单已放行 GET,游客可读
}
```

`@PreAuthorize` 可以加在**方法上**（最常用），也可以加在**类上**（对该类所有接口生效）。判断依据就是过滤器塞进 SecurityContext 的那条 `ROLE_xxx` 权限。

## 四、几个要注意的点

1. **`@PreAuthorize` 的职责**：它拦的是"登录了但角色不符"的人（第二道角色校验）；没登录的人在第一道 `authenticated()` 就被拦了。对于白名单路径（URL 层 permitAll）上的写操作，方法注解就是唯一的拦截手段——这正是把过滤器改成"始终解析 token"的原因。

2. **白名单里的读接口要带 `GET:` 前缀**：`GET:/articles`、`GET:/articles/*` 只放行 GET。同路径的 `POST /articles` 新增、`PUT/DELETE /articles/{id}` 都不在白名单里，会落到 `authenticated()`，再由 `@PreAuthorize` 收窄到管理员。不要写裸的 `/articles`，否则所有方法都会被放行。

3. **`/auth/me` 仍匿名放行**（application.yaml）：白名单不带 token 也能访问。但注意现在过滤器会解析带 token 的请求，所以登录后访问 `/auth/me` 是能拿到 SecurityContext 里的身份的。若确实要求必须登录才能查，把它移出白名单即可。

4. **默认的错误响应是 403 纯文本**，不是 JSON。如果前端想统一处理"未登录"和"无权限"，可以加一个自定义 `AuthenticationEntryPoint`（未登录→401）和 `AccessDeniedHandler`（角色不符→403），统一返回 `Result` 格式。

5. **角色值目前是 `admin`/`user` 两个**，如果将来角色变多（比如 `editor`），只要在 DB 里加角色、登录时写进 token，注解侧写好 `hasRole('EDITOR')` 即可，过滤器不用动。

---

## 附录：核心代码对照

### SecurityConfig.java

```java
@Configuration
@EnableWebSecurity // 让Spring Security生效
@EnableGlobalMethodSecurity(prePostEnabled = true) // 生效@PreAuthorize注解
@EnableConfigurationProperties(SecurityProperties.class)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private SecurityProperties securityProperties;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // 1. 关闭 CSRF(使用 JWT 无需)
        http.csrf().disable();

        // 2. 无状态会话(JWT 不存 session)
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // 3. 请求授权:白名单放行,其余请求需要认证
        http.authorizeHttpRequests(authz -> {
            if (securityProperties.getWhitelist() != null) {
                for (String item : securityProperties.getWhitelist()) {
                    // 支持 "GET:/articles" 形式:仅对该 HTTP 方法放行(其余方法仍需认证)
                    String[] parts = item.split(":", 2);
                    if (parts.length == 2) {
                        HttpMethod method = HttpMethod.resolve(parts[0].trim());
                        if (method != null) {
                            authz.antMatchers(method, parts[1].trim()).permitAll();
                        } else {
                            authz.antMatchers(parts[1].trim()).permitAll();
                        }
                    } else {
                        authz.antMatchers(item).permitAll();
                    }
                }
            }
            authz.anyRequest().authenticated();
        });

        // 4. 添加 JWT 过滤器(在 UsernamePasswordAuthenticationFilter 之前执行)
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 5. 禁用默认登录页
        http.formLogin().disable();
        http.httpBasic().disable();

        return http.build();
    }
}
```

### application.yaml 白名单

```yaml
# 拦截器白名单
interceptor:
  whitelist:
    # ===== 认证与用户 =====
    - /auth/login
    - /auth/me
    # ===== 前台公开接口(游客可读;前缀 GET: 表示只放行该方法的读操作,
    #      增删改等写操作不走白名单,由 authenticated + @PreAuthorize 控制) =====
    - GET:/articles
    - GET:/articles/*
    - GET:/categories
    - GET:/tags
    - GET:/archives
    - GET:/stats
    # ===== Knife4j / Swagger 文档(开发环境需放行) =====
    - /doc.html
    - /webjars/**
    - /v2/api-docs
    - /swagger-resources/**
    - /swagger-ui/**
    - /favicon.ico
```
