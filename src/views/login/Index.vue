<template>
  <div class="logincontainer">
      <img class="loginimg" src="../../assets/login.jpg"/>
      <div class="loginbox">
          <!-- <img src="../../assets/logo.jpg"> -->
          <div class="logoText">
            <img src="../../assets/logo.png" style="width: 50px;display: inline-block;">
          <span style="display: inline-block;">美影快排操作平台</span>
          </div>
          <!-- <div class="logoText">美影后台管理系统</div> -->
          <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px" class="loginformbox">
              <el-form-item label="用户名" prop="username">
                  <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item style="margin-top: 40px;">
                  <el-button style="width: 180px" type="primary" @click="handleSubmit">登录</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
export default defineComponent({
  setup() {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const loginForm = ref({
      username: '',
      password: ''
    })
    const router = useRouter()
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ]
    }

    const loginFormRef = ref<HTMLImageElement | any>()

    const handleSubmit = () => {
      loginFormRef.value.validate((valid: any) => {
        if (valid) {
          // proxy.$message.success('登录成功')
          // const info = { username: loginForm.value.username}
          // const token = '333'
          // proxy.$store.dispatch('setUserInfoAsync', info)
          // proxy.$store.commit('setToken', token)
          // router.push({
          //     path: '/'
          // })
          const { username, password }  = loginForm.value
          api.home.submitauthlogin({
            name: username,
            password: password
          }).then((res: any) => {
            const { code, token, msg } = res
            if (code === 200) {
              proxy.$message.success(msg)
              const info = { username: loginForm.value.username}
              proxy.$store.dispatch('setUserInfoAsync', info)
              proxy.$store.commit('setToken', token)
              router.push({
                  path: '/'
              })
            } else {
              proxy.$message.error(msg)
            }
          }).catch((error: any) => {
            // proxy.$message.error('登录失败，请联系管理员!')
            proxy.$message.error(error)
          })
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    }

    return {
      loginForm,
      rules,
      loginFormRef,
      handleSubmit
    }
  }
})
</script>
<style scoped lang="less">
.loginimg {
  width: 100%;
} 
.logincontainer {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .loginbox {
      width: 370px;
      height: 300px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* 黑色阴影 */
      opacity: 1; /* 设置不透明度为0.8，即80%的不透明 */
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      padding: 0 30px 15px 15px;
  }
  .logoText {
      width: 100%;
      height: 80px;
      font-size: 24px;
      font-weight: bold;
      line-height: 80px;
      margin-bottom: 20px;
      color: #409eff;
      position: relative;
      img {
        position: absolute;
        top: 20px;
        left: 20px;
      }
      span {
        position: absolute;
        top: 5px;
        left: 80px;
      }
  }
}
</style>