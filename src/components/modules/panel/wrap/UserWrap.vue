<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-13 22:18:35
 * @Description: 我的
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 11:50:34
-->
<template>
  <div class="wrap">
    <div>
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-change="uploadDone"
        :auto-upload="true"
        ref="uploadRef"
        v-model="fileList"
        :key="uploadkey"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处 <em>点击上传</em>
        </div>
        <!-- <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template> -->
      </el-upload>

      <div style="margin: 1rem; height: 100vh">
        <photo-list ref="imgListRef" :ismy="true" :isDone="isDone" :listData="imgList" @load="load" @drag="dragStart" @select="selectImg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, nextTick, ref, getCurrentInstance, onMounted, ComponentInternalInstance } from 'vue'
import { ElTabPane, ElTabs } from 'element-plus'
import { useStore } from 'vuex'
import uploader from '@/components/common/Uploader'
import api from '@/api'
import wImage from '../../widgets/wImage/wImage.vue'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import useConfirm from '@/common/methods/confirm'
import _config from '@/config'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'

export default defineComponent({
  components: { uploader, ElTabPane, ElTabs },
  props: ['active'],
  setup(props) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const store = useStore()
    const state: any = reactive({
      imgList: {},
      isDone: false,
      editOptions: [],
      imgListRef: null,
      recommendImgList: [],
      loadDone: false,
      page: 0,
      uploadUrl: _config.API_URL + '/design/uploadlocalimage',
      uploadkey: 1,
      total: 0,
      uploadRef: null,
      fileList: []
    })
    let loading = false
    const load = async (isbtnClick: any) => {
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
      let { list = [], total } = await api.home.getlocalimages({ page, pageSize: 10 }) // gai
      state.total = total
      if (isbtnClick) {
          state.recommendImgList = list
      } else {
        list.length <= 0 ? (state.loadDone = true) : (state.recommendImgList = state.recommendImgList.concat(list))
      }
      state.imgList = {
        recommendImgList: state.recommendImgList,
        keyword: 'no-keyword'
      }
      setTimeout(() => {
        loading = false
      }, 100)
    }

    onMounted(() => {
      console.info('执行了mounted')
      console.info('state.uploadRef', state.uploadRef)
      load(true)
    })

    // const selectImg = async (index: number) => {
    //   const item: any = state.imgList[index]
    //   store.commit('setShowMoveable', false) // 清理掉上一次的选择
    //   let setting = JSON.parse(JSON.stringify(wImage.setting))
    //   const img: any = await setImageData(item)
    //   setting.width = img.width
    //   setting.height = img.height // parseInt(100 / item.value.ratio, 10)
    //   setting.imgUrl = item.url
    //   const { width: pW, height: pH } = store.getters.dPage
    //   setting.left = pW / 2 - img.width / 2
    //   setting.top = pH / 2 - img.height / 2
    //   store.dispatch('addWidget', setting)
    // }
    const selectImg = async (index, list) => {
      const item = list ? list[index] : state.recommendImgList[index]
      store.commit('setShowMoveable', false) // 清理掉上一次的选择
      let setting = JSON.parse(JSON.stringify(wImage.setting))
      const img = await setImageData(item) // await getImage(item.url)
      setting.width = img.width
      setting.height = img.height // parseInt(100 / item.value.ratio, 10)
      setting.imgUrl = item.url
      const { width: pW, height: pH } = store.getters.dPage
      setting.left = pW / 2 - img.width / 2
      setting.top = pH / 2 - img.height / 2
      store.dispatch('addWidget', setting)
    }
    const deleteImg = async ({ i, item }: any) => {
      store.commit('setShowMoveable', false) // 清理掉上一次的选择框
      const isPass = await useConfirm('警告', '删除后不可找回，已引用资源将会失效，请谨慎操作', 'warning')
      if (!isPass) {
        return false
      }
      const arr = item.url.split('/')
      let key = arr.splice(3, arr.length - 1).join('/')
      api.material.deleteMyPhoto({ id: item.id, key })
      state.imgListRef.delItem(i) // 通知标记
    }
    state.editOptions = {
      photo: [
      {
        name: '删除',
        fn: deleteImg,
      },
    ],
    }
    const dragStart = (index, list) => {
      const item = list ? list[index] : state.recommendImgList[index]
      store.commit('selectItem', { data: { value: item }, type: 'image' })
    }
    const uploadDone = async (file) => {
      console.info('file=======', file)
      if (file.response?.code === 200) {
        proxy.$message.success('上传成功！')
        state.fileList = []
        // state.uploadRef.clearFiles()
        proxy.$nextTick(() => {
          load(true)
        })
      }
    }
    const beforeUpload = (file: any) => {
      // 获取文件类型
      const isImage = file.type.startsWith('image/');
      console.info('当前的图片类型====', isImage, file.type)
        if (!isImage) {
          proxy.$message.error('只能上传jpg/png文件！');
          return false;
        }

        // 获取文件大小，单位为 KB
        const isLt2M = file.size / 1024 <= 2048;
        if (!isLt2M) {
          proxy.$message.error('图片大小不能超过2MB！');
          return false;
        }
        // 生成唯一标识符作为文件的唯一性标识
        const uniqueIdentifier = new Date().getTime();
        // 将唯一标识符添加到文件对象
        file.uid = uniqueIdentifier;
        console.info('当前的文件是==========', file)
        const formData = new FormData();
        formData.append('file', file);
        console.info('提交的file是个啥====', formData)
        api.home.uploadlocalimage(formData).then(() => {
          proxy.$message.success('上传成功！')
          // state.uploadRef.clearFiles()
          proxy.$nextTick(() => {
            load(true)
          })
        })
      return false;
    }
    const customUpload = (file: any) => {
      // 手动触发上传
      // 创建 FormData 对象
    const formData = new FormData();
      formData.append('file', file);
      console.info('提交的file是个啥====', formData)
      api.home.uploadlocalimage({file: formData}).then(() => {
        proxy.$message.success('上传成功！')
        // state.uploadRef.clearFiles()
        proxy.$nextTick(() => {
          load(true)
        })
      })
    }
    const handleUploadClick = () => {
      // 点击上传按钮时触发上传
      state.uploadRef.upload.submit();
    }

    return {
      ...toRefs(state),
      load,
      uploadDone,
      selectImg,
      deleteImg,
      dragStart,
      beforeUpload,
      customUpload,
      handleUploadClick
      // openPSD,
    }
  },
})
</script>

<style lang="less" scoped>
.infinite-list {
  height: 100%;
  padding-bottom: 150px;
}
.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.tabs {
  padding: 0.2rem 0;
}
.upload {
  width: auto;
  margin: 0 0 0 1rem;
  display: inline-block;
  &-btn {
    width: 160px;
    font-size: 14px;
  }
  &-psd {
    width: 124px;
    margin-left: 10px;
  }
}
.wrap {
  width: 100%;
  height: 100%;
}
.upload-demo ::v-deep {
  .el-upload-dragger {
    padding: 0 0 10px 0;
    margin-top: 15px;
    width: calc(100% - 30px);
    margin-left: 15px;
  }
}
</style>
