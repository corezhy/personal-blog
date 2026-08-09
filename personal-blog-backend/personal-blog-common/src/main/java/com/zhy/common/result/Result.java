package com.zhy.common.result;

import lombok.Data;

/*
 * 后端统一返回结果（泛型版本）
 * */
@Data
public class Result<T> {
    private Integer code; // 1成功，0失败
    private String msg;   // 错误信息
    private T data;       // 泛型数据

    // 1. 成功，无数据返回
    public static Result<Void> success() {
        Result<Void> result = new Result<>();
        result.code = 1;
        result.msg = "success";
        return result;
    }

    // 2. 成功，带数据返回（自动推断泛型类型）
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.code = 1;
        result.msg = "success";
        result.data = data;
        return result;
    }

    // 3. 失败，仅错误信息（无数据）
    public static Result<Void> error(String msg) {
        Result<Void> result = new Result<>();
        result.code = 0;
        result.msg = msg;
        return result;
    }

    // 4. 失败，带错误信息 + 自定义数据（可选，应对需要返回额外错误详情场景）
    public static <T> Result<T> error(String msg, T data) {
        Result<T> result = new Result<>();
        result.code = 0;
        result.msg = msg;
        result.data = data;
        return result;
    }
}