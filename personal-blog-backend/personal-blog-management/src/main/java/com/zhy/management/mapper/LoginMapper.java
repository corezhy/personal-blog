package com.zhy.management.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhy.model.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户登录Mapper
 */
@Mapper
public interface LoginMapper extends BaseMapper<SysUser> {
}
