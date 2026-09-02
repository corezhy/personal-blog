package com.zhy.management.controller;


import com.zhy.common.result.Result;
import com.zhy.management.service.ISysTagService;
import com.zhy.model.vo.TagsQueryVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 文章标签表 前端控制器
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Api(tags = "文章标签管理")
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class SysTagController {

    private final ISysTagService tagService;

    /**
     * 查询所有标签
     * @return
     */
    @GetMapping
    @ApiOperation("文章标签查询全部接口")
    public Result<List<TagsQueryVo>> queryAllTags() {
        List<TagsQueryVo> voList = tagService.queryAllTags();
        return Result.success(voList);
    }


}
