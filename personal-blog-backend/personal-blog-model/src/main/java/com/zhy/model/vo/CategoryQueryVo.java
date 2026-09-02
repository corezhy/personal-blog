package com.zhy.model.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 文章分类查询VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "文章分类查询VO")
public class CategoryQueryVo {

    /**
     * 分类Id
     */
    @ApiModelProperty(value = "分类ID", example = "1")
    private Long id;

    /**
     * 分类名
     */
    @ApiModelProperty(value = "分类名称", required = true, example = "Java")
    private String name;

    /**
     * 分类描述
     */
    @ApiModelProperty(value = "分类描述", example = "Java相关技术文章")
    private String description;

    /**
     * 分类下文章数
     */
    @ApiModelProperty(value = "分类下文章数量", example = "10")
    private Integer count;
}