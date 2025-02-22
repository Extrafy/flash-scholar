<template>
    <el-container>
        <el-main>
            <div class="admin-main">
              <!-- 侧边栏菜单 -->
              <el-menu 
                class="el-menu-admin" 
                :router="true" 
                :default-active="currentPath"
                >
                <el-menu-item 
                    v-for="menuItem in menuList" 
                    :key="menuItem.path" 
                    :index="menuItem.path"
                     @click="menuItem.name === '退出登录' ? handleLogout() : handleMenuClick(menuItem.path)"
                >
                    <el-icon>
                        <component :is="menuItem.icon" />
                    </el-icon>
                    {{ menuItem.name }}
                </el-menu-item>
            </el-menu>
                <!-- 主内容区 -->
            <div class="content-container">
                <router-view />
            </div>
        </div>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {getIsAdmin,removeCookie } from '@/http/cookie'
import { ElMessage } from 'element-plus';
const menuList = [
    { name: '数据状况', path: '/admin/DataStatus', icon: 'Menu' },
    // { name: '审核认领', path: '/admin/AuditClaim', icon: 'Document' },
    { name: '用户管理', path: '/admin/User', icon: 'User' },
    { name: '退出登录', path: '/', icon: 'SwitchButton' },
];

const route = useRoute();
const currentPath = ref(route.path);
const router = useRouter();

const handleLogout = () => {
    removeCookie();
    router.push('/'); 
    ElMessage.success('已退出登录');
};


const handleMenuClick = (path) => {
    currentPath.value = path; 
    router.push(path); 
};

onMounted(async() => {
    if (!getIsAdmin()) {
        router.push('/');
        ElMessage.error('无管理员权限！');
    } 
});
</script>

<style scoped>
.el-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #f4f5f7;
}

.admin-main {
    display:flex;
    margin-left:3%;
    margin-right:7%;
    min-width: 1300px;
    width:90%;
}

.el-menu-admin {
    width:20%;
    height:40%;
    margin-right: 5%;
    margin-top: 35px;
    border-radius: 2%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}


.content-container {
    display:flex;
    margin-top: 35px;
    width:75%;
    padding: 2%;
    background: #ffffff;
    border-radius: 1%;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>