<template>
    <el-dialog
      title="修改密码"
      v-model="dialogVisible"
      width="400"
      append-to-body
      @close="resetForm"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, getCurrentInstance, ComponentInternalInstance} from 'vue';
  import api from '@/api'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'ResetPasswordDialog',
    setup() {
      const router = useRouter()
      const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
      const dialogVisible = ref(false);
      const form = ref({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        ispw: true
      });
      const confirmPasswordValidator = (rule: any, value: any, callback) => {
        console.info('rule===', rule)
        if (value === '') {
          callback(new Error('请再次输入新密码!'));
        } else if (value !== form.value.newPassword) {
          callback(new Error('两次输入的新密码不一致!'));
        } else {
          callback();
        }
      };
      const rules = {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: confirmPasswordValidator, trigger: 'blur' }
        ]
      };
      const formRef = ref<HTMLImageElement | any>()
      const submitForm = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            const { oldPassword,  newPassword } = form.value
            api.home.changepassword({
              password: oldPassword,
              newPassword
            }).then((res: any) => {
              const { code, msg } = res
              if (code === 200) {
                proxy.$message.success(msg)
                dialogVisible.value = false;
                localStorage.clear()
                router.push({
                    path: '/login'
                })
              } else {
                proxy.$message.error(msg)
              }
            }).catch((error: any) => {
              console.info(error)
            })
          }
        });
      };
  
      const resetForm = () => {
        form.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          ispw: true
        };
        formRef.value.resetFields();
      };
      const showpwmodal = () => {
        dialogVisible.value = true;
      };
      // watch(
      // () => props.showpwmodal,
      // (val) => {
      //   console.info('当前的value值？？', val)
      //   dialogVisible.value = val; // 当 showpwmodal 为真时，打开弹窗
      // }
    // )
      return {
        dialogVisible,
        formRef,
        form,
        rules,
        submitForm,
        resetForm,
        showpwmodal
      };
    }
  });
  </script>