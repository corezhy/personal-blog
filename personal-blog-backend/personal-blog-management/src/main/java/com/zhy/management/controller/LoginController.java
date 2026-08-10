package com.zhy.management.controller;

import com.zhy.common.result.Result;
import com.zhy.management.service.LoginService;
import com.zhy.model.dto.LoginDto;
import com.zhy.model.entity.SysUser;
import com.zhy.model.vo.LoginVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * 登录接口
 */
@RestController
@Api(tags = "员工登录接口")
@RequiredArgsConstructor
public class LoginController {


    private final LoginService loginService;

    @PostMapping("/auth/login")
    @ApiOperation("用户登录")
    public Result<LoginVo> login(@RequestBody @Valid LoginDto loginDto) {
        LoginVo loginVo = loginService.login(loginDto);
        return Result.success(loginVo);
    }

}
