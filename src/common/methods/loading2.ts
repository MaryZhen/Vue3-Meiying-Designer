/*
 * @Author: ShawnPhang
 * @Date: 2021-09-30 16:28:40
 * @Description: 加载遮罩 / 弹窗
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-01-20 17:46:20
 */
import { ElLoading } from 'element-plus'
export default () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在提交，稍安勿躁，耐心等待，你是最可爱的人！',
    background: 'rgba(128, 128, 128, 1)',
    fullscreen: true
  })
  return loading
  // loading.close()
}
