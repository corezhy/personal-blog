package com.zhy.model.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * LoginVo需要的userinfo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "LoginVo需要的userInfo")
public class UserInfoVo {

    @ApiModelProperty(value = "用户ID", example = "1")
    private Long id;

    @ApiModelProperty(value = "显示昵称", required = true, example = "管理员")
    private String name;

    @ApiModelProperty(value = "角色：admin-管理员 / user-普通用户", allowableValues = "admin,user", example = "admin")
    private String role;

}
