/*
 * @Author: ShawnPhang
 * @Date: 2021-07-14 15:16:43
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-07-11 10:22:54
 */
/**
 * 同步操作 store.commit() 调用
 */
interface Iprops {
  commit: (a: any, b: any) => void
  state: {}
}
export default {
  updatePaddingTop(state: Type.Object, num: number) {
    state.dPaddingTop = num
  },
  selectItem(state: Type.Object, { data, type }: any) {
    state.selectItem.data = data
    state.selectItem.type = type
  },
  resize(state: Type.Object, data: Type.Object) {
    const { width, height } = data
    const target = state.dActiveElement
    target.width = width
    target.height = height
  },
  setWidgetStyle(state: Type.Object, { uuid, key, value, pushHistory }: Type.Object) {
    const widget = state.dWidgets.find((item: any) => item.uuid === uuid)
    widget[key] = value
  },
  setMouseEvent(state: Type.Object, e: Event | null) {
    state.activeMouseEvent = e
  },
  setDWidgets(state: Type.Object, e: any) {
    state.dWidgets = e
  },
  updateDpageList(state: Type.Object, data: any) {
    state.dPageList = data
  },
  delDpageList(state: Type.Object, index: any) {
    const initObj = {
      name: '背景页面',
      type: 'page',
      uuid: '-1',
      left: 0,
      cusid: '0',
      top: 0,
      width: 960, // 画布宽度
      height: 1200, // 画布高度
      backgroundColor: '#ffffff', // 画布背景颜色
      backgroundImage: '', // 画布背景图片
      backgroundTransform: {},
      opacity: 1, // 透明度
      tag: 0, // 强制刷新用
      setting: [
        {
          label: '背景颜色',
          parentKey: 'backgroundColor',
          value: false,
        },
      ],
      record: {},
    }
    state.dPageList.splice(index, 1)
    if (state.dPageList.length === 0) {
      state.dPageList = [initObj]
      state.dPage = initObj
    }
  },
  setstagingDetail(state: Type.Object, res: any) {
    const { tmparr, answer, question } = res
    state.dPageList = tmparr
    state.answer = answer
    state.question = question
  },
  setDPage(state: Type.Object, res: any) {
    const e = res.page
    if (!e.cusid) {
      e.cusid = e.uuid
    }
    state.dPage = e
    res.page = e
    if (state.dPageList.length === 1 && state.dPageList[0].cusid === '0') {
      state.dPageList = [res]
    } else {
      if (!state.dPageList.find(v => v.page?.uuid === res.page?.uuid)) {
        state.dPageList.push(res)
      }
    }
  },
  setShowMoveable(state: Type.Object, show: any) {
    state.showMoveable = show
    // if (!show) {
    //   // TODO: 失焦时设置面板也失去关联，但会导致某些失焦状态出错(如裁剪)
    //   state.dActiveElement = state.dPage
    // }
  },
  setShowRotatable(state: Type.Object, e: any) {
    state.showRotatable = e
  },
  zoomScreenChange(state: Type.Object, e: any) {
    // 画布尺寸适应度强制刷新
    state.zoomScreenChange = Math.random()
  },
  updateRect(state: Type.Object, e: any) {
    // 强制刷新操作框
    state.updateRect = Math.random()
  },
  updateSelect(state: Type.Object, e: any) {
    // 强制触发元素选择
    state.updateSelect = Math.random()
  },
  updateGuidelines(state: Type.Object, lines: any) {
    // 修改标尺线
    state.guidelines = { ...state.guidelines, ...lines }
  },
  setCropUuid(state: Type.Object, uuid: any) {
    // 设置正在裁剪or编辑的组件
    state.dCropUuid = uuid
  },
  setDraging(state: Type.Object, drag: boolean) {
    state.dDraging = drag
  },
  setAnswer(state: Type.Object, text: string) { // 设置答案文本
    state.answer = text
  },
  setComment(state: Type.Object, text: string) {
    state.comment = text
  },
  changecurIndex(state: Type.Object) {
    state.curIndex = state.curIndex - 1
  },
  // setDragInitData(state: Type.Object, data: any) {
  //   state.dDragInitData = data
  // },
  setUserInfo(state: any, data: any) {
    state.userinfo = data
  }, 
  setToken(state: any, data: any) {
    localStorage.setItem('token', data)
    state.token = data
  }
}
