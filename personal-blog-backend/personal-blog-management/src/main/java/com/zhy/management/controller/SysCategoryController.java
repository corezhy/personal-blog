package com.zhy.management.controller;


import com.zhy.common.result.Result;
import com.zhy.management.service.ISysCategoryService;
import com.zhy.model.vo.CategoryQueryVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 文章分类表 前端控制器
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Api(tags = "文章分类管理")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class SysCategoryController {


    private final ISysCategoryService categoryService;

    /**
     * 查询所有分类
     * @return
     */
    @GetMapping
    @ApiOperation("文章分类查询全部接口")
    public Result<List<CategoryQueryVo>> queryAllCategory() {
         List<CategoryQueryVo> voList = categoryService.queryAllCategory();
         return Result.success(voList);
    }


}
