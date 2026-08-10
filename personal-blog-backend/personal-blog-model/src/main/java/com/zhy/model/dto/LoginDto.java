package com.zhy.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 用户登录请求参数
 */
@Data
@ApiModel(description = "用户登录dto")
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {

    @NotBlank(message = "用户名不能为空")
    @Size(max = 50, message = "用户名长度不能超过50")
    @ApiModelProperty(value = "用户名", required = true, example = "admin")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在6~100之间")
    @ApiModelProperty(value = "密码", required = true, example = "admin123")
    private String password;

}
