package com.zhy.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户表实体类
 */
@Data
@TableName("sys_user")
@ApiModel(description = "用户表")
@NoArgsConstructor
@AllArgsConstructor
public class SysUser {

    @ApiModelProperty(value = "用户ID", example = "1")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty(value = "登录账号", required = true, example = "admin")
    private String username;

    @ApiModelProperty(value = "密码（BCrypt哈希）", required = true)
    private String password;

    @ApiModelProperty(value = "显示昵称", required = true, example = "管理员")
    private String name;

    @ApiModelProperty(value = "角色：admin-管理员 / user-普通用户", allowableValues = "admin,user", example = "admin")
    private String role;

    @ApiModelProperty(value = "状态：1-启用 / 0-禁用", allowableValues = "0,1", example = "1")
    private Integer status;

    @ApiModelProperty(value = "头像URL", example = "https://example.com/avatar.png")
    private String avatar;

    @ApiModelProperty(value = "最近登录时间", readOnly = true)
    private LocalDateTime lastLoginAt;

    @ApiModelProperty(value = "创建时间", readOnly = true)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "更新时间", readOnly = true)
    private LocalDateTime updatedAt;
}