// composables/useStatTransition.js
import { toRef } from "vue";
import { useTransition, TransitionPresets } from "@vueuse/core";

/**
 * 封装统计数据的动态过渡逻辑
 * @param {Object} stat - 单个统计项
 * @param {String} key - 要绑定动态过渡的键
 * @param {Object} options - 过渡选项（可选）
 */
export function useStatTransition(stat, key, options = {}) {
    return useTransition(toRef(stat, key), {
        duration: 1000,
        transition:TransitionPresets.easeOutExpo,
        ...options,
        transform: (value) => Math.floor(value),
    });
}
