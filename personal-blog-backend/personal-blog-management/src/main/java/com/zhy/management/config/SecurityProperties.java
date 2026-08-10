package com.zhy.management.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * 读取配置文件白名单，用于放行
 */
@Data
@ConfigurationProperties(prefix = "interceptor")
public class SecurityProperties {
    private List<String> whitelist;
}