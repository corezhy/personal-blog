package com.zhy.management.filter;

import com.zhy.common.config.SecurityProperties;
import com.zhy.utils.jwt.JwtUtils;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * JWT 认证过滤器
 * 这个过滤器会从请求头中提取 Token，解析用户信息，并设置到 Spring Security 的上下文中
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SecurityProperties securityProperties;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // 1. 检查是否白名单（白名单直接放行，不解析 Token）
        String requestUri = request.getRequestURI();
        List<String> whitelist = securityProperties.getWhitelist();
        if (whitelist != null) {
            for (String pattern : whitelist) {
                if (pathMatcher.match(pattern, requestUri)) {
                    log.debug("白名单路径，跳过 Token 解析：{}", requestUri);
                    chain.doFilter(request, response);
                    return;
                }
            }
        }

        // 2. 获取 Token
        String token = request.getHeader("token");
        if (!StringUtils.hasLength(token)) {
            log.debug("请求头无 token，交给 Security 后续处理");
            chain.doFilter(request, response);
            return;
        }

        // 3. 解析 Token
        Claims claims;
        try {
            claims = jwtUtils.parseJWT(token);
        } catch (Exception e) {
            log.warn("Token 解析失败：{}", e.getMessage());
            // 解析失败，不设置认证，交给后续过滤器处理
            chain.doFilter(request, response);
            return;
        }

        // 4. 从 Claims 中取出用户信息
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);
        String username = claims.get("username", String.class);

        // 5. 构造 Spring Security 的认证对象
        // 注意：角色需要加上 "ROLE_" 前缀（Spring Security 默认规则）
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userId, // principal（可以是用户 ID 或对象）
                        null,   // credentials（无密码）
                        Collections.singletonList(authority) // 权限列表
                );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // 6. 将认证对象放入 SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        log.info("用户 {} 认证成功，角色：{}", username, role);
        chain.doFilter(request, response);
    }
}