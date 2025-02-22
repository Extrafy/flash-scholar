import { ref, computed } from 'vue';

/**
 * 用于搜索表格数据的通用过滤函数
 * @param {Array} tableData - 原始数据表
 * @param {Array} fields - 需要过滤的字段名
 * @returns {Object} 包含 searchQuery 和 filteredData
 */
export function useSearch(tableData, fields) {
    // 搜索框输入内容
    const searchQuery = ref('');

    // 过滤后的数据
    const filteredData = computed(() => {
        const query = searchQuery.value.trim().toLowerCase();
        if (!query) {
            return tableData.value; // 如果没有搜索内容，返回原始数据
        }

        return tableData.value.filter((item) => {
            return fields.some(field => {
                const fieldValue = String(item[field]).toLowerCase();
    
                // 改进：将用户输入的查询当作正则表达式的一部分进行匹配
                const regex = new RegExp(query.split('').join('.*'), 'i'); 
                return regex.test(fieldValue);
            });
        });
    });

    return {
        searchQuery,
        filteredData
    };
}
