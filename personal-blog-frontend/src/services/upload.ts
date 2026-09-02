/**
 * API 层 —— 图片上传
 *
 * 约定后端接口：POST /upload
 *   - Content-Type: multipart/form-data，字段名 file
 *   - 需登录（后端鉴权）
 *   - 返回 Result<{ url: string }>，data.url 为可直接用于 <img> 展示的完整地址
 *
 * 图片展示链路：本服务把图片传成 URL 后，封面回填 cover、正文插入 markdown 语法，
 * 随"新增文章"请求一起提交；后端只存 URL。图片本身由本接口交给后端传 OSS。
 */
import request from './request'

/** 上传成功返回结构 */
export interface UploadImageResult {
  url: string
}

/** 允许上传的最大图片大小（5MB） */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

/** 是否图片类型（仅允许 image/*） */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 上传图片文件，返回可访问 URL。
 * 统一走 request 封装：自动携带 token、自动校验 code 并解包 data、失败自动弹错。
 */
export function uploadImage(file: File): Promise<UploadImageResult> {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<UploadImageResult>('/upload', formData)
}
