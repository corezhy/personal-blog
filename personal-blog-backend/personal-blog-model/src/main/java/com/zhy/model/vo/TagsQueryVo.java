package com.zhy.model.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 标签查询VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "标签查询VO")
public class TagsQueryVo {

    /**
     * 标签Id
     */
    @ApiModelProperty(value = "标签ID", example = "1")
    private Long id;

    /**
     * 标签名
     */
    @ApiModelProperty(value = "标签名称", required = true, example = "Spring Boot")
    private String name;

    /**
     * 标签下文章数
     */
    @ApiModelProperty(value = "标签下文章数量", example = "5")
    private Integer count;
}