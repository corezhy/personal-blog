package com.zhy.management.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.zhy.model.entity.SysTag;
import com.zhy.management.mapper.SysTagMapper;
import com.zhy.management.service.ISysTagService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.zhy.model.vo.TagsQueryVo;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * <p>
 * 文章标签表 服务实现类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
@Service
public class SysTagServiceImpl extends ServiceImpl<SysTagMapper, SysTag> implements ISysTagService {

    /**
     * 查询所有标签
     *
     * @return
     */
    @Override
    public List<TagsQueryVo> queryAllTags() {
        // 1. 查询所有标签
        List<SysTag> tags = list();

        // 2. 判断是否为空，如果是空，返回空集合
        if (CollUtil.isEmpty(tags)) {
            return Collections.emptyList();
        }

        // 3.如果不为空，转VO返回
        return BeanUtil.copyToList(tags, TagsQueryVo.class);
    }

}
