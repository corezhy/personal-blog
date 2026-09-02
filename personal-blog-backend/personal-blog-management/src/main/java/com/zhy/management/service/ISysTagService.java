package com.zhy.management.service;

import com.zhy.management.domain.po.SysTag;
import com.baomidou.mybatisplus.extension.service.IService;
import com.zhy.model.vo.TagsQueryVo;

import java.util.List;

/**
 * <p>
 * 文章标签表 服务类
 * </p>
 *
 * @author Java-zhy
 * @since 2026-09-01
 */
public interface ISysTagService extends IService<SysTag> {

    /**
     * 查询所有标签
     * @return
     */
    List<TagsQueryVo> queryAllTags();

}
