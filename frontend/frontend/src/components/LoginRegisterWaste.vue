<template>
  <div>
    <!-- <el-button @click="isLoginVisible=true">login</el-button> -->
    <div class="body" v-if="isLoginVisible">
      <div class="main-box">
          <div :class="['container', 'container-register', { 'is-txl': isLoginHome }]">
              <form>
                  <h2 class="title">注册</h2>
                  <div class="form-icons">
<!--                        <img class="form-icon" src="@/assets/img/wechat.png" alt="微信登录" />-->
<!--                        <img class="form-icon" src="@/assets/img/alipay.png" alt="支付宝登录" />-->
<!--                        <img class="form-icon" src="@/assets/img/QQ.png" alt="QQ登录" />-->
                  </div>
                  <span class="text">使用邮箱进行注册</span><br />
                  <input v-model="registerForm.email" class="form-input" type="text" placeholder="请输入邮箱" />
                  <input v-model="registerForm.username" class="form-input" type="text" placeholder="请输入用户名" />
                  <input v-model="registerForm.password" class="form-input" type="password" placeholder="请输入密码" />
                  <input v-model="registerForm.checkPwd" class="form-input" type="password" placeholder="请再次输入密码"
                       />
                       <input v-model="registerForm.activeCode" class="form-input" type="text" placeholder="请输入验证码" />
                  <div class="form-button" @click="getActiveCode()">获取验证码</div>
                  <div class="form-button" @click="register()">立即注册</div>
              </form>
          </div>
          <div :class="['container', 'container-login', { 'is-txl is-z200': isLoginHome }]">
              <form>
                  <h2  class="title">{{loginName}}登录</h2>

                  <div class="form-icons">
<!--                        <img class="form-icon" src="@/assets/img/wechat.png" alt="微信登录" />-->
<!--                        <img class="form-icon" src="@/assets/img/alipay.png" alt="支付宝登录" />-->
<!--                        <img class="form-icon" src="@/assets/img/QQ.png" alt="QQ登录" />-->
                  </div>
                  <span class="text">使用邮箱登录</span>
                  <input v-model="loginForm.email" class="form-input" type="text" placeholder="请输入邮箱" />
                  <input v-model="loginForm.password" class="form-input" type="password" placeholder="请输入密码"
                       />
                  <div  class="form-button" @click="goLogin()">{{loginName}}登录</div>
              </form>
          </div>
          <div :class="['switch', { login: isLoginHome }]">
              <div class="switch-circle"></div>
              <!-- <div class="switch-circle switch-circle_top"></div> -->
              <div class="switch-container">
                  <h2>{{ isLoginHome ? "欢迎回来！" : "您好！" }}</h2>
                  <p>
                      {{ isLoginHome ? "如果您还没有账号" : "如果您已经注册过账号" }}
                      <br />
                      {{
                          isLoginHome
                              ? "请点击下方立即注册按钮进行注册"
                              : "请点击下方立即登录按钮进行登录"
                      }}
                  </p>
                  <div class="form-button" @click="isLoginHome = !isLoginHome">
                      {{ isLoginHome ? "立即注册" : "立即登录" }}
                  </div>
                  <div class="cancel-button" @click="changeToLogin">{{toLoginName}}登录</div>
                  <div class="cancel-button" @click="cancel">取消</div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>


<script>

import { ElMessage, ElStep } from 'element-plus';
import { getCodeApi, userLoginApi, registerApi, adminLoginApi } from '@/apis/loginRegister.js';
import {setUserEmail} from '../http/cookie.js';
export default {
    props:{
        isLoginVisible: {
            type: Boolean,
            default: true
        }
    },

  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      registerForm: {
        username:"",
        email:"",
        password:"",
        checkPwd:"",
        activeCode:""
       },
       adminLogin: false,
      isLoginHome: true,   
    };
  },
  methods: {
    
    userLogin(){
        if(this.loginForm.email == ""){
            ElMessage.error('请输入邮箱！');
            return;
        }
        if(this.loginForm.password == ""){
            ElMessage.error('请输入密码！');
            return;
        }
        const info = {
            email: this.loginForm.email,
            password: this.loginForm.password
        };
        userLoginApi(info).then((res) => {
            ElMessage.success("用户登录成功");
            //为全局的cookie设置
            setUserEmail(info.email);
            this.$emit("update-loginVisiable");//向上传递关闭登录/注册框
        }).catch((err) => {
            ElMessage.error('登录失败，请稍后重试');
        });
    },
    adminLogin(){
        if(this.loginForm.email == ""){
            ElMessage.error('请输入邮箱！');
            return;
        }
        if(this.loginForm.password == ""){
            ElMessage.error('请输入密码！');
            return;
        }
        const info = {
            email: this.loginForm.email,
            password: this.loginForm.password
        };
        adminLoginApi(info).then((res) => {
            ElMessage.success("管理员登录成功");
            //为全局的cookie设置
            setUserEmail(info.email);
            this.$emit("update-loginVisiable");//向上传递关闭登录/注册框
        }).catch((err) => {
            ElMessage.error('登录失败，请稍后重试');
        });
    },
    goLogin(){
        if(this.adminLogin==true){
            this.adminLogin()
        }else{
            this.userLogin();
        }
    },
    getActiveCode(){
        const info = this.registerForm.email;
        getCodeApi(info).then((res) => {
            console.log(res);
            ElMessage.success("验证码已发送");
        }).catch((err) => {
            console.log(err);
            ElMessage.error('验证码发送失败，请稍后重试');
        });
    },
    register(){
        if(this.registerForm.email == ""){
            ElMessage.error('请输入邮箱！');
            return;
        }
        if(this.registerForm.username == ""){
            ElMessage.error('请输入用户名！');
            return;
        }
        if(this.registerForm.password != this.registerForm.checkPwd){
            ElMessage.error('两次输入的密码不一致，请重新输入！');
            return;
        }
        if(this.registerForm.activeCode == ""){
            ElMessage.error('请输入验证码！');
            return;
        }
        const info = {
            email: this.registerForm.email,
            nickname: this.registerForm.username,
            password: this.registerForm.password,
            activeCode: this.registerForm.activeCode,
        };
        registerApi(info).then((res) => {
            console.log(res);
            ElMessage.success("注册成功");
        }).catch((err) => {
            console.log(err);
            ElMessage.error('注册失败，请稍后重试');
        });
        // 处理返回的数据，可能是显示成功消息或者处理错误
    
    },
    cancel() {
        this.isLoginHome = true;
        this.$emit("update-loginVisiable");
    },
    changeToLogin(){
        if(this.adminLogin==true){
            this.changeToUserLogin();
        }else{
            this.changeToAdminLogin();
        }
    },
    changeToAdminLogin(){
        this.isLoginHome = true;
        this.adminLogin = true;
        console.log(this.adminLogin);
    },
    changeToUserLogin(){
        this.isLoginHome = true;
        this.adminLogin = false;
        console.log(this.adminLogin);
    }

  },
  computed:{
    loginName(){
        return this.adminLogin ? "管理员" : "用户";
    },
    toLoginName(){
        return this.adminLogin ? "用户" : "管理员";
    }
  }
};
</script>

<style scoped>
.body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 12px;
    color: #a0a5a8;
}

.main-box {
    position: fixed;
    z-index: 10;
    width: 1000px;
    min-width: 1000px;
    min-height: 600px;
    height: 600px;
    padding: 25px;
    background-color: #ecf0f3;
    box-shadow: 1px 1px 100px 10px #ecf0f3;
    border-radius: 12px;
    overflow: hidden;
}

.main-box .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: all 1.25s;
}

.main-box .container form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: #a0a5a8;
}

.main-box .container form .form-icon {
    object-fit: contain;
    width: 30px;
    margin: 0 5px;
    opacity: 0.5;
    transition: 0.15s;
}

.main-box .container form .form-icon:hover {
    opacity: 1;
    transition: 0.15s;
    cursor: pointer;
}

.main-box .container form .title {
    font-size: 34px;
    font-weight: 700;
    line-height: 2;
    color: #181818;
    size: 30px;
}

.main-box .container form .text {
    margin-top: 12px;
    margin-bottom: 12px;
    font-size: 18px;
}

.main-box .container form .form-input {
    width: 350px;
    height: 40px;
    margin: 4px 0;
    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;
    background-color: #ecf0f3;
    transition: 0.25s ease;
    border-radius: 8px;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.main-box .container form .form-input::placeholder {
    color: #a0a5a8;
}

.main-box .container-register {
    z-index: 100;
    left: calc(100% - 650px);
}

.main-box .container-login {
    left: calc(100% - 600px);
    z-index: 0;
}

.main-box .is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
}

.main-box .is-z200 {
    z-index: 200;
    transition: 1.25s;
}

.main-box .switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 300px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
    color: #a0a5a8;
}

.main-box .switch .switch-circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
    bottom: -60%;
    left: -60%;
    transition: 1.25s;
}

.main-box .switch .switch-circle_top {
    top: -30%;
    left: 60%;
    width: 300px;
    height: 300px;
}

.main-box .switch .switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    transition: 1.25s;
}

.main-box .switch .switch-container h2 {
    font-size: 34px;
    font-weight: 700;
    line-height: 3;
    color: #181818;
}

.main-box .switch .switch-container p {
    font-size: 16px;
    letter-spacing: 0.25px;
    text-align: center;
    line-height: 1.6;
}

.main-box .login {
    left: calc(100% - 400px);
}

.main-box .login .switch-circle {
    left: 0;
}

.main-box .cancel-button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #e74c3c;
    /* Red color for cancel button */
    margin-top: 20px;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
}

.main-box .cancel-button:hover {
    box-shadow: 2px 2px 3px 0 rgba(255, 255, 255, 0.5),
        -2px -2px 3px 0 rgba(116, 125, 136, 0.5),
        inset -2px -2px 3px 0 rgba(255, 255, 255, 0.2), inset 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.main-box .form-button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 15px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    letter-spacing: 2px;
    background-color: #4b70e2;
    color: #f9f9f9;
    cursor: pointer;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
}

.main-box .form-button:hover {
    box-shadow: 2px 2px 3px 0 rgba(255, 255, 255, 0.5),
        -2px -2px 3px 0 rgba(116, 125, 136, 0.5),
        inset -2px -2px 3px 0 rgba(255, 255, 255, 0.2), inset 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
</style>
