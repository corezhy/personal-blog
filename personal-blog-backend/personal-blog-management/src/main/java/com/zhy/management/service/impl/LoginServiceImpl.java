package com.zhy.management.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhy.common.result.Result;
import com.zhy.management.exception.BusinessException;
import com.zhy.management.mapper.LoginMapper;
import com.zhy.management.service.LoginService;
import com.zhy.model.dto.LoginDto;
import com.zhy.model.entity.SysUser;
import com.zhy.model.vo.LoginVo;
import com.zhy.model.vo.UserInfoVo;
import com.zhy.utils.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class LoginServiceImpl extends ServiceImpl<LoginMapper, SysUser> implements LoginService {

    // 直接创建实例 参数： 强度参数（4~31，默认10）
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private final JwtUtils jwtUtils;

    /**
     * 登录接口
     * @param loginDto
     * @return
     */
    @Override
    public LoginVo login(LoginDto loginDto) {
        // 1. 获取前端传递用户名和密码
        String username = loginDto.getUsername();
        String password = loginDto.getPassword();

        // 2. 根据用户名查询数据库返回user
        SysUser user = getOne(Wrappers.<SysUser>lambdaQuery().eq(SysUser::getUsername, username));
        if (user == null) {
            throw new BusinessException("用户名或密码错误!");
        }

        // 3.获取查询出来的用户密码，通过Bcrypt解密后是否正确
        if (!encoder.matches(password, user.getPassword())) {
            throw new BusinessException("用户名或密码错误!");
        }

        // 4.生成token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("username", user.getUsername());
        String token = jwtUtils.generateJwt(user.getId().toString(), claims);

        // 5.设置最近登录时间
        boolean isSuccess = update(Wrappers.<SysUser>lambdaUpdate()
                .set(SysUser::getLastLoginAt, LocalDateTime.now())
                .eq(SysUser::getId, user.getId()));
        if (!isSuccess) {
            throw new BusinessException("设置最近登录时间失败！");
        }

        // 6.组装返回数据
        UserInfoVo userInfo = UserInfoVo.builder()
                .id(user.getId())
                .role(user.getRole())
                .name(user.getName())
                .build();
        return LoginVo.builder()
                .userInfo(userInfo)
                .token(token)
                .build();
    }
}
