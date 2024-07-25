//  import store from '@/store'
import { ElMessage } from 'element-plus'
 export default (router: Type.Object) => {
 
     router.beforeEach((to: Type.Object, from: Type.Object, next: () => void) => {
         // if (to.meta.requireAuth) { }
 
         // 有必要时清除残余的loading框
         // store.commit('loading', false);
 
        //  const $store = store as Type.Object
        //  $store.commit('changeRoute', from.path)
        const token = localStorage.getItem('token')
        const islogin:boolean = token !== '' && token !== undefined && token !== null && token !== 'null'
         if (/\/http/.test(to.path) || /\/https/.test(to.path)) {
             const url = to.path.split('http')[1]
             window.location.href = `http${url}`
         } else if (to.name !== 'Login' && to.meta.islogin && (!islogin)) {
            // 如果用户未登录且尝试访问非登录页面，则重定向到登录页面
            ElMessage.error('请登录后再访问！')
            const path: string =  window.location.href.split('#')[0]
            window.location.href = path.endsWith('/') ? path + '#/login' : path + '/#/login'
            window.location.reload()
         } else {
             next()
         }
 
     })
 
     router.afterEach(() => {
         window.scrollTo(0, 0);
     })
 }
 
 
 