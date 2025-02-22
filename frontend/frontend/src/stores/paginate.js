import { ref, computed } from 'vue';

/**
 * 通用分页逻辑 Hook
 * @param {Array} data - 数据列表
 * @param {number} pageSize - 每页显示的条数，默认为 10
 * @returns {Object} - 包含分页相关的属性和方法：
 * @property {Ref<number>} currentPage - 当前页码的引用，默认为 1，可通过双向绑定动态更新。
 * @property {number} pageSize - 每页显示的条数，传入时指定，默认值为 10。
 * @property {ComputedRef<Array>} paginatedData - 计算属性，返回当前页的要展示的全部条目。
 * @property {Function} handlePageChange - 用于更改当前页码的函数，接受一个新的页码作为参数，并更新 `currentPage`。
 */

export const usePagination = (data, pageSize = 10) => {
    const currentPage = ref(1);

    // 分页计算
    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        return data.value.slice(start, start + pageSize);
    });

    // 页码变化事件
    const handlePageChange = (page) => {
        currentPage.value = page;
    };

    return {
        currentPage,
        pageSize,
        paginatedData,
        handlePageChange,
    };
};
