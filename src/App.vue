<!--
 * @Author: ShawnPhang
 * @Date: 2023-09-18 17:34:44
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-09-20 16:10:58
-->
<template>
  <div id="appindex">
    <div class="viewWrap">
      <router-view />
    </div>
  </div>
</template>

<style lang="less">
#appindex {
  min-width: 960px;
  .viewWrap {
    min-height: 1200;
    min-width: 960px;
  }
}
</style>
