package com.zhy.management.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.zhy.common.result.Result;
import com.zhy.model.dto.LoginDto;
import com.zhy.model.entity.SysUser;
import com.zhy.model.vo.LoginVo;

public interface LoginService extends IService<SysUser> {

    /**
     * 登录接口
     * @param loginDto
     * @return
     */
    LoginVo login(LoginDto loginDto);


}
