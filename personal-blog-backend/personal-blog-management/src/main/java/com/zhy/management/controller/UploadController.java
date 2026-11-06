package com.zhy.management.controller;

import com.zhy.common.result.Result;
import com.zhy.utils.oss.AliyunOSSOperator;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * 上传图片到阿里云oss
 */
@Slf4j
@RestController
@Api(tags = "图片上传")
@RequiredArgsConstructor
public class UploadController {

    private final AliyunOSSOperator aliyunOSSOperator;

    @ApiOperation("图片上传接口")
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public Result<String> upload(MultipartFile file) {
        try {
            log.info("上传文件：{}", file);
            //1. 判空
            if (file == null || file.isEmpty()) {
                return Result.error("未选择文件");
            }
            //2. 校验文件大小（兜底，放绕过）
            if(file.getSize() > 10 * 1024 * 1024) { //10MB
                return Result.error("文件大小不能超过10MB");
            }
            //3. 校验文件类型（更安全的方式：不只看扩展名）
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.lastIndexOf(".") == -1) {
                return Result.error("无效的文件名");
            }

            String ext = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            List<String> allowedExts = Arrays.asList(".jpg", ".jpeg", ".png");
            if (!allowedExts.contains(ext)) {
                return Result.error("仅支持 JPG/PNG 格式图片");
            }

            //4. 上传
            String uniqueFileName = UUID.randomUUID().toString().replace("-", "") + ext;
            String url = aliyunOSSOperator.upload(file.getBytes(), uniqueFileName);
            return Result.success(url);
        }catch (Exception e) {
            log.error("文件上传异常", e);
            return Result.error("上传失败，请稍后重试");
        }
    }

}
