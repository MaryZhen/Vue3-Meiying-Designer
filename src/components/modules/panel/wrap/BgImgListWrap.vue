<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-11 18:48:23
 * @Description: 照片图库 Form:Unsplash无版权图片
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-04 19:04:39
-->
<template>
  <div class="wrap">
    <search-header type="none" @search="getDataList" ref="childRef" />
    <div style="height: 0.5rem" />
    <!-- <classHeader v-show="!currentCategory" :types="types" @select="selectTypes">
      <template v-slot="{ index }">
        <photo-list :isShort="true" :listData="recommendImgList" @load="getDataList" @drag="dragStart($event, showList[index])" @select="selectImg($event, showList[index])" />
      </template>
    </classHeader> -->
    <div>
      <!-- <classHeader></classHeader>
      <br /><br /><br /> -->
      <div style="margin: 0 1rem; height: calc(100vh - 60px);">
        <photo-list :isDone="loadDone"
        :listData="listDataobj"
        @load="getDataList" @drag="dragStart" @select="selectImg" />
      </div>
    </div>
  </div>
</template>

<script>
// 图片列表
const NAME = 'img-list-wrap'
import { toRefs, reactive, computed, onMounted, ref, getCurrentInstance } from 'vue'
import wImage from '../../widgets/wImage/wImage.vue'
import api from '@/api'
import { useStore } from 'vuex'
import setImageData from '@/common/methods/DesignFeatures/setImage'

export default {
  name: NAME,
  components: {},
  props: ['active'],
  setup() {
    const childRef = ref(null)
    const store = useStore()
    const state = reactive({
      recommendImgList: [],
      loadDone: false,
      page: 0,
      currentCategory: null,
      types: [],
      showList: [],
      keyword: '', // 搜索词
      childref: null,
      listDataobj: {}
    })
    const dPage = computed(() => store.getters.dPage)
    let loading = false

    onMounted(async () => {
      const instance = getCurrentInstance();
      if (instance) {
        // 获取子组件实例
        childRef.value = instance.refs.childRef;
        state.childRef = childRef.value
      }
      if (state.types.length <= 0) {
        const types = [{
          id: 0,
          name: '商务',
          pid: 17,
          type:4
        }]
        state.types = types
        // for (const iterator of types) {
        //   const { list } = await api.material.getImagesList({ cate: iterator.id, pageSize: 2 })
        //   state.showList.push(list)
        // }
      }
    })

    const selectImg = async (index, list) => {
      const item = list ? list[index] : state.recommendImgList[index]
      store.commit('setShowMoveable', false) // 清理掉上一次的选择
      let setting = JSON.parse(JSON.stringify(wImage.setting))
      const img = await setImageData(item) // await getImage(item.url)
      setting.width = img.width
      setting.height = img.height // parseInt(100 / item.value.ratio, 10)
      setting.imgUrl = item.url
      const { width: pW, height: pH } = dPage
      setting.left = pW / 2 - img.width / 2
      setting.top = pH / 2 - img.height / 2
      store.dispatch('addWidget', setting)
    }

    const getDataList = async (isbtnClick) => {
      var keyword = state.childRef.searchValue || ''
      state.keyword = keyword
      if (isbtnClick) {
        state.loadDone = false
      }
      if (state.loadDone || loading) {
        return
      }
      loading = true
      state.page += 1
      // let { list = [], total } = await api.material.getImagesList({ cate: state.currentCategory.id, page: state.page, pageSize: 30 })
      const page = isbtnClick ? 1 : state.page
      let { list = [], total } = await api.home.getdoubanimgs({ id: keyword, page, type: 'R' }) // gai
      if (isbtnClick) {
          state.recommendImgList = list
      } else {
        list.length <= 0 ? (state.loadDone = true) : (state.recommendImgList = state.recommendImgList.concat(list))
      }
      state.listDataobj = {
        recommendImgList: state.recommendImgList,
        keyword: state.keyword
      }
      setTimeout(() => {
        loading = false
      }, 100)
    }

    const dragStart = (index, list) => {
      const item = list ? list[index] : state.recommendImgList[index]
      store.commit('selectItem', { data: { value: item }, type: 'image' })
    }

    const searchChange = (e) => {
      console.log(e)
    }

    const selectTypes = (item) => {
      state.currentCategory = item
      getDataList()
    }
    const back = () => {
      state.currentCategory = null
      state.page = 0
      state.loadDone = false
      state.recommendImgList = []
    }

    return {
      ...toRefs(state),
      selectImg,
      getDataList,
      dragStart,
      searchChange,
      selectTypes,
      back,
    }
  },
}
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
