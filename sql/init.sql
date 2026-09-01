-- =============================================================
-- 个人博客数据库初始化脚本
-- 数据库名：personal-blog（与 backend/application-dev.yaml 的 datasource.url 对应）
-- 说明：含用户表（支撑前端登录 /auth 模块）与文章模块相关表
--       （sys_article / sys_category / sys_tag / sys_article_tag，
--       支撑前端 /articles 新增文章等接口）。
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

-- -------------------------------------------------------------
-- 文章分类表 sys_category
-- 前端契约：CategoryInfo{id, name, description?, count?}
-- 注：文章与分类为多对一，分类删除策略由应用层控制，故不加物理外键
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_category` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name`        VARCHAR(50)     NOT NULL                COMMENT '分类名称',
  `description` VARCHAR(255)    DEFAULT NULL            COMMENT '分类描述',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类表';

-- -------------------------------------------------------------
-- 文章标签表 sys_tag
-- 前端契约：TagInfo{id, name, count?}
-- 注：标签为独立实体，文章-标签多对多，通过 sys_article_tag 关联
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_tag` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name`        VARCHAR(50)     NOT NULL                COMMENT '标签名称',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签表';

-- -------------------------------------------------------------
-- 文章表 sys_article
-- 前端契约：POST /articles
--           请求 ArticlePayload{title, summary, content, categoryId, tagIds[], cover?}
--           返回 ArticleDetail{id, title, summary, content, cover,
--                              category{id,name}, tags[{id,name}],
--                              author{id,name}, views, likes, liked,
--                              createdAt, updatedAt, published}
-- 注：author_id 指向 sys_user.id（当前登录管理员）；liked 依赖后续点赞表，新增时恒为 false
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_article` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title`       VARCHAR(80)     NOT NULL                COMMENT '标题',
  `summary`     VARCHAR(200)    NOT NULL                COMMENT '摘要',
  `content`     MEDIUMTEXT      NOT NULL                COMMENT 'Markdown正文',
  `cover`       VARCHAR(255)    DEFAULT NULL            COMMENT '封面图URL',
  `category_id` BIGINT UNSIGNED NOT NULL                COMMENT '分类ID(sys_category.id)',
  `author_id`   BIGINT UNSIGNED NOT NULL                COMMENT '作者ID(sys_user.id)',
  `views`       INT UNSIGNED    NOT NULL DEFAULT 0      COMMENT '浏览量',
  `likes`       INT UNSIGNED    NOT NULL DEFAULT 0      COMMENT '点赞数',
  `published`   TINYINT         NOT NULL DEFAULT 1      COMMENT '是否发布:1-已发布 / 0-草稿',
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- -------------------------------------------------------------
-- 文章-标签关联表 sys_article_tag
-- 一张文章可挂多个标签，一个标签可被多篇文章使用
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sys_article_tag` (
  `article_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID(sys_article.id)',
  `tag_id`     BIGINT UNSIGNED NOT NULL COMMENT '标签ID(sys_tag.id)',
  PRIMARY KEY (`article_id`, `tag_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章-标签关联表';

-- -------------------------------------------------------------
-- 初始化演示分类与标签（与前端 Mock 的分类/标签名称对齐，便于联调）
-- -------------------------------------------------------------
INSERT INTO `sys_category` (`id`, `name`, `description`) VALUES
(1, '前端', 'Vue / React / 工程化'),
(2, '后端', 'Node / Java / 数据库'),
(3, '生活', '随笔与思考'),
(4, '读书笔记', '读书摘要与感想');

INSERT INTO `sys_tag` (`id`, `name`) VALUES
(1, 'Vue'),
(2, 'TypeScript'),
(3, 'Vite'),
(4, 'TailwindCSS'),
(5, 'Node.js'),
(6, '架构'),
(7, '随笔'),
(8, '阅读');
