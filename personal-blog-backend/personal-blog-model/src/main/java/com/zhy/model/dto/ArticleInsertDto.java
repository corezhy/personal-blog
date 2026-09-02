package com.zhy.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * 新增文章DTO
 */
@Data
@ApiModel(description = "新增文章dto")
@NoArgsConstructor
@AllArgsConstructor
public class ArticleInsertDto {

    /**
     * 标题
     */
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题长度不能超过100")
    @ApiModelProperty(value = "标题", required = true, example = "Spring Boot 实战")
    private String title;

    /**
     * 摘要
     */
    @Size(max = 200, message = "摘要长度不能超过200")
    @ApiModelProperty(value = "摘要", example = "本文介绍Spring Boot的核心特性")
    private String summary;

    /**
     * 正文
     */
    @NotBlank(message = "正文不能为空")
    @Size(max = 10000, message = "正文长度不能超过10000")
    @ApiModelProperty(value = "正文", required = true, example = "Spring Boot 是基于 Spring 框架的...")
    private String content;

    /**
     * 分类Id
     */
    @NotNull(message = "分类ID不能为空")
    @ApiModelProperty(value = "分类ID", required = true, example = "1")
    private Long categoryId;

    /**
     * 标签Id集合
     */
    @Size(max = 10, message = "标签数量不能超过10")
    @ApiModelProperty(value = "标签ID集合", example = "[1, 2, 3]")
    private List<Long> tagIds;

    /**
     * 封面图url
     */
    @Size(max = 255, message = "封面URL长度不能超过255")
    @ApiModelProperty(value = "封面图URL", example = "https://example.com/cover.jpg")
    private String cover;
}