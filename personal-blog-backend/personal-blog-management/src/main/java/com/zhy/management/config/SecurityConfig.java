package com.zhy.management.config;

import com.zhy.management.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security配置类，JWT过滤器放行后进入
 */
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
        // 1. 关闭 CSRF（使用 JWT 无需）
        http.csrf().disable();

        // 2. 无状态会话（JWT 不存 session）
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // 3. 请求授权：白名单放行，其余请求需要认证
        http.authorizeHttpRequests(authz -> {
            // 放行白名单（从配置文件读取）
            if (securityProperties.getWhitelist() != null) {
                for (String pattern : securityProperties.getWhitelist()) {
                    authz.antMatchers(pattern).permitAll();
                }
            }
            // 其他任何请求都需要认证（登录后才能访问）
            authz.anyRequest().authenticated();
        });

        // 4. 添加 JWT 过滤器（在 UsernamePasswordAuthenticationFilter 之前执行）
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 5. 禁用默认登录页
        http.formLogin().disable();
        http.httpBasic().disable();

        return http.build();
    }
}