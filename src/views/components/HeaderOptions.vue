<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-12 11:26:53
 * @Description: 顶部操作按钮组
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 12:40:59
-->
<template>
  <!-- <div class="top-title"><el-input v-model="title" placeholder="未命名的设计" class="input-wrap" /></div> -->
  <div class="top-title">
    <!--<span style="width: 150px;margin-right: 10px;">未加载问题<strong style="color: red;">{{ count }}</strong>个</span>-->
    <el-input style="width: calc(100% - 130px);padding-right: 20px;box-sizing: border-box;"
     v-model="question" placeholder="请输入问题" class="input-wrap" :disabled="istitledisabled">
    </el-input>
  </div>
  <div class="top-icon-wrap">
    <template v-if="tempEditing">
      <span style="color: #999; font-size: 14px; margin-right: 0.5rem">{{ stateBollean ? '启用' : '停用' }}</span> <el-switch v-model="stateBollean" @change="stateChange" />
      <div class="divide__line">|</div>
      <el-button plain type="primary" @click="saveTemp">保存模板</el-button>
      <el-button @click="$store.commit('managerEdit', false)">取消</el-button>
      <div class="divide__line">|</div>
    </template>
    <el-button plain type="primary" :disabled="tempEditing || questionisloading" @click="loadQuestionFn" title="点击加载问题">加载问题</el-button>
    <el-button plain type="primary" :disabled="tempEditing || isloading" @click="loadAnswerFn" title="点击获取答案">获取答案</el-button>
    <!-- <el-button plain type="primary" :disabled="tempEditing || isloading" @click="savestaging" title="点击保存作品">保存作品</el-button> -->
    <el-button plain type="primary" :disabled="tempEditing || isloading" @click="skipQuestion" title="跳过当前问题">跳过</el-button>
    <el-button plain type="primary" @click="showReport" title="查看报表">报表</el-button>
    <!-- <el-button size="middle" plain type="primary" :disabled="tempEditing" @click="importQuestions" title="问题导入">导入</el-button> -->
    <!-- <el-button plain type="primary" :disabled="tempEditing" @click="enterpsd" title="点击跳转至psd上传页面">上传psd</el-button> -->
    <el-button plain type="primary" :disabled="tempEditing || isloading" @click="submitResult" title="保存文本和图片">保存</el-button>
  </div>
  <div class="avatarbox">
    <el-avatar
        style="margin-right: 10px;"
      ><img src="@/assets/123.png" /></el-avatar>
            <el-dropdown @command="dropdownclick">
                <span>
                {{userInfo.username}}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
                </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="modifypassword"><el-icon><EditPen /></el-icon>修改密码</el-dropdown-item>
                  <el-dropdown-item command="outlogin"><el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
  </div>
  <!-- 选择提交接口弹窗 -->
  <el-dialog v-model="accountshow" title="账号选择" append-to-body width="500">
    <el-table :data="accountlist" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column property="appName" label="账号名称"  />
      <el-table-column property="appCount" label="今天发布数量" />
    </el-table>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="accountCancel">取消</el-button>
          <el-button type="primary" @click="accountSoure">
            确定
          </el-button>
        </span>
    </template>
  </el-dialog>
  <!-- 查看报表弹窗 -->
  <el-dialog v-model="reportshow" title="本周报表" append-to-body width="70%">
    <div style="text-align: right; margin-bottom: 10px;">
      <span style="padding-right: 10px;">开始日期</span>
      <el-date-picker
        v-model="begintime"
        type="datetime"
        placeholder="请选择日期时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="margin-right: 15px;"
      />
      <span style="padding-right: 10px;">结束日期</span>
      <el-date-picker
        v-model="endtime"
        type="datetime"
        placeholder="请选择日期时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        style="margin-right: 15px;"
      />
      <el-button @click="getReportList" plain type="primary" size="default">查询</el-button>
      <!-- <el-button @click="syncnid" plain type="primary" size="default" :loading="syncloading">同步</el-button>
      <el-button @click="exportReport" plain type="primary" size="default">导出</el-button> -->
    </div>
    <el-table
      :data="reportlist"
      stripe
      style="width: 100%"
      height="500"
      :show-overflow-tooltip="true"
      :border="true"
    >
      <el-table-column property="appName" label="账号名称" width="130" />
      <el-table-column property="question" label="问题" width="200" />
      <el-table-column property="createTime" label="创建时间" width="200" />
      <el-table-column property="url" label="链接">
        <template #default="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        v-bind="reportpage" v-model:current-page="reportcurpage"
        style="margin-top: 10px;justify-content: center;"
        @current-change="changeReportPage"
      />
  </el-dialog>
  <el-dialog
    v-model="resonvisible"
    title="跳过原因"
    width="400"
    append-to-body
  >
    <el-form label-width="80" :model="reason">
      <el-form-item label="原因类型">
        <el-select v-model="reason.retype" prop="retype" placeholder="必选">
          <el-option label="生产困难" value="生产困难" />
          <el-option label="过时" value="过时" />
          <el-option label="非影视类" value="非影视类" />
          <el-option label="词包问题" value="词包问题" />
          <el-option label="其他待定" value="其他待定" />
        </el-select>
      </el-form-item>
      <el-form-item label="原因描述" prop="desc">
        <el-input type="textarea" placeholder="选填" style="width: 214px;" v-model="reason.desc" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resonvisible = false">取消</el-button>
        <el-button type="primary" @click="sureSkip">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
  <!-- 修改密码 -->
  <ResetPasswordDialog ref="pwref" />
</template>

<script lang="ts">
import api from '@/api'
import { defineComponent, reactive, toRefs, getCurrentInstance, ComponentInternalInstance, ref} from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import _dl from '@/common/methods/download'
import useNotification from '@/common/methods/notification'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { useFontStore } from '@/common/methods/fonts'
import copyRight from './CopyRight.vue'
import _config from '@/config'
import ResetPasswordDialog from '@/views/login/ResetPasswordDialog.vue'
// import useConfirm from '@/common/methods/confirm'
// import wGroup from '@/components/modules/widgets/wGroup/wGroup.vue'
import useLoading from '@/common/methods/loading2'
import github from '@/api/github'

export default defineComponent({
  components: { copyRight, SaveImage, ResetPasswordDialog },
  props: ['modelValue'],
  emits: ['change', 'update:modelValue'],
  setup(props, context) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      istitledisabled: false,
      stateBollean: false,
      title: '',
      loading: false,
      question: '',
      importmessage: '',
      isloading: false,
      issubmiting: false,
      comname: 'header-option',
      loadingObj: null,
      count: '',
      accountlist: [],
      accountshow: false,
      curAccountRow: {}, // 记录当前点击行
      curAccount: {}, // 点击确定后获取当前点击的行
      reportshow: false,
      reportlist: [], // 报表数据
      reportcurpage: 1,
      reportpage: {
        total: 0,
        pageSize: 20,
        small: true,
        background: true
      },
      begintime: '',
      endtime: '',
      syncloading: false,
      questionisloading: false,
      resonvisible: false,
      reason: {
        retype: '',
        desc: ''
      }
    })
    // 保存作品
    async function save(hasCover: boolean = false) {
      return new Promise(async (reslove) => {
        store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      const dPageList = proxy.dPageList
      if (!dPageList.length || (dPageList.length === 1 && dPageList[0].uuid == '-1')) {
        proxy.$message.error('您还没有设计图！')
        return false
      }
      state.loadingObj = useLoading()
      const designboard = proxy.$parent.$refs.designboard
      const srcArr = []
      for (let i = 0; i < dPageList.length; i++) {
        await designboard.clickBtn(dPageList[i])
        const dPage = dPageList[i].page
        const targetPage = dPageList[i]
        const { width, height } = dPage
        const { id, code, msg } = await api.home.savetmp({ cover: '', title: '', data: JSON.stringify({ page: dPage, widgets: targetPage.widgets }), width, height })
        if (code === 200) {
          // const screenshot_url = window.location.href.split('#')[0] + `#/draw?tempid=${targetPage?.tempid}&id=${id}`
          const screenshot_url = "http://localhost:8088/" + `#/draw?tempid=${targetPage?.tempid}&id=${id}`
          const params = { id: dPage.uuid, tempid: targetPage?.tempid, width, height, screenshot_url }
          const res = await api.home.download(params)
          const url = await github.putPic({
            base64Image: res,
            issub: 1 // 是否为提交
          })
        srcArr.push(url)
        }
      }
        store.commit('setShowMoveable', true)
        reslove(srcArr)
      })
    }
    // 保存模板
    async function saveTemp() {
      const { tempid, tempType: type } = route.query
      let res = null
      if (type == 1) {
        // 保存组件，组合元素要保证在最后一位，才能默认选中
        if (proxy.dWidgets[0].type === 'w-group') {
          const group = proxy.dWidgets.shift()
          group.record.width = 0
          group.record.height = 0
          proxy.dWidgets.push(group)
        }
        // TODO：如果保存组件不存在组合，则添加组合。该功能待优化
        if (!proxy.dWidgets.some((x) => x.type === 'w-group')) {
          alert('提交组件必须为组合！')
          return
          // proxy.dWidgets.push(wGroup.setting)
        }
        res = await api.home.saveTemp({ id: tempid, type, title: proxy.title || '未命名组件', content: JSON.stringify(proxy.dWidgets), width: proxy.dPage.width, height: proxy.dPage.height })
      } else res = await api.home.saveTemp({ id: tempid, title: proxy.title || '未命名模板', content: JSON.stringify({ page: proxy.dPage, widgets: proxy.dWidgets }), width: proxy.dPage.width, height: proxy.dPage.height })
      res.stat != 0 && useNotification('保存成功', '模板内容已变更')
    }
    // 停用启用
    async function stateChange(e: any) {
      const { tempid, tempType: type } = route.query
      const { stat } = await api.home.saveTemp({ id: tempid, type, state: e ? 1 : 0 })
      stat != 0 && useNotification('保存成功', '模板内容已变更')
    }
    async function loadQuestionFn() {
      state.questionisloading = true
      const question = await api.home.loadQuestion()
      if (typeof question === 'string') {
        state.question = question
      } else if (question?.msg) {
        proxy.$message.error(question.msg)
      }
    }
    async function loadAnswerFn() { // 加载问题
      state.isloading = true
      const question = state.question
      if (!state.question) {
        proxy.$message.error('请输入问题！')
        state.isloading = false
        return false
      }
      const timer = setTimeout(() => { // 10秒钟后取消loading
        state.isloading = false
        clearTimeout(timer)
      }, 10000)
      const answer = await api.home.loadAnswer({question})
      store.commit('setAnswer', answer)
      state.isloading = false
    }
    async function importQuestions() { // 导入问题
      state.importmessage = await api.home.importQuestions()
    }
    async function skipQuestion() { // 跳过问题
      if (!state.question) {
        proxy.$message.error('请先加载问题！')
        return false
      }
      state.resonvisible = true
    }
    async function sureSkip() { // 跳过问题
      const { desc, retype} = state.reason
      const descstr = desc ? '：' + desc : ''
      const skipreason = state.reason.retype + descstr
      if (!skipreason) {
        proxy.$message.error('请选择原因类型！')
        return false
      }
      await api.home.skipQuestion({question: state.question, skipreason})
      window.location.reload()
    }
    async function getnoanswercount() { // 获取未回答问题
      // state.count = await api.home.getcount()
    }
    async function exportReport() { // 导出报表
      if (!state.begintime) {
        proxy.$message.error('请选择开始日期！')
        return false
      }
      if (!state.endtime) {
        proxy.$message.error('请选择结束日期！')
        return false
      }
      const link = document.createElement('a');
        link.href = _config.API_URL + '/design/exportquestionsbytime?begintime=' + state.begintime + '&endtime=' + state.endtime;
        // 兼容性处理：对于不支持 download 属性的浏览器，模拟点击链接进行下载
        if (document.body) {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('无法下载，页面未加载完成');
        }
    }
    async function getReportList() {
      if (!state.begintime) {
        proxy.$message.error('请选择开始日期！')
        return false
      }
      if (!state.endtime) {
        proxy.$message.error('请选择结束日期！')
        return false
      }
        const params = {
          pageIndex: state.reportcurpage,
          pageSize: 20,
          begintime: state.begintime,
          endtime: state.endtime
        }
        await api.home.getReportResult(params).then(res => {
          state.reportlist = res.data
          state.reportpage.total = res.totoCount
        })
    }
    function changeReportPage() {
      getReportList()
    }
    async function showReport() { // 显示报表页
      state.reportlist = []
      state.reportshow = true // 显示弹窗
      state.begintime = ''
      state.endtime = ''
      proxy.$message.info('选择开始和结束日期点击【查询】按钮加载数据！')
      // getReportList() //获取报表数据
    }
    async function accountCancel() { // 取消选择
      state.accountshow = false
    }
    async function accountSoure() { // 确认选择
      if (state.curAccountRow.appName) {
        state.curAccount = { ...state.curAccountRow }
      } else {
        proxy.$message.error('请点击行选择账号！')
        return false
      }
      accountCancel()
      await save(true).then(async imglist => {
        if (!imglist.length) {
          return false
        }
        api.home.bjhsubmit({ id: state.curAccount.id, question: state.question, answer: proxy.answercontent, images: imglist }).then(res => {
          if (res.code === 200) {
            proxy.$alert('提交成功!', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                window.location.reload()
              }
            });
          } else {
            proxy.$message.error(res.msg)
          }
        })
      });
    }
    async function handleCurrentChange(currentRow) { // 点击当前行事件
      state.curAccountRow = currentRow
    }
    async function getAccountList() { // 获取提交账户列表
      return new Promise((resolve:any) => {
        api.home.getAccountList().then(res => {
          state.accountlist = res
          resolve(res)
        })
      })
    }
    async function submitResult() { // 提交答案（图片和内容）
      /**
       * 0. 先保存作品
       * 1. 判断有没有问题或答案
       * 2. 清空上一次选择的账号
       * 3. 获取账号列表
       * 4. 打开选择账号弹窗
       * 5. 点击确定
       * 6. 确定中的逻辑
       * 6.1 判断有没有选中行，如果选中执行6.2,没选中错误提示
       * 6.2 关闭弹窗，执行截图与保存，返回src的数组
       * 6.3 将选择的账号id，问题，答案，src数组提交给百度账号
      */
      const saveres = await savestaging()
      if (!saveres) {
        return false
      }
      // 保存作品时做了如下判断，所以注释掉
      // if (!state.question) {
      //   proxy.$message.error('请加载问题！')
      //   return false
      // }
      // if (!proxy.answercontent) {
      //   proxy.$message.error('答案还未加载完成！')
      //   return false
      // }
      state.curAccountRow = {} // 清空上一次的选择
      await getAccountList()
      state.accountshow = true
    }
    function enterpsd() {
      router.push({ path: '/psd' })
    }
    async function syncnid () { // 点击同步按钮事件
      state.syncloading = true
      await api.home.syncnid()
      await getReportList()
      state.syncloading = false
    }
    function savestaging() { // 保存作品
      return new Promise(resolve => {
        if (!state.question) {
          proxy.$message.error('问题不能为空！')
          resolve(false)
          return false
        }
        if (!proxy.answercontent) {
          proxy.$message.error('答案不能为空！')
          resolve(false)
          return false
        }
        if (!proxy.dPageList.length || (proxy.dPageList[0] && proxy.dPageList[0].uuid === '-1')) {
          proxy.$message.error('您还未进行创作！！')
          resolve(false)
          return false
        }
        const newDpageList = proxy.dPageList.map((v:any) => {
          return JSON.stringify(v)
        })
        api.home.savestaging({
          question: state.question,
          answer: proxy.answercontent,
          tmparr: newDpageList
        }).then(() => {
          proxy.$message.success('保存成功！')
          resolve(true)
        }).catch(() => {
          proxy.$message.error('保存失败，请联系管理员！')
          resolve(false)
        })
      })
    }
    const pwref = ref<HTMLImageElement | any>()
    function dropdownclick(command: string | number | object) {
      if (command === 'outlogin') { // 如果是退出登录
        localStorage.clear()
        router.push({
            path: '/login'
        })
      } else if (command === 'modifypassword') { // 如果是修改密码
        pwref.value.showpwmodal()
      }
    }
    function canedittitleFn() {
      api.home.canedittitle().then((res: any) => {
        console.info('当前获取的title的结果是？？？', res)
        state.istitledisabled = !res
      })
    }
    return {
      ...toRefs(state),
      canedittitleFn,
      pwref,
      save,
      saveTemp,
      stateChange,
      loadAnswerFn,
      loadQuestionFn,
      importQuestions,
      skipQuestion,
      submitResult,
      enterpsd,
      getnoanswercount,
      accountCancel,
      accountSoure,
      handleCurrentChange,
      getAccountList,
      showReport,
      getReportList,
      changeReportPage,
      exportReport,
      syncnid,
      savestaging,
      dropdownclick,
      sureSkip
    }
  },
  computed: {
    ...mapGetters(['dPage', 'dWidgets', 'tempEditing', 'dHistory', 'dPageHistory', 'dPageList', 'answercontent', 'questioncontent', 'userInfo']),
  },
  mounted() {
    this.getnoanswercount()
    this.canedittitleFn()
  },
  watch: {
    questioncontent(val) {
      this.question = val
    },
  },
  methods: {
    ...mapActions(['pushHistory', 'addGroup']),
    async load(id: any, tempId: any, type: any, cb: Function) {
      if (this.$route.name !== 'Draw') {
        await useFontStore.init() // 初始化加载字体
      }
      const apiName = tempId && !id ? 'getTempDetail' : 'getWorks'
      if (!id && !tempId) {
        cb()
        return
      }
      const { data: content, title, state, width, height } = await api.home[apiName]({ id: id || tempId, type })
      if (content) {
        const data = JSON.parse(content)
        this.stateBollean = !!state
        this.title = title
        this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
        // this.$store.commit('setDWidgets', [])
        if (type == 1) {
          // 加载文字组合组件
          this.dPage.width = width
          this.dPage.height = height
          this.addGroup(data)
        } else {
          this.$store.commit('setDPage', data)
          id ? this.$store.commit('setDWidgets', data.widgets) : this.$store.dispatch('setTemplate', data.widgets)
        }
        cb()
        this.pushHistory('请求加载load')
      }
    },
    draw() {
      return new Promise((resolve) => {
        resolve(this.$refs.canvasImage.createCover(0.9, 1))
      })
    },
  },
})
</script>

<style lang="less" scoped>
.top-icon-wrap {
  display: flex;
  align-items: center;
  padding-right: 20px;
  height: 54px;
  .top-icon {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #ffffff;
    cursor: pointer;
    font-weight: bold;
    margin: 8px;
    padding: 5px 8px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.top-title {
  color: @color-black;
  flex: 1;
  padding-left: 88px;
  // font-weight: bold;
  .input-wrap {
    width: 15rem;
    :deep(input) {
      border-color: #ffffff;
      // border-color: #e8eaec;
    }
  }
  .input-wrap:hover {
    :deep(input) {
      border-color: #e8eaec;
    }
  }
}
.avatarbox {
  display: flex;
  padding-right: 15px;
  box-sizing: border-box;
  align-items: center;
}
.primary-btn {
  font-weight: 600;
  transform: scale(0.95);
  margin-left: 10px;
}

.divide__line {
  margin: 0 1rem;
  color: #e8eaec;
  height: 20px;
}
:focus-visible {
    outline: -webkit-focus-ring-color auto 0px !important;
}
</style>
