<template>
  <!-- <div id="page-design" ref="page-design" :style="{ paddingTop: dPaddingTop + 'px', paddingBottom: '50px'}" style="box-sizing: border-box;"> -->
    <div id="page-design" ref="page-design" :style="{ paddingTop: '15px', paddingBottom: '15px'}" style="box-sizing: border-box;">
      <div id="navbar" style="position: fixed;top: 54px;line-height: 40px;text-align: center;white-space: nowrap;" :style="{width: calcwidth }">
        <template v-if="dPageList.length >= 1 && dPageList[0].cusid !== '0'">
          <VueDraggable v-model="dPageList" :animation="150" style="height: 36px;width: 100%;height: 100%;overflow-x: auto;white-space: nowrap;">
              <div class="btnContainer"
                v-for="(item, index) in dPageList"
                :class="{active: item.page.uuid === dPage.uuid}"
                @click="clickBtn(item)"
                :key="item.page.uuid"
                type="primary"
                >
                {{ `图片${index + 1}` }}
                <span title="删除图片"><Delete class="delete" title="删除模板" @click.stop="deleteDpage(item, index)" /></span>
                <!-- <Loading class="download" v-if="submitting" /> -->
                <el-icon class="is-loading" v-if="submitting" style="vertical-align: middle;">
                  <Loading />
                </el-icon>
                <span title="下载图片" v-else><Download  class="download" @click.stop="downloadDpage(item, index)" /></span>
                <span title="上传存为模板"><UploadFilled class="download upload" :size="16" @click.stop="savetmpbyuser(item, index)"  /></span>
              </div>
          </VueDraggable>
        </template>
      </div>
        <div
      id="out-page"
      class="out-page"
      :style="{
        width: (dPage.width * dZoom) / 100 + 'px',
        height: (dPage.height * dZoom) / 100 + 'px',
        opacity: 1 - (dZoom < 100 ? dPage.tag : 0),
      }"
    >
      <slot />
      <div
        :id="pageDesignCanvasId"
        class="design-canvas"
        :data-type="dPage.type"
        :data-uuid="dPage.uuid"
        :style="{
          width: dPage.width + 'px',
          height: dPage.height + 'px',
          transform: 'scale(' + dZoom / 100 + ')',
          transformOrigin: (dZoom >= 100 ? 'center' : 'left') + ' top',
          backgroundColor: dPage.backgroundColor,
          backgroundImage: `url(${dPage?.backgroundImage})`,
          backgroundSize: dPage?.backgroundTransform?.x ? 'auto' : 'cover',
          backgroundPositionX: (dPage?.backgroundTransform?.x || 0) + 'px',
          backgroundPositionY: (dPage?.backgroundTransform?.y || 0) + 'px',
          opacity: dPage.opacity + (dZoom < 100 ? dPage.tag : 0),
        }"
        @mousemove="dropOver($event)"
        @drop="drop($event)"
        @mouseup="drop($event)"
        @mouseleave="mouseleave"
      >
        <!-- <grid-size /> -->

        <!-- :class="{
            layer: true,
            'layer-active': getIsActive(layer.uuid),
            'layer-hover': layer.uuid === dHoverUuid || dActiveElement.parent === layer.uuid,
          }" -->
        <component :is="layer.type" v-for="layer in getlayers()" :ref="layer.uuid"  :data-mask="layer.mask ? layer.mask : ''" :id="layer.uuid" :key="layer.uuid" :class="['layer', { 'layer-hover': layer.uuid === dHoverUuid || dActiveElement.parent === layer.uuid, 'layer-no-hover': dActiveElement.uuid === layer.uuid }]" :data-title="layer.type" :params="layer" :parent="dPage" :data-type="layer.type" :data-uuid="layer.uuid">
          <template v-if="layer.isContainer">
            <!-- :class="{
                layer: true,
                'layer-active': getIsActive(widget.uuid),
                'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent,
                'layer-hover': widget.uuid === dHoverUuid,
              }" -->
            <component :is="widget.type" :ref="widget.uuid" v-for="widget in getChilds(layer.uuid)" :key="widget.uuid" child :class="['layer', { 'layer-no-hover': dActiveElement.uuid !== widget.parent && dActiveElement.parent !== widget.parent }]" :data-mask="widget.mask ? widget.mask : ''" :data-title="widget.type" :params="widget" :parent="layer" :data-type="widget.type" :data-uuid="widget.uuid" />
          </template>
        </component>

        <!-- <ref-line v-if="dSelectWidgets.length === 0" /> -->
        <!-- <size-control v-if="dSelectWidgets.length === 0" /> -->
      </div>
    </div>
    <!-- 生成图片组件 -->
  <SaveImage ref="canvasImage" />
    <!-- <div id="btncontainer" style="text-align: center;margin-top: 20px;position:relative;width: 100%;height: 50px;z-index: 10;">
      <el-button type="primary" @click="addTemplate">添加模板</el-button>
    </div> -->
  </div>
</template>

<script>
import api from '@/api'
import { defineComponent, nextTick } from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { getTarget } from '@/common/methods/target'

import setWidgetData from '@/common/methods/DesignFeatures/setWidgetData'
import PointImg from '@/utils/plugins/pointImg'
import getComponentsData from '@/common/methods/DesignFeatures/setComponents'
import { debounce } from 'throttle-debounce'
import SaveImage from '@/components/business/save-download/CreateCover.vue'
import { VueDraggable } from 'vue-draggable-plus'
import { findParentVm } from '@/utils/utils.ts'

// 页面设计组件
const NAME = 'page-design'

import { move, moveInit } from '@/mixins/move'

export default defineComponent({
  name: NAME,
  components: {SaveImage, VueDraggable},
  mixins: [moveInit],
  props: ['pageDesignCanvasId'],
  data() {
    return {
      comname: 'design-board',
      calcwidth: '100%',
      submitting: false
    }
  },
  computed: {
    ...mapGetters(['dPaddingTop', 'dPage', 'dZoom', 'dScreen', 'dWidgets', 'dActiveElement', 'dHoverUuid', 'dSelectWidgets', 'dAltDown', 'dDraging', 'showRotatable']),
    dPageList: {
      get() {
        return this.$store.getters.dPageList
      },
      set(val) {
        this.$store.commit('updateDpageList', val)
      }
    }
  },
  created() {
    this.curPageList = this.dPageList
    console.info('当前的数组是====', this.curPageList)
  },
  mounted() {
    this.getScreen()
    document.getElementById('page-design').addEventListener('mousedown', this.handleSelection, false)
    document.getElementById('page-design').addEventListener('mousemove', debounce(100, false, this.handleMouseMove), false)
    // 获取要监听的 div 元素
      const myDiv = document.getElementById('page-design');
      this.calcwidth = myDiv.offsetWidth + 'px'
      // 创建 ResizeObserver 实例
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // 当尺寸发生变化时触发的回调函数
          const newWidth = entry.contentRect.width;
          this.calcwidth = newWidth + 'px'
          
        }
      });
      // 监听 div 元素的宽度变化
      resizeObserver.observe(myDiv)
  },
  beforeUnmount() {},
  methods: {
    ...mapActions(['selectWidget', 'updatePageData', 'setTemplate']),
    clickBtn(item) {
      return new Promise((resolve) => {
        if (item.page.uuid !== this.dPage.uuid) {
          this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
          this.$store.commit('managerEdit', false)
          this.$store.commit('setDWidgets', [])
          const { page, widgets } = item
          this.$store.commit('setDPage', item)
          this.setTemplate(widgets)
          setTimeout(() => {
            this.$store.commit('zoomScreenChange')
          }, 300)
          this.selectWidget({
            uuid: item.page.uuid,
            olduuid: '-1'
          })
        }
        resolve()
      })
    },
    downloadImage(url, filename) {
      // 创建一个隐藏的链接元素
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // 设置下载时的文件名

        // 兼容性处理：对于不支持 download 属性的浏览器，模拟点击链接进行下载
        if (document.body) {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('无法下载，页面未加载完成');
        }
    },
    getCurrentFileName(index) {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1，并且保证两位数
        const day = now.getDate().toString().padStart(2, '0'); // 日，保证两位数
        const hours = now.getHours().toString().padStart(2, '0'); // 小时，保证两位数
        const minutes = now.getMinutes().toString().padStart(2, '0'); // 分钟，保证两位数
        const seconds = now.getSeconds().toString().padStart(2, '0'); // 秒，保证两位数

        const timer = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        return `模板${index + 1}_${timer}.jpg`
    },
    async downloadDpage(item, index) { // 下载模板
      if (this.submitting) {
        return false
      }
      this.submitting = true
      await this.clickBtn(item)
      const dPage = this.dPage
      const targetPage = item
      const { width, height } = dPage
      const { id, code, msg } = await api.home.savetmp({ cover: '', title: '', data: JSON.stringify({ page: dPage, widgets: targetPage.widgets }), width, height })
      if (code === 200) {
        // const screenshot_url = window.location.href.split('#')[0] + `#/draw?tempid=${targetPage?.tempid}&id=${id}`
        const screenshot_url = "http://localhost:8088/" + `#/draw?tempid=${targetPage?.tempid}&id=${id}`
        const params = { id: dPage.uuid, tempid: targetPage?.tempid, width, height, screenshot_url }
        const res = await api.home.download(params)
        this.downloadImage(res, this.getCurrentFileName(index))
      }
      this.submitting = false
    },
    draw() {
      return new Promise((resolve) => {
        resolve(this.$refs.canvasImage.createCover(1, 1))
      })
    },
    deleteDpage(item, index) { // 删除某一页
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$store.commit('setShowMoveable', false) // 清理掉上一次的选择框
          this.$store.commit('managerEdit', false)
          this.$store.commit('setDWidgets', [])
          if (this.dPageList.length === 1) {
            this.$store.commit('delDpageList', index)
            return false
          } else {
            const nextIndex = index === 0 ? 1 : index - 1
            const newItem = this.dPageList[nextIndex]
            const { page, widgets } = newItem
            this.$store.commit('setDPage', newItem)
            this.setTemplate(widgets)
            setTimeout(() => {
              this.$store.commit('zoomScreenChange')
            }, 300)
            this.selectWidget({
              uuid: newItem.page.uuid,
              olduuid: '-1'
            })
            this.$store.commit('delDpageList', index)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    async savetmpbyuser(item, index) { // 上传当前图为模板
      const cover = await this.draw()
      const page = this.dPage
      const widgets = this.dWidgets
      const { msg, code } = await api.home.saveWorks({ cover, title: '自设计模板', data: JSON.stringify({ page, widgets }), width: page.width, height: page.height })
      if (code === 200) {
        const rootVm = findParentVm(this, 'design-container')
        if (rootVm) {
          rootVm.loadTemp()
        }
      }
    },
    ...mapActions(['updateScreen', 'selectWidget', 'deleteWidget', 'addWidget', 'addGroup']),
    // getBackground(data) {
    //   if (data.startsWith('http')) return `url(${data})`
    //   if (data.startsWith('linear-gradient')) return data
    // },
    async mouseleave(e){
      const target = await getTarget(e.target)
        this.$store.dispatch('setDropOver', '')
        this._srcCache && (target.firstElementChild.firstElementChild.src = this._srcCache)
        this._srcCache = ''
        this._dropIn = ''
    },
    async dropOver(e) {
      
      if (this.dActiveElement.editable || this.dActiveElement.lock) {
        return false
      }
      e.preventDefault()
      let { data, type } = this.$store.getters.selectItem
      if (type !== 'image') {
        return
      }
      const target = await getTarget(e.target)
      const uuid = target.getAttribute('data-uuid')
      this.$store.dispatch('setDropOver', uuid)
      if (e.target.getAttribute('putIn')) {
        this._dropIn = uuid
        const imgUrl = data.value.thumb || data.value.url
        !this._srcCache && (this._srcCache = target.firstElementChild.firstElementChild.src)
        target.firstElementChild.firstElementChild.src = imgUrl
      } else {
        this._srcCache && (target.firstElementChild.firstElementChild.src = this._srcCache)
        this._srcCache = ''
        this._dropIn = ''
        // this.$store.dispatch('setDropOver', this.dPage.uuid)
      }
    },
    async drop(e) {
      if (!this.dDraging) {
        return
      }
      this.$store.commit('setDraging', false)
      const dropIn = this._dropIn
      this._dropIn = ''
      this.$store.dispatch('setDropOver', this.dPage.uuid)
      this.$store.commit('setShowMoveable', false) // 清理上一次的选择
      let lost = e.target.className !== 'design-canvas' // className === 'design-canvas' , id: "page-design-canvas"
      // e.stopPropagation()
      e.preventDefault()
      let { data: item, type } = JSON.parse(JSON.stringify(this.$store.getters.selectItem))
      // 清除临时数据
      this.$store.commit('selectItem', {})
      let setting = {}
      if (!type) {
        return
      }
      // 处理数据
      setting = await setWidgetData(type, item, setting)
      // 绝对坐标
      const lostX = e.x - document.getElementById('page-design-canvas').getBoundingClientRect().left
      const lostY = e.y - document.getElementById('page-design-canvas').getBoundingClientRect().top
      // 放置组合
      if (type === 'group') {
        let parent = {}
        item = await getComponentsData(item)
        item.forEach((element) => {
          if (element.type === 'w-group') {
            parent.width = element.width
            parent.height = element.height
          }
        })
        const half = { x: parent.width ? (parent.width * this.$store.getters.dZoom) / 100 / 2 : 0, y: parent.height ? (parent.height * this.$store.getters.dZoom) / 100 / 2 : 0 }
        item.forEach((element) => {
          element.left += (lost ? lostX - half.x : e.layerX - half.x) * (100 / this.$store.getters.dZoom)
          element.top += (lost ? lostY - half.y : e.layerY - half.y) * (100 / this.$store.getters.dZoom)
        })
        this.addGroup(item)
      }
      // 设置坐标
      const half = { x: setting.width ? (setting.width * this.$store.getters.dZoom) / 100 / 2 : 0, y: setting.height ? (setting.height * this.$store.getters.dZoom) / 100 / 2 : 0 }
      // const half = { x: (this.dDragInitData.offsetX * this.dZoom) / 100, y: (this.dDragInitData.offsetY * this.dZoom) / 100 }
      setting.left = (lost ? lostX - half.x : e.layerX - half.x) * (100 / this.$store.getters.dZoom)
      setting.top = (lost ? lostY - half.y : e.layerY - half.y) * (100 / this.$store.getters.dZoom)
      if (lost && type === 'image') {
        // 如果不从画布加入，且不是图片类型，则判断是否加入到svg中
        const target = await getTarget(e.target)
        const targetType = target.getAttribute('data-type')
        const uuid = target.getAttribute('data-uuid')
        if (targetType === 'w-mask') {
          // 容器
          this.$store.commit('setShowMoveable', true) // 恢复选择
          const widget = this.dWidgets.find((item) => item.uuid === uuid)
          widget.imgUrl = item.value.url
          // if (e.target.className.baseVal) {
          //   !widget.imgs && (widget.imgs = {})
          //   widget.imgs[`${e.target.className.baseVal}`] = item.value.url
          // }
        } else {
          if (dropIn) {
            const widget = this.dWidgets.find((item) => item.uuid == dropIn)
            const targetPage = this.dPageList.find(v => v.page.uuid === this.dPage.uuid)
            const targetWidget = targetPage.widgets.find(v => v.uuid === dropIn)
            widget.imgUrl = item.value.url
            console.log('加入+', widget, 'dddd', item)
            this.$store.commit('setShowMoveable', true) // 恢复选择
            // mayz 计算宽高比例
            const heightScale = item.value.height / widget.height
            const widthScale = item.value.width / widget.width
            if (widthScale >= heightScale) {
              widget.imgwidth = item.value.width / heightScale
              widget.imgheight = widget.height

              targetWidget.imgwidth = item.value.width / heightScale
              targetWidget.imgheight = widget.height
            } else {
              widget.imgwidth = widget.width
              widget.imgheight = item.value.height / widthScale
              targetWidget.imgwidth = widget.width
              targetWidget.imgheight = item.value.height / widthScale
            }
            this.$nextTick(() => {
              const targetChild = this.$refs[dropIn]
              if (targetChild && targetChild[0]) {
                targetChild[0].initPosition()
              }
            })
          } else {
            this.addWidget(setting) // 正常加入面板
          }
        }
      } else if (type === 'bg') {
        console.log('背景图片放置')
      } else if (type !== 'group') {
        console.log(setting)
        this.addWidget(setting) // 正常加入面板
      }
      // 清除临时数据
      // this.$store.commit('selectItem', {})
    },
    getScreen() {
      let screen = this.$refs['page-design']
      this.updateScreen({
        width: screen.offsetWidth,
        height: screen.offsetHeight,
      })
    },
    async handleMouseMove(e) {
      const pImg = new PointImg(e.target)
      const { rgba } = pImg.getColorXY(e.offsetX, e.offsetY)
      if (rgba && rgba === 'rgba(0,0,0,0)') {
        console.log('解析点位颜色: ', rgba)
        let target = await getTarget(e.target)
        target.style.pointerEvents = 'none'
        setTimeout(() => {
          target.style.pointerEvents = 'auto'
        }, 300)
      }
    },
    async handleSelection(e) {
      if (e.which === 3) {
        return
      }

      let target = await getTarget(e.target)
      let type = target.getAttribute('data-type')

      if (type) {
        let uuid = target.getAttribute('data-uuid')
        if (!uuid.includes('-') && !this.dAltDown) {
          let widget = this.dWidgets.find((item) => item.uuid === uuid)
          if (!widget.parent.includes('-') && widget.parent !== this.dActiveElement.uuid && widget.parent !== this.dActiveElement.parent) {
            uuid = widget.parent
          }
        }

        // 设置选中元素
        // this.$store.commit('setMoveable', false)
        if (this.showRotatable !== false) {
          this.selectWidget({
            uuid: uuid,
          })
        }

        if (!uuid.includes('-')) {
          this.initmovement && this.initmovement(e) // 参见 mixins
        }
      } else {
        // 取消选中元素
        this.selectWidget({
          uuid: '-1',
        })
      }
    },
    getlayers() {
      return this.dWidgets.filter((item) => item.parent === this.dPage.uuid)
    },
    getChilds(uuid) { 
      return this.dWidgets.filter((item) => item.parent === uuid)
    },
    // getIsActive(uuid) {
    //   if (this.dSelectWidgets.length > 0) {
    //     let widget = this.dSelectWidgets.find((item) => item.uuid === uuid)
    //     if (widget) {
    //       return true
    //     }
    //     return false
    //   } else {
    //     return uuid === this.dActiveElement.uuid
    //   }
    // },
  },
})
</script>

<style lang="less" scoped>
.btnContainer {
      width: 120px;
      height: 36px;
      font-size: 14px;
      display: inline-block;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: #e5e7eb;
      }
      &.active {
        background-color: #e5e7eb;
      }
      i.sd-delete {
        color: red;
      }
      i:hover {
        color: #ffa5a5;
      }
      .download, .delete {
        font-size: 14px;
        display: inline;
        width:14px;
        height: 14px;
      }
      .upload {
        margin-left: 8px;
      }
      .delete {
        color: red;
        margin-right: 8px;
        &:hover {
          color: #ffa5a5;
        }
      }
      .download, .is-loading {
        &:hover {
          color: #7a7a7a;
        }
      }
    }
#page-design {
  height: calc(100% - 45px);
  margin-top: 45px;
  // display: flex;
  // align-items: center;
  overflow: hidden;
  position: relative;
  width: 100%;
  .out-page {
margin: 0 auto;
    // padding: 15px;
    position: relative;
    .design-canvas {
      // transition: all 0.3s;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
      margin: 0 auto;
      position: relative;
      // z-index: -9999;
      // overflow: hidden;
      // overflow: auto;
    }
    // .design-canvas ::-webkit-scrollbar {
    //   display: none; /* Chrome Safari */
    // }
  }
}
.canvasCut #page-design {
  overflow: auto;
}
</style>
