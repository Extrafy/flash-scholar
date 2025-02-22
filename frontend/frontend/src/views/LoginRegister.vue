<template>

  <body>
    <main :class="{ 'sign-up-mode': isSignUpMode }" style="margin-bottom: 32px;">
      <div class="box">
        <div class="inner-box">
          <!-- 表单 -->
          <div class="forms-wrap">
            <!--sign-in-->
            <form action="index.html" autocomplete="off" class="sign-in-form">
              <div class="logo1">
                <!-- <img :src="`${imgUrl}/assets/flashq.svg`" alt="logo1" /> -->
                <h2>闪电学术</h2>
              </div>
              <div class="heading">
                <h2>欢迎回来</h2>
                <!-- <h6>Not registered yet?</h6> -->
                <h6>未注册?</h6>
                <a href="#" class="toggle" @click="toggleSignUpMode">
                  前往注册</a>
              </div>
              <!-- 表单 -->
              <div class="actual-form">
                <form>
                  <!-- <form> -->
                  <div class="input-wrap1">
                    <input type="text" minlength="3" autocomplete="off" required :key="inputFields[0].id"
                      class="input-field" :class="{ active: inputFields[0].isActive }"
                      @focus="handleFocus(inputFields[0])" @blur="handleBlur(inputFields[0])"
                      v-model="inputFields[0].value" />
                    <label>Email</label>
                  </div>
                  <div class="input-wrap1">
                    <input type="password" autocomplete="off" required :key="inputFields[1].id" class="input-field"
                      :class="{ active: inputFields[1].isActive }" @focus="handleFocus(inputFields[1])"
                      @blur="handleBlur(inputFields[1])" v-model="inputFields[1].value" />
                    <label>Password</label>
                  </div>
                  <input v-if="isAdminLogin == false" type="submit" :value=loginName class="sign-btn"
                    @click.prevent="handleLoginUser" />
                  <input v-else type="submit" :value=loginName class="sign-btn" @click.prevent="handleLoginAdmin" />
                  <div>
                    <input type="submit" value="返回主页" class="back-btn" @click.prevent="go_back" />
                    <input type="submit" :value=changeToName class="back-btn" @click.prevent="changeToAdmin" />
                  </div>

                </form>
                <!-- <p class="text">
                    忘记密码?
                    <a href="#" @click.prevent="find_lost_password">找回密码</a>
                  </p> -->
              </div>
            </form>
            <!--sign-up-->
            <form action="index.html" autocomplete="off" class="sign-up-form">
              <div class="logo2">
                <!-- <img :src="`${imgUrl}/assets/flashq.svg`" alt="log2" /> -->
                <h4>闪电学术</h4>
              </div>
              <div class="heading">
                <h2>注册</h2>
                <h6>已经有账户了?</h6>
                <a href="#" class="toggle" @click="toggleSignUpMode">
                  前往登录</a>
              </div>
              <!-- 表单 -->
              <div class="actual-form">
                <form @submit.prevent="signUp">
                  <div class="input-wrap2">
                    <input type="text" minlength="3" autocomplete="off" required :key="inputFields[2].id"
                      class="input-field" :class="{ active: inputFields[2].isActive }"
                      @focus="handleFocus(inputFields[2])" @blur="handleBlur(inputFields[2])"
                      v-model="inputFields[2].value" />
                    <label>Name</label>
                  </div>
                  <div class="input-wrap2">
                    <input type="email" autocomplete="off" required :key="inputFields[3].id" class="input-field"
                      :class="{ active: inputFields[3].isActive }" @focus="handleFocus(inputFields[3])"
                      @blur="handleBlur(inputFields[3])" v-model="inputFields[3].value" />
                    <label>Email</label>
                  </div>
                  <div class="input-wrap2" prop="newPassword">
                    <input type="password" autocomplete="off" required :key="inputFields[4].id" class="input-field"
                      :class="{ active: inputFields[4].isActive }" @focus="handleFocus(inputFields[4])"
                      @blur="handleBlur(inputFields[4])" v-model="inputFields[4].value" />
                    <label>Password</label>
                  </div>
                  <div class="input-wrap2" prop="confirmPassword">
                    <input type="password" autocomplete="off" required :key="inputFields[5].id" class="input-field"
                      :class="{ active: inputFields[5].isActive }" @focus="handleFocus(inputFields[5])"
                      @blur="handleBlur(inputFields[5])" v-model="inputFields[5].value" />
                    <label>Confirm Password</label>
                  </div>
                  <p v-if="passwordsMatch === false" class="error-message">
                    Passwords do not match!
                  </p>
                  <div class="input-wrap2" prop="">
                    <input type="test" autocomplete="off" :required="isRequired" :key="inputFields[6].id"
                      class="input-field" :class="{ active: inputFields[6].isActive }"
                      @focus="handleFocus(inputFields[6])" @blur="handleBlur(inputFields[6])"
                      v-model="inputFields[6].value" />
                    <label>Verification Code</label>
                  </div>
                  <button type="button" v-if="!isCounting" class="verification-code" @click="getVerificationCode">
                    获取验证码
                  </button>
                  <button v-else disabled="true" class="verification-code">
                    {{ count }}s后重新发送
                  </button>
                  <input type="submit" value="注册" class="sign-btn" @submit.prevent="signUp" />
                </form>
                <p class="text">
                  我已经阅读并同意
                  <a href="#" @click.prevent="terms_of_service">服务条款</a>和
                  <a href="#" @click.prevent="privacy_agreement">隐私协议</a>
                </p>
              </div>
            </form>
          </div>
          <!-- 轮播 -->
          <div class="carousel">
            <div class="images-wrapper">
              <img src="../assets/icon/login1.png"
                   alt=""
                   class="images"
                   style="width: 100%; height: 100%" />
            </div>
            <div class="text-slider">
              <div class="text-wrap">
                <div class="text-group" :style="{
                  transform: `translateY(${-currentIndex * 2.2}rem)`,
                }">
<!--                  <h2>闪电学术</h2>-->
<!--                  <h2>前所未有的</h2>-->
<!--                  <h2>学术体验</h2>-->
                </div>
              </div>
              <div class="bullets">
                <h2>闪电学术</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </body>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive , onBeforeUnmount } from "vue";
// import { useStore } from 'vuex'

import { useRouter } from 'vue-router';
import { setUserNickName, setUserAvatarURL, setUserId, setUserEmail, setIsAdmin , setUserRole, setUserAuthorId} from '../http/cookie'
import {
  userLoginApi,
  adminLoginApi,
  registerApi,
  getCodeApi
} from "../apis/loginRegister.js";
import { ElMessageBox, ElMessage } from "element-plus";

const route = useRouter()

//实现点击输入框后的样式变换
const inputFields = ref([
  { id: 1, value: "", isActive: false },
  { id: 2, value: "", isActive: false },
  { id: 3, value: "", isActive: false },
  { id: 4, value: "", isActive: false },
  { id: 5, value: "", isActive: false },
  { id: 6, value: "", isActive: false },
  { id: 7, value: "", isActive: false },
]);
const isAdminLogin = ref(false);
function handleFocus(input) {
  input.isActive = true; // 当输入框获得焦点时，激活 active 类
}
function handleBlur(input) {
  if (input.value === "") {
    input.isActive = false; // 如果输入框没有内容，移除 active 类
  }
}
const passwordsMatch = computed(() => {
  return (
    inputFields.value[4].value === inputFields.value[5].value ||
    inputFields.value[5].value === ""
  );
});
const loginName = computed(
  () => {
    return isAdminLogin.value ? "管理员登录" : "用户登录";
  }
)
const changeToName = computed(
  () => {
    return isAdminLogin.value ? "转到用户" : "转到管理员";
  }
)
const changeToAdmin = () => {
  console.log("change!!!!!!!!!");
  isAdminLogin.value = !isAdminLogin.value;
}
//login提交
const handleLogin = () => {
  console.log("this is begin loginButton");
  if (isAdminLogin.value) {
    console.log("this is admin loginButton");
    handleLoginAdmin();
    return;
  } else {
    console.log("this is user loginButton");
    handleLoginUser();
    return;
  }

}
const handleLoginUser = () => {
  const info = {
    email: inputFields.value[0].value,
    password: inputFields.value[1].value,
  }
  console.log(info);
  userLoginApi(info).then((response) => {
    const res = response.data;
    console.log(res);
    if (res.code == 200) {
      const data = res.data;
      setUserEmail(data.email);
      setUserAvatarURL(data.avatar);
      setUserNickName(data.nickname);
      setUserId(data.uid);
      setIsAdmin(false);
      setUserRole(data.role);
      if(data.role == 1&&data.authorId!==null){
        setUserAuthorId(data.authorId);
      }
      ElMessageBox.alert("用户登录成功!", {
        confirmButtonText: "确定",
        center: true,
        callback: () => {
          route.push('/').then(
            ()=> {
              window.location.reload();
            }
          )
        },
      },
    );
    } else {
      ElMessage.error("用户登录失败");
    }
    return;
  })
    .catch(err => {
      console.log(err);
      ElMessage.error("用户登录失败");
      return;
    })
}
const handleLoginAdmin = () => {
  const info = {
    email: inputFields.value[0].value,
    password: inputFields.value[1].value,
  }
  console.log(info);

  adminLoginApi(info).then((response) => {
    const res = response.data;
    console.log(res);
    if (res.code == 200) {
      const data = res.data;
      //为全局的cookie设置
      setUserEmail(data.email);
      setUserAvatarURL(data.avatar);
      setUserNickName(data.nickname);
      setUserId(data.uid);
      setIsAdmin(true);
      setUserRole(data.role);
      if(data.role == 1&&data.authorId!==null){
        setUserAuthorId(data.authorId);
      }
      ElMessageBox.alert("管理员登录成功!", {
        confirmButtonText: "确定",
        center: true,
        callback: () => {
          route.push('/admin')
        },
      },
    );
    } else {
      ElMessage.error("管理员登录失败");
    }
    return;
  })
    .catch(err => {
      console.log(err);
      ElMessage.error("管理员登录失败");
      return;
    })
}

//获取验证码
const count = ref(60);  // 倒计时的初始秒数
const isCounting = ref(false);  // 是否正在倒计时
const timer = ref(null);  // 定时器引用

// 组件创建时检查 localStorage，恢复倒计时状态
onMounted(() => {
  const lastSendTime = localStorage.getItem('lastSendTime');
  if (lastSendTime) {
    const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）
    const elapsedTime = currentTime - parseInt(lastSendTime);
    if (elapsedTime < 60) {
      // 如果剩余时间大于 0，则恢复倒计时
      count.value = 60 - elapsedTime;
      startCountdown();
    } else {
      localStorage.removeItem('lastSendTime');
    }
  }
});

const startCountdown = () => {
  isCounting.value = true;
  timer.value = setInterval(() => {
    if (count.value > 0) {
      count.value -= 1;
    } else {
      isCounting.value = false;
      clearInterval(timer.value);
      localStorage.removeItem('lastSendTime');
    }
  }, 1000);
};
const isRequired = ref(true);
const getVerificationCode = async () => {
  isRequired.value = false;
  const emailInfo = inputFields.value[3].value;
  console.log(emailInfo);
  try {
    getCodeApi(emailInfo).then(async (response) => {
      console.log(response);
      
      if(response.code == 200) {
        ElMessage.success("获取验证码成功！");
          localStorage.setItem('lastSendTime', Math.floor(Date.now() / 1000));
          // 开始倒计时
          count.value = 60;
          startCountdown();
      }else{
        ElMessage.error("获取验证码失败！");
      }
    });
  } catch (error) {
    console.error("获取邮箱验证码失败:", error);
    // 处理错误，显示错误信息等
  }
  isRequired.value = true;
};
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
//sigup提交
const signUp = async () => {
  if(inputFields.value[2].value==""||inputFields.value[3].value==""||inputFields.value[4].value==""||inputFields.value[5].value==""||inputFields.value[6].value==""){
    ElMessage.error("请输入完整信息");
    return;
  }
  console.log([inputFields.value[4].value,inputFields.value[5].value])
  if(inputFields.value[4].value!==inputFields.value[5].value){
    ElMessage.error("两次输入的密码不一致");
    return;
  }
  if(inputFields.value[6].value==""){
    ElMessage.error("请输入验证码");
    return;
  }
  const info = {
    email: inputFields.value[3].value,
    nickname: inputFields.value[2].value,
    password: inputFields.value[4].value,
    activeCode: inputFields.value[6].value
  }
  try {
    registerApi(info).then((response) => {
      console.log("发送注册成功:", response.data);
      // 处理响应数据，例如保存token，跳转页面等
      const statusCode = response.code;
      if(statusCode==200){
        ElMessageBox.alert("注册成功", "Success!", {
            confirmButtonText: "确定",
            callback: () => {
              location.reload();
            },
          });
      }else{
        ElMessage.error("注册失败");
      }
    }) 
  } catch (error) {
    console.error("注册失败:", error);
    // 处理错误，显示错误信息等
  }
};

//切换sign_in和sign_up

const isSignUpMode = ref(false);

function toggleSignUpMode() {
  isSignUpMode.value = !isSignUpMode.value;
}

//轮播图

const currentIndex = ref(0);
const images = [
  { id: 1, url: "login1.png", index: 0 },
  // { id: 2, url: "login2.png", index: 1 },
  // { id: 3, url: "login5.png", index: 2 },
];

function moveSlider(index) {
  currentIndex.value = index;
}

// 自动轮播功能
let intervalId = null;
const startAutoPlay = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 3000); // 每3秒切换图片
};

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});

//实现服务条款

const terms_of_service = () => {
  // 在这里可以执行点击服务条款后的其他操作，然后进行页面跳转
  // router.push("/terms_of_service"); // 将'/terms'替换为服务条款页面的路由路径
  // window.open(
  //   "https://flash-questionnaire.github.io/archives/服务条款",
  //   "_blank"
  // );
};

const privacy_agreement = () => {
  // 在这里可以执行点击隐私协议后的其他操作，然后进行页面跳转
  // router.push("/privacy_agreement");
  // window.open(
  //   "https://flash-questionnaire.github.io/archives/隐私协议",
  //   "_blank"
  // );
};
const go_back = () => {
  // 在这里可以执行点击忘记密码后的其他操作，然后进行页面跳转
  route.push("/");
};
</script>

<style scoped>
*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
}

main {
  width: 100%;
  overflow: hidden;
  min-height: 100vh;
  padding: 2rem;
  background-color: #72adff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.error-message {
  margin-bottom: 15px;
  color: red;
}

.box {
  width: 100%;
  max-width: 1275px;
  height: 90vh;
  background-color: #fff;
  position: relative;
  border-radius: 3.3rem;
  box-shadow: 0 60px 40px -30px rgba(0, 0, 0, 0.27);
}

.inner-box {
  position: absolute;
  width: calc(100% - 4.1rem);
  height: calc(100% - 4.1rem);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.forms-wrap {
  position: absolute;
  height: 100%;
  width: 45%;
  left: 0;
  top: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  transition: 0.8s ease-in-out;
}

form {
  max-width: 260px;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  grid-column: 1/2;
  grid-row: 1/2;
  transition: opacity 0.02s 0.4s;
}

form.sign-up-form {
  opacity: 0;
  pointer-events: none;
}

.logo1 {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  /* 可调整logo与边界的距离 */
}

.logo1 img {
  height: 27px;
  margin-right: 0.3rem;
  width: 27px;
}

.logo1 h4 {
  font-size: 1.4rem;
  letter-spacing: -0.5px;
  color: #151111;
}

.logo2 {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  /* 可调整logo与边界的距离 */
}

.logo2 img {
  height: 27px;
  margin-right: 0.3rem;
  width: 27px;
}

.logo2 h4 {
  font-size: 1.4rem;
  letter-spacing: -0.5px;
  color: #151111;
}

.heading h2 {
  font-size: 2.4rem;
  font-weight: 600;
  color: #151111;
}

.heading h6 {
  color: #bababa;
  font-weight: 400;
  font-size: 0.9rem;
  display: inline;
}

.toggle {
  color: #151111;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: 0.3s;
}

.toggle:hover {
  color: #8371fd;
}

.input-wrap1 {
  position: relative;
  height: 50px;
  margin-bottom: 2rem;
}

.input-wrap2 {
  position: relative;
  height: 37px;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.input-field {
  position: absolute;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  border-bottom: 1px solid #bbb;
  padding: 0;
  font-size: 0.95rem;
  color: #151111;
  transition: 0.4s;
}

label {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  color: #bbb;
  pointer-events: none;
  transition: 0.4s;
}

.input-field.active {
  border-bottom-color: #151111;
}

.input-field.active+label {
  font-size: 0.75rem;
  top: -2px;
}

.verification-code {
  display: inline-block;
  width: 50%;
  height: 43px;
  background-color: hsl(205, 78%, 44%);
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  margin-bottom: 2rem;
  transition: 0.3s;
}

.verification-code:hover {
  background-color: #8371fd;
}

.sign-btn {
  display: inline-block;
  width: 100%;
  height: 43px;
  background-color: #151111;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  margin-bottom: 4rem;
  transition: 0.3s;
}

.back-btn {
  display: inline-block;
  left: 0;
  width: 44%;
  height: 43px;
  background-color: #151111;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 0.8rem;
  font-size: 0.8rem;
  margin-bottom: 2rem;
  margin-left: 3%;
  margin-right: 3%;
  transition: 0.3s;
}

.back-btn:hover {
  background-color: #8371fd;
}

.sign-btn:hover {
  background-color: #8371fd;
}

.text {
  color: #bbb;
  font-size: 0.9rem;
}

.text a {
  color: #bbb;
  transition: 0.3s;
}

.text a:hover {
  color: #8371fd;
}

main.sign-up-mode form.sign-in-form {
  opacity: 0;
  pointer-events: none;
}

main.sign-up-mode form.sign-up-form {
  opacity: 1;
  pointer-events: all;
}

main.sign-up-mode .forms-wrap {
  left: 55%;
}

main.sign-up-mode .carousel {
  left: 0%;
}

.carousel {
  background-color: #8cdcfc;
  border-radius: 2rem;
  padding: 1rem;
  overflow: inherit;
  position: absolute;
  height: 100%;
  width: 55%;
  left: 45%;
  top: 0;
  /* background-color: #ffe0d2; */
  display: grid;
  grid-template-rows: 8fr 2fr;
  transition: 0.8s ease-in-out;
}

.images-wrapper {
  grid-row: 1/2;
  width: 60%;
  height: 90%;
  margin: auto;
}

.images {
  /* 居中项 */
  height: 100%;
  width: 100%;
  opacity: 1;
  transition: opacity 0.3s, transform 0.5s;
}

.image.show {
  display: block;
}

.text-slider {
  grid-row: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-wrap {
  max-height: 2.2rem;
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.text-group {
  display: flex;
  flex-direction: column;
  text-align: center;
  transform: translateY(0);
  transition: 0.5s;
}

.text-group h2 {
  line-height: 2.2rem;
  font-weight: 600;
  font-size: 1.6rem;
}

.bullets {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bullets span {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.2rem;
  background-color: #aaa;
  margin: 0 0.25rem;
  cursor: pointer;
  transition: 0.3s;
}

.bullets span.active {
  width: 1.1rem;
  background-color: #151111;
  border-radius: 1rem;
}

@media (max-width: 850px) {
  .box {
    height: auto;
    max-width: 550px;
    overflow: hidden;
  }

  .inner-box {
    position: static;
    transform: none;
    width: revert;
    height: revert;
    padding: 2rem;
  }

  .forms-wrap {
    position: revert;
    width: 100%;
    height: 100%;
  }

  form {
    max-width: revert;
    padding: 1.5rem, 2.5rem, 2rem;
    transition: transform 0.8s ease-in-out, opacity 0.45s linear;
  }

  .heading {
    margin: 2rem 0;
  }

  form.sign-up-form {
    transform: translateX(100%);
  }

  main.sign-up-mode form.sign-in-form {
    transform: translateX(-100%);
  }

  main.sign-up-mode form.sign-up-form {
    transform: translateX(0%);
  }

  .carousel {
    position: revert;
    height: auto;
    width: 100%;
    padding: 3rem 2rem;
    display: flex;
  }

  .images-wrapper {
    display: none;
  }

  .images {
    display: grid;
    place-items: center;
    /* 居中项 */
    height: 40vh;
    grid-column: 1/2;
    grid-row: 1/2;
    opacity: 0;
    /* 确保图片完全不透明 */
    transition: opacity 0.3s, transform 0.5s;
  }

  .text-slider {
    width: 100%;
  }
}

@media (max-width: 530px) {
  main {
    padding: 1rem;
  }

  .box {
    border-radius: 2rem;
  }

  .inner-box {
    padding: 1rem;
  }

  .image {
    display: grid;
    place-items: center;
    /* 居中项 */
    height: 40vh;
    grid-column: 1/2;
    grid-row: 1/2;
    opacity: 1;
    /* 确保图片完全不透明 */
    transition: opacity 0.3s, transform 0.5s;
  }

  .carousel {
    padding: 1.5rem 1rem;
    border-radius: 1.6rem;
  }

  .text-wrap {
    margin-bottom: 1rem;
  }

  .text-group h2 {
    font-size: 1.2rem;
  }

  form {
    padding: 1rem 2rem 1.5rem;
  }
}
</style>