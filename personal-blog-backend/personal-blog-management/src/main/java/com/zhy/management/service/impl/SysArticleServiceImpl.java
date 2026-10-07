package com.zhy.management.service.impl;

import com.zhy.model.entity.SysArticle;
import com.zhy.management.mapper.SysArticleMapper;
import com.zhy.management.service.ISysArticleService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhy.model.dto.ArticleInsertDto;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 文章表 服务实现类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Service
public class SysArticleServiceImpl extends ServiceImpl<SysArticleMapper, SysArticle> implements ISysArticleService {

    /**
     * 新增文章
     *
     * @param articleInsertDto
     */
    @Override
    public void insertArticle(ArticleInsertDto articleInsertDto) {

    }


}
