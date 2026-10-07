package com.zhy.management.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.zhy.model.entity.SysCategory;
import com.zhy.management.mapper.SysCategoryMapper;
import com.zhy.management.service.ISysCategoryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhy.model.vo.CategoryQueryVo;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * <p>
 * 文章分类表 服务实现类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Service
public class SysCategoryServiceImpl extends ServiceImpl<SysCategoryMapper, SysCategory> implements ISysCategoryService {

    /**
     * 文章分类查询接口
     *
     * @return
     */
    @Override
    public List<CategoryQueryVo> queryAllCategory() {
        // 1. 查询所有分类
        List<SysCategory> sysCategories = list();

        // 2. 判断如果为空，返回空集合
        if (CollUtil.isEmpty(sysCategories)) {
            return Collections.emptyList();
        }

        // 3. 不为空，转VO返回
        return BeanUtil.copyToList(sysCategories, CategoryQueryVo.class);
    }



}
