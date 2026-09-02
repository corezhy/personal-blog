package com.zhy.management.service;

import com.zhy.management.domain.po.SysCategory;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhy.model.vo.CategoryQueryVo;

import java.util.List;

/**
 * <p>
 * 文章分类表 服务类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
public interface ISysCategoryService extends IService<SysCategory> {

    /**
     * 文章分类查询接口
     * @return
     */
    List<CategoryQueryVo> queryAllCategory();

}
