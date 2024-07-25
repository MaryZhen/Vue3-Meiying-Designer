/*
 * @Author: ShawnPhang
 * @Date: 2021-08-19 18:43:22
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-24 13:01:10
 */
import fetch from '@/utils/axios'
import _config from '@/config'

// const screenshot_url = window.location.protocol + '//' + window.location.host + '/draw'
export const download = (params: Type.Object = {}) => fetch(`${_config.SCREEN_URL}/api/screenshots`, params, 'get')

// 获取模板列表
export const getTempList = (params: Type.Object = {}) => fetch('design/list', params, 'get')
export const getTempDetail = (params: Type.Object = {}) => fetch('design/temp', params, 'get')
export const getCategories = (params: Type.Object = {}) => fetch('design/cate', params, 'get')
// 保存模板
export const saveTemp = (params: Type.Object = {}) => fetch('design/edit', params, 'post')
// export const delTemp = (params: Type.Object = {}) => fetch('/api/template/temp_del', params)

// 组件相关接口
export const getCompList = (params: Type.Object = {}) => fetch('design/list', params, 'get')
export const removeComp = (params: Type.Object = {}) => fetch('design/del', params, 'post')
// export const getCompDetail = (params: Type.Object = {}) => fetch('/api/template/temp_info', params, 'get')

// 保存psd模板
export const saveWorks = (params: Type.Object = {}) => fetch('design/save', params, 'post')
// 暂存作品
export const savetmp = (params: Type.Object = {}) => fetch('design/savetmp', params, 'post')
// 截图获取临时作品详情
export const gettemptempdetail = (params: Type.Object = {}) => fetch('design/tmptemp', params, 'get')

// 保存个人模板
export const saveMyTemp = (params: Type.Object = {}) => fetch('design/user/temp', params, 'post')

// 获取作品
export const getWorks = (params: Type.Object = {}) => fetch('design/poster', params, 'get')

// 作品列表
export const getMyDesign = (params: Type.Object = {}) => fetch('design/my', params, 'get')

// 加载问题
export const loadQuestion = (params: Type.Object = {}) => fetch('design/loadQuestion', params, 'get')
export const loadAnswer = (params: Type.Object = {}) => fetch('design/loadAnswer', params, 'get')
export const skipQuestion = (params: Type.Object = {}) => fetch('design/skip', params, 'get')
export const getcount = (params: Type.Object = {}) => fetch('design/noanswercount', params, 'get')
// export const loadQuestion = () => {
//   return {
//     question: '我是个问题哈哈哈哈',
//     answer: '我是个答案男男女女那你呢'
//   }
// }
// 导入问题
export const importQuestions = (params: Type.Object = {}) => fetch('design/importQuestion', params, 'get')
// 提交
export const bjhsubmit = (params: Type.Object = {}) => fetch('design/bjhsubmit', params, 'post')
// 获取账户列表
export const getAccountList = (params: Type.Object = {}) => fetch('design/appcount', params, 'get')
// 获取报表数据
export const getReportResult = (params: Type.Object = {}) => fetch('design/getquestionnidsbytime', params, 'get')
// 获取电影列表数据
export const getmovielist = (params: Type.Object = {}) => fetch('design/movie', params, 'get')
// 获取简介
export const getSummary = (params: Type.Object = {}) => fetch('design/summary', params, 'get')
// 获取影评
export const getComments = (params: Type.Object = {}) => fetch('design/comment', params, 'get')
// 根据类型和选择的电影加载图片
export const getdoubanimgs = (params: Type.Object = {}) => fetch('design/doubanimgs', params, 'get')
// 上传图片
export const uploadlocalimage = (params: Type.Object = {}) => fetch('design/uploadlocalimage', params, 'post')
// 获取本地文件
export const getlocalimages = (params: Type.Object = {}) => fetch('design/getlocalimages', params, 'get')
// 删除本地图片
export const deletelocalimage = (params: Type.Object = {}) => fetch('design/deletelocalimage', params, 'get')
// 获取nid
export const syncnid = (params: Type.Object = {}) => fetch('design/syncnid', params, 'get')
// 保存历史列表
export const savestaging = (params: Type.Object = {}) => fetch('design/savestaging', params, 'post')
// 获取历史列表
export const getstagings = (params: Type.Object = {}) => fetch('design/getstagings', params, 'get')
// 根据问题获取某条记录对应详情加载模板
export const getstaging = (params: Type.Object = {}) => fetch('design/getstaging', params, 'get')
// 删除某条记录
export const delstaging = (params: Type.Object = {}) => fetch('design/delstaging', params, 'get')

// 删除模板
export const deltemplate = (params: Type.Object = {}) => fetch('design/deltemplate', params, 'get')
// 置顶模板
export const uptemplate = (params: Type.Object = {}) => fetch('design/uptemplate', params, 'get')

// 登录
export const submitauthlogin = (params: any = {}) => fetch('auth/login', params, 'post')
// 修改密码
export const changepassword = (params: any = {}) => fetch('auth/change', params, 'post')
// 
export const canedittitle = (params: any = {}) => fetch('auth/canedittitle', params, 'get')