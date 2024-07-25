import mutations from './mutations'
import actions from './actions'
const all = {
  state: {
    dZoom: 0, // 画布缩放百分比
    dPaddingTop: 0, // 画布垂直居中修正值
    dScreen: {
      width: 0, // 记录编辑界面的宽度
      height: 0, // 记录编辑界面的高度
    },
    // gridSize: {
    //   width: 0, // 网格小格子的宽度
    //   height: 0, // 网格小格子的高度
    // },
    guidelines: {
      // moveable 标尺辅助线
      verticalGuidelines: [],
      horizontalGuidelines: [],
    },
    dActiveWidgetXY: {
      x: 0, // 选中组件的横向初始值
      y: 0, // 选中组件的纵向初始值
    },
    dMouseXY: {
      x: 0, // 鼠标按下时的横坐标
      y: 0, // 鼠标按下时的纵坐标
    },
    dMoving: false, // 是否正在移动组件
    dDraging: false, // 是否正在抓取组件
    dResizeing: false, // 是否正在调整组件宽高
    dShowRefLine: true, // 是否显示参考线

    dResizeWH: {
      // 初始化调整大小时组件的宽高
      width: 0,
      height: 0,
    },
    dActiveElement: {}, // 选中的组件或页面
    dCopyElement: [], // 复制的组件（可能是单个也可能是数组）
    dHoverUuid: '-1', // 鼠标在这个图层上
    dDropOverUuid: '', // 拖动时放在哪个图层上
    answer: '', // 答案文本 mayz
    comment: '', // 影评
    question: '',
    dPageList: [{ // 将画布更改为数组
      name: '背景页面',
      cusid: '0',
      type: 'page',
      uuid: '-1',
      left: 0,
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
    }],
    dPage: {
      name: '背景页面',
      type: 'page',
      uuid: '-1',
      left: 0,
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
    },
    dWidgets: [], // 已使用的组件
    dHistory: [], // 记录历史操作（保存整个画布的json数据）
    dActiveUuidHistory: [], // 记录历史操作对应的激活的组件的uuid
    dPageHistory: [], // 记录历史操作对应的page
    dHistoryParams: {
      index: -1,
      length: 0,
      maxLength: 20,
    },
    dColorHistory: [], // 记录历史选择的颜色
    dAltDown: false, // 记录是否按下alt键 / 或ctrl
    dSelectWidgets: [], // 记录多选的组件
    dGroupJson: {}, // 组合的json数据
    selectItem: { data: null }, // 记录当前选择的元素, data
    activeMouseEvent: null, // 正在活动的鼠标事件
    showMoveable: false, // 全局控制选择框的显示
    showRotatable: true, // 是否显示moveable的旋转按钮
    zoomScreenChange: null, // 画布强制刷新适应度
    updateRect: null, // 强制刷新操作框
    updateSelect: null, // 强制设置选择元素
    dCropUuid: -1, // 正在编辑or裁剪的组件id
    curIndex: 0,
    // dDragInitData: {}, // 拖拽初始化数据
    // 初始化状态
    userinfo: {},
    token: ''
  },
  getters: {
    answercontent(state: any) {
      return state.answer
    },
    commentcontent(state: any) {
      return state.comment
    },
    questioncontent(state: any) {
      return state.question
    },
    selectItem(state: any) {
      return state.selectItem
    },
    dZoom(state: any) {
      return state.dZoom < 20 ? 20 : state.dZoom // 给dZoom设置一个最小值
    },
    dPaddingTop(state: any) {
      return state.dPaddingTop
    },
    dScreen(state) {
      return state.dScreen
    },
    // gridSize(state) {
    //   return state.gridSize
    // },
    dActiveWidgetXY(state) {
      return state.dActiveWidgetXY
    },
    dMouseXY(state) {
      return state.dMouseXY
    },
    dMoving(state) {
      return state.dMoving
    },
    dDraging(state) {
      return state.dDraging
    },
    dActiveElement(state) {
      return state.dActiveElement
    },
    dPage(state) {
      return state.dPage
    },
    dPageList(state) {
      return state.dPageList
    },
    curIndex(state) {
      return state.curIndex
    },
    dWidgets(state) {
      return state.dWidgets
    },
    dHistoryParams(state) {
      return state.dHistoryParams
    },
    dColorHistory(state) {
      return state.dColorHistory
    },
    dHoverUuid(state) {
      return state.dHoverUuid
    },
    dResizeing(state) {
      return state.dResizeing
    },
    dShowRefLine(state) {
      return state.dShowRefLine
    },
    dCopyElement(state) {
      return state.dCopyElement
    },
    dAltDown(state) {
      return state.dAltDown
    },
    dSelectWidgets(state) {
      return state.dSelectWidgets
    },
    activeMouseEvent(state: any) {
      return state.activeMouseEvent
    },
    showMoveable(state: any) {
      return state.showMoveable
    },
    showRotatable(state: any) {
      return state.showRotatable
    },
    zoomScreenChange(state: any) {
      return state.zoomScreenChange
    },
    updateRect(state: any) {
      return state.updateRect
    },
    updateSelect(state: any) {
      return state.updateSelect
    },
    dDropOverUuid(state: any) {
      return state.dDropOverUuid
    },
    guidelines(state: any) {
      return state.guidelines
    },
    dCropUuid(state: any) {
      return state.dCropUuid
    },
    dPageHistory(state: any) {
      return state.dPageHistory
    },
    dHistory(state: any) {
      return state.dHistory
    },
    // dDragInitData(state: any) {
    //   return state.dDragInitData
    // },
    userInfo: (state: any) => {
      const historyuserInfostr: any = localStorage.getItem('user')
      const hasInfo: boolean = localStorage.getItem('user') !== '' && localStorage.getItem('user') !== undefined && localStorage.getItem('user') !== null
      const userInfo: any = hasInfo ? JSON.parse(historyuserInfostr) : state.userinfo
      return userInfo
    },
    token: (state: any) => {
      const storagetoken = localStorage.getItem('token')
      return storagetoken || state.token
    }
  },
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
}
export default all
