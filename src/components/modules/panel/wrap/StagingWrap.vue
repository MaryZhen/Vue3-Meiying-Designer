<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-13 22:18:35
 * @Description: 我的
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 11:50:34
-->
<template>
  <div class="staging-wrap">
    <el-input type="text" placeholder="输入关键词搜索" v-model="keyword" style="margin-bottom: 15px;">
      <template #append>
        <el-button @click="getstagings">搜索</el-button>
      </template>
    </el-input>
    <el-table :data="stagingList" stripe style="width: 100%;height: 500px;" :border="true">
      <el-table-column prop="question" label="问题" width="200" />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定要覆盖当前画布内作品么？"
            @confirm="getstaging(scope.row)"
          >
            <template #reference>
              <el-button link type="primary" size="small">载入</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            title="确定要删除该作品记录？"
            @confirm="delstaging(scope.row)"
          >
            <template #reference>
              <el-button link type="primary" size="small" style="color: red;">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
        layout="total, prev, pager, next"
        v-bind="reportpage" v-model:current-page="reportcurpage"
        style="margin-top: 10px;justify-content: center;"
        @current-change="changeReportPage"
      />
  </div>
</template>
<script lang="ts">
// 图片列表
const NAME = 'staging-wrap'
import api from '@/api'
import { defineComponent, reactive, toRefs, watch, onMounted, getCurrentInstance, ComponentInternalInstance} from 'vue'
import { mapGetters, mapActions, useStore } from 'vuex'

export default defineComponent({
  setup(props, context) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const store = useStore()
    const state: any = reactive({
      comname: NAME,
      keyword: '',
      stagingList: [],
      reportpage: {
        total: 0,
        pageSize: 20,
        small: true,
        background: true,
        pagerCount: 3
      },
      reportcurpage: 1
    })
    const getstaging = (row) => { // 载入历史模板
      api.home.getstaging({ question: row.question}).then(res => {
        const { question, answer, tmparr } = res
        const newTmparr = tmparr.map(v => {
          return JSON.parse(v)
        })
        // 修改当前的dPageList
        store.commit('setstagingDetail', {
          question,
          answer,
          tmparr: newTmparr
        })
        const item = newTmparr[0]
        // 默认选中第一个
        const dPage = store.state.dPage || {}
        if (item.page.uuid !== dPage.uuid) {
          store.commit('setShowMoveable', false) // 清理掉上一次的选择框
          store.commit('managerEdit', false)
          store.commit('setDWidgets', [])
          const { widgets } = item
          store.commit('setDPage', item)
          store.dispatch('setTemplate', widgets)
          setTimeout(() => {
            store.commit('zoomScreenChange')
          }, 300)
          store.dispatch('selectWidget', {
            uuid: newTmparr[0].page.uuid,
            olduuid: '-1'
          })
        }
      })
    }
    const getstagings = async () => { // 加载历史模板列表
      const params = {
          pageIndex: state.reportcurpage,
          pageSize: 20,
          keyword: state.keyword
        }
        const res = await api.home.getstagings(params)
        state.stagingList = res.data
        state.reportpage.total = res.total
    }
    const delstaging = async (row) => { // 删除历史模板列表

      await api.home.delstaging({question: row.question})
      proxy.$message.success('删除成功！')
      state.reportcurpage = 1
      getstagings()
    }
    const changeReportPage = () => { // 点击分页
      getstagings()
    }
    onMounted(() => {
      getstagings()
    })
    return {
      ...toRefs(state),
      getstaging,
      getstagings,
      delstaging,
      changeReportPage
    }
  }
})
</script>
<style lang="less" scoped>
.staging-wrap {
  padding: 15px;
}
</style>