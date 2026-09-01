package com.zhy.management.filter;

import com.zhy.utils.jwt.JwtUtils;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

/**
 * JWT 认证过滤器
 * 只负责一件事：请求带 token 就解析并写入 SecurityContext。
 * 是否放行由 SecurityConfig 的 URL 规则 + @PreAuthorize 决定，本过滤器不做白名单判断。
 * 兼容两种 token 头：token / Authorization: Bearer。
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /** Authorization 头的 token 前缀 */
    private static final String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // 1. 兼容两种 token 头：token / Authorization: Bearer
        String token = request.getHeader("token");
        if (!StringUtils.hasLength(token)) {
            String auth = request.getHeader("Authorization");
            if (StringUtils.hasLength(auth) && auth.startsWith(TOKEN_PREFIX)) {
                token = auth.substring(TOKEN_PREFIX.length());
            }
        }

        // 2. 有 token 就解析；成功则写入 SecurityContext，失败不设置，交给 Security 后续判定
        if (StringUtils.hasLength(token)) {
            try {
                Claims claims = jwtUtils.parseJWT(token);
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);
                String username = claims.get("username", String.class);

                // 角色加 "ROLE_" 前缀（Spring Security 默认规则），数据库小写转为大写
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId, // principal（用户 ID）
                                null,   // credentials（无密码）
                                Collections.singletonList(authority)
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.info("用户 {} 认证成功，角色：{}", username, role);
            } catch (Exception e) {
                log.warn("Token 解析失败：{}", e.getMessage());
            }
        }

        chain.doFilter(request, response);
    }
}
