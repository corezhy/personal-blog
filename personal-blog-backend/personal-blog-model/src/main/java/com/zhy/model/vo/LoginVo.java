package com.zhy.model.vo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 登录返回参数
 */
@Data
@Builder
@ApiModel(description = "用户登录VO")
@NoArgsConstructor
@AllArgsConstructor
public class LoginVo {

    //token
    @ApiModelProperty("token")
    private String token;

    // 返回用户信息
    @ApiModelProperty("用户信息")
    private UserInfoVo userInfo;

}
