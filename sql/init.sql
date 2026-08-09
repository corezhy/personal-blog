-- =============================================================
-- 个人博客数据库初始化脚本
-- 数据库名：personal-blog（与 backend/application-dev.yaml 的 datasource.url 对应）
-- 说明：当前仅含用户表，支撑前端登录 /auth 模块。
-- =============================================================

-- -------------------------------------------------------------
-- 用户表 sys_user
-- 前端契约：LoginParams{username, password}
--           -> LoginResult{token, userInfo{id, name, role}}
-- 认证方式：JWT 无状态令牌（无需 token 表）；密码 BCrypt 哈希存储
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_user` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username`      VARCHAR(50)     NOT NULL                COMMENT '登录账号',
  `password`      VARCHAR(100)    NOT NULL                COMMENT '密码',
  `name`          VARCHAR(50)     NOT NULL                COMMENT '显示昵称',
  `role`          VARCHAR(20)     NOT NULL DEFAULT 'user' COMMENT '角色:admin-管理员 / user-普通用户',
  `status`        TINYINT         NOT NULL DEFAULT 1      COMMENT '状态:1-启用 / 0-禁用',
  `avatar`        VARCHAR(255)    DEFAULT NULL            COMMENT '头像URL',
  `last_login_at` DATETIME        DEFAULT NULL            COMMENT '最近登录时间',
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -------------------------------------------------------------
-- 初始化演示账号（与前端 Mock 账号对齐：admin/admin123、user/user123）
-- 注意：password 必须存 BCrypt 哈希，禁止明文。
-- 生成方式：new BCryptPasswordEncoder().encode("admin123")
-- 下述占位符请替换为真实哈希后再执行。
-- -------------------------------------------------------------
INSERT INTO `sys_user` (`username`, `password`, `name`, `role`) VALUES
('admin', '$2a$10$REPLACE_WITH_BCRYPT_HASH_1', '管理员', 'admin'),
('user',  '$2a$10$REPLACE_WITH_BCRYPT_HASH_2', '普通用户', 'user');
