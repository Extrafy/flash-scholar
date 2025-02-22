import { createRouter, createWebHistory } from 'vue-router';
import home from '@/views/home.vue';
import article from '@/views/article.vue';
import admin from '@/views/admin.vue';
import DataStatus from '@/components/admin/backendData.vue';
import AuditClaim from '@/components/admin/auditClaim.vue';
import UserManagement from '@/components/admin/userMgmt.vue';
import applySettle from '@/views/applySettle.vue';
import errorPage from '@/views/404.vue'
import searchResult from '@/views/searchResult.vue';
import PersonalPage from "@/views/PersonalPage.vue";
import ScholarPage from "@/views/ScholarPage.vue";
import Comment from "@/views/comment.vue";
import LoginRegister from '@/views/loginRegister.vue';
import message from '@/views/message.vue';
import institutionPage from "@/views/institutionPage.vue";
import conceptPage from "@/views/conceptPage.vue"

const routes = [
    { path: '/', component: home },
    { path: '/article/:id', component: article },  // 暂时先按id决定路由，可以根据后端需求再修改
    {
        path: '/admin',
        component: admin,
        children: [
            { path: '', component: DataStatus},
            { path: 'DataStatus', component: DataStatus },
            { path: 'AuditClaim',component:AuditClaim},
            { path: 'User', component: UserManagement}
        ]
    },
    { path: '/search', component: searchResult },
    { path: '/applySettle', component: applySettle },
    { path: '/person/:id', component: PersonalPage},
    { path: '/scholar/:id', component: ScholarPage},
    { path: '/comment/:articleId/:commentId', component: Comment },
    { path: '/error', component: errorPage},
    { path: '/loginRegister', component: LoginRegister },
    { path: '/message/:id', component: message },
    { path: '/institution/:id', component: institutionPage },
    { path: '/concept/:id', component: conceptPage},
]

const router = createRouter({
    routes,
    history: createWebHistory(),
});

export default router
