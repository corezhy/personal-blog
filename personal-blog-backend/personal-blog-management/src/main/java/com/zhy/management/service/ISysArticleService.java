package com.zhy.management.service;

import com.zhy.management.domain.po.SysArticle;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhy.model.dto.ArticleInsertDto;

/**
 * <p>
 * 文章表 服务类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
public interface ISysArticleService extends IService<SysArticle> {

    /**
     * 新增文章
     * @param articleInsertDto
     */
    void insertArticle(ArticleInsertDto articleInsertDto);

}
