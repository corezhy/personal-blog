package com.zhy.model.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 文章-标签关联表
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("sys_article_tag")
public class SysArticleTag implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 文章ID(sys_article.id)
     */
    @TableId(value = "article_id", type = IdType.ASSIGN_ID)
    private Long articleId;

    /**
     * 标签ID(sys_tag.id)
     */
    private Long tagId;


}
