package com.zhy.management.controller;


import com.zhy.common.result.Result;
import com.zhy.management.service.ISysArticleService;
import com.zhy.model.dto.ArticleInsertDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.regex.Pattern;

/**
 * <p>
 * 文章表 前端控制器
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Api(tags = "文章管理")
@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class SysArticleController {

    private final ISysArticleService sysArticleService;


    /**
     * 新增文章
     * @param articleInsertDto
     * @return
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ApiOperation("新增文章")
    public Result<Void> insertArticle(@Valid @RequestBody ArticleInsertDto articleInsertDto) {
        sysArticleService.insertArticle(articleInsertDto);
        return Result.success();
    }


}
