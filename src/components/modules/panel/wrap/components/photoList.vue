<!--
 * @Author: ShawnPhang
 * @Date: 2022-02-23 15:48:52
 * @Description: 图片列表组件 Bookshelf Layout 
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 11:12:04
-->
<template>
  <ul ref="listRef" class="img-list-wrap" :style="{ paddingBottom: isShort ? '15px' : '200px' }" @scroll="scrollEvent($event)">
    <div class="list" id="list" @contextmenu.prevent="showContextMenu($event)">
      <div v-for="(item, i) in list" :key="i + 'i'" :style="{ width: item.listWidth + 'px', marginRight: item.gap + 'px' }" class="list__img" draggable="false" @mousedown="dragStart($event, i)" @mousemove="mousemove" @mouseup="mouseup" @click.stop="select(i)" @dragstart="dragStart($event, i)">
        <edit-model v-if="edit" :options="edit" :data="{ item, i }">
          <div v-if="item.isDelect" class="list__mask">已删除</div>
          <el-image :id="item.id" class="img transparent-bg" :src="item.thumb || item.url" :style="{ height: getInnerHeight(item) + 'px' }" lazy loading="lazy" referrerpolicy="no-referrer"/>
        </edit-model>
        <template v-else>
          <imageTip :detail="item">
            <el-image :id="item.id" class="img" :src="item.thumb || item.url" :style="{ height: getInnerHeight(item) + 'px' }" lazy loading="lazy" referrerpolicy="no-referrer">
              <template #placeholder>
                <div :style="{ backgroundColor: item.color }" class="image-color" />
              </template>
            </el-image>
          </imageTip>
        </template>
      </div>
    </div>
    <div v-if="!isDone" v-show="loading" class="loading"><i class="el-icon-loading" /> </div>
    <div v-else class="loading">全部加载完毕</div>
    <div v-show="isContextMenuVisible"
         @click="hideContextMenu"
         class="menu"
         id="contextMenu">
        <div class="menuItem" v-if="isuser" @click="menuItemdelete">删除图片</div>
      <div class="menuItem" v-else v @click="menuItemClicked">下载图片</div>
    </div>
  </ul>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, watch, nextTick,getCurrentInstance, ComponentInternalInstance} from 'vue'
import DragHelper from '@/common/hooks/dragHelper'
import setImageData from '@/common/methods/DesignFeatures/setImage'
import download from '@/common/methods/download'
import _config from '@/config'
import api from '@/api'

export default defineComponent({
  props: {
    listData: {},
    edit: {},
    isDone: {},
    isShort: {
      default: false,
    },
    ismy: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load', 'drag', 'select'],
  setup(props, context) {
    const { proxy }: any = getCurrentInstance() as ComponentInternalInstance
    const state: any = reactive({
      loading: true,
      list: [],
      listRef: null,
      isContextMenuVisible: false,
      curSrc: '',
      curid: '',
      isuser: props.ismy
    })

    const dragHelper = new DragHelper()
    let isDrag = false
    let startPoint = { x: 99999, y: 99999 }
    const mouseup = (e: any) => {
      e.preventDefault()
      setTimeout(() => {
        isDrag = false
        startPoint = { x: 99999, y: 99999 }
      }, 10)
    }
    const mousemove = (e: any) => {
      e.preventDefault()
      if (e.x - startPoint.x > 2 || e.y - startPoint.y > 2) {
        isDrag = true
      }
    }

    watch(
      () => props.listData,
      async (newobj: any, oldobj: any) => {
        let newList = newobj.recommendImgList
        let oldList = oldobj.recommendImgList
        const newkeyword = newobj.keyword
        const oldkeyword = oldobj.keyword
        const keywordsame = newkeyword === oldkeyword
        !oldList && (oldList = [])
        if (newList.length <= 0) {
          state.list.length = 0
          return
        }
        const hasnokeyword = newkeyword === 'no-keyword' || oldkeyword === 'no-keyword'
        // let list = newList.filter((v: any) => !newList.includes(v) || !oldList.includes(v)) // difference
        let list = keywordsame ? newList.filter((v: any) => !newList.includes(v) || !oldList.includes(v)) : newList
        if (hasnokeyword) {
          list = [...newList]
        }
        list = JSON.parse(JSON.stringify(list))
        const marginRight = 6 // 间距
        const limitWidth = (await getFatherWidth()) - marginRight
        const standardHeight = 280 // 高度阈值
        const neatArr: any = [] // 整理后的数组
        function factory(cutArr: any) {
          return new Promise((resolve) => {
            const lineup = list.shift()
            if (!lineup) {
              resolve({ height: calculate(cutArr), list: cutArr })
              return
            }
            cutArr.push(lineup)
            const finalHeight = calculate(cutArr)
            if (finalHeight > standardHeight) {
              resolve(factory(cutArr))
            } else {
              resolve({ height: finalHeight, list: cutArr })
            }
          })
        }
        function calculate(cutArr: any) {
          let cumulate = 0
          for (const iterator of cutArr) {
            const { width, height } = iterator
            cumulate += width / height
          }
          return (limitWidth - marginRight * (cutArr.length - 1)) / cumulate
        }
        async function handleList() {
          if (list.length <= 0) {
            return
          }
          const { list: newList, height }: any = await factory([list.shift()])
          neatArr.push(
            newList.map((x: any, index) => {
              x.listWidth = (x.width / x.height) * height
              x.gap = index !== newList.length - 1 ? marginRight : 0
              return x
            }),
          )
          if (list.length > 0) {
            await handleList()
          }
        }
        await handleList()
        // state.list = state.list.concat(neatArr.flat(1))
        state.list = keywordsame && !hasnokeyword ? state.list.concat(neatArr.flat(1)) : neatArr.flat(1)
        state.loading = false
      },
    )

    async function getFatherWidth() {
      await nextTick()
      const dom = state.listRef
      const father = dom.parentElement || dom.parentNode
      return father.offsetWidth
    }

    function getRef() {
      // 用于在组件外调用内部ref
      return state.listRef
    }

    const load = () => {
      state.loading = true
      context.emit('load')
    }
    const select = (i: number) => {
      !isDrag && !state.list[i].isDelect && context.emit('select', i)
    }
    const dragStart = async (e: Event | any, i: number) => {
      e.preventDefault()
      state.isContextMenuVisible = false
      startPoint = { x: e.x, y: e.y }
      if (!state.list[i].isDelect) {
        const img = await setImageData(state.list[i])
        dragHelper.start(e, img.canvasWidth)
        context.emit('drag', i)
      }
    }
    function delItem(i: number) {
      state.list[i].isDelect = true
    }

    const scrollEvent = (e: any) => {
      if (e.target.scrollTop + e.target.offsetHeight + 200 >= e.target.scrollHeight) {
        load()
      }
    }

    const getInnerHeight = ({ height, listWidth, width }: any) => (height * listWidth) / width

    const showContextMenu = (event:any) => { // 右键菜单
      event.preventDefault();
      if (event.target.tagName === 'IMG') {
        state.isContextMenuVisible = true;
        state.curSrc = event.target.src
        state.curid = event.target.id
        // 设置右键菜单的位置
        const contextMenu:any = document.getElementById('contextMenu');
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';

        // 在整个文档上添加点击事件监听器
      document.addEventListener('click', hideContextMenuOnClick);
      }
    }
    // 隐藏右键菜单
    const hideContextMenu = () => {
      state.isContextMenuVisible = false;
      // 移除文档上的点击事件监听器
      document.removeEventListener('click', hideContextMenuOnClick);
    }
    // 右键菜单项点击事件
    const menuItemClicked = (option: any) => {
      // 在这里可以添加具体的处理逻辑

      const src = state.curSrc
      window.open(_config.API_URL + '/design/downloaddoubanimage?imageUrl=' + src, '_blank')

      hideContextMenu();
    }
    const menuItemdelete = async() => {
      const id = state.curid
      hideContextMenu();
      api.home.deletelocalimage({id}).then(() => {
        proxy.$message.success('删除成功！')
        context.emit('load', true)
      })
    }
    const hideContextMenuOnClick = (event:any) => {

      // 如果点击事件不在右键菜单内，则隐藏右键菜单
      const contextMenu:any = document.getElementById('contextMenu');
      if (!contextMenu.contains(event.target)) {
        hideContextMenu();
      }
    }

    return {
      load,
      dragStart,
      select,
      ...toRefs(state),
      delItem,
      scrollEvent,
      getRef,
      mouseup,
      mousemove,
      getInnerHeight,
      showContextMenu,
      hideContextMenu,
      menuItemClicked,
      hideContextMenuOnClick,
      menuItemdelete
    }
  },
})
</script>

<style lang="less" scoped>
.img-list-wrap {
  height: 100%;
  overflow: auto;
}
.img {
  transform-origin: center;
  display: block;
  width: 100%;
  height: 100%;
}
.image-color {
  width: 100%;
  height: 100%;
  animation: breathe 600ms ease-out infinite alternate;
}
.list {
  position: relative;
  // padding: 4px 0 0 14px;
  padding: 4px 0 0 0;
  &__img {
    // background: #f1f2f4;
    display: inline-block;
    cursor: pointer;
    // margin: 0 6px 2px 0;
    margin-bottom: 3px;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }
  &__img:active {
    cursor: grabbing;
  }
  &__img:hover {
    filter: brightness(90%);
  }
  &__mask {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.loading {
  padding-top: 1rem;
  text-align: center;
  font-size: 14px;
  color: #999;
}
/* 呼吸效果 */
@keyframes breathe {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
.download {
  position: absolute
}
.menu {
  position: fixed;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.12);
  background-color: white;
  z-index: 1000;
  border-radius: 3px;
  padding: 5px;
  min-width: 100px;
}
.menuItem {
  cursor: pointer;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    font-weight: 100;
    padding: 0 10px;
    &:hover {
      background: #e3e3e3;
    }
    text-align: left;
}
</style>
