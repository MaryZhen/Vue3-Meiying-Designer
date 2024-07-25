<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-27 11:05:48
 * @Description:  
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-10-04 01:53:10
-->
<template>
  <div class="search__wrap">
    <el-dropdown v-if="type !== 'none'" placement="bottom-start">
      <div class="search__type"><i class="iconfont icon-ego-caidan" /></div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="type in materialCates" :key="type.id" @click="action('change', type, type.id)">
            <span :class="['cate__text', { 'cate--select': +currentIndex === type.id }]">{{ type.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span v-else style="width: 1rem"></span>

    <el-select v-model="searchValue"
    placeholder="输入关键词搜索"
    remote
    filterable
    popper-append-to-body
    
    :remote-method="remoteMethod"
    :loading="loading"
    style="width:100%;margin-bottom: 10px;"
    popper-class="imgselect"
    @change="searchImg">
      <el-option
        v-for="item in movieList"
        :key="item.id"
        :label="item.title"
        :value="item.id">
        <div style="width:100%;height:auto;display: block;" href="#">
          <!-- <div style="width: 40px;height:auto;display: inline-block;">
            <img :src="item.image" width="40" referrerpolicy="no-referrer">
          </div> -->
          <p style="width: 100%;height: auto;display: inline-block;">
            <em style="color: #369;">{{item.title}}</em>
            <span style="font-size: 12px;padding-left:10px;">{{ item.year }}</span>
            <br>
            <span style="font-size: 12px;">{{ item.sub_title }}</span>
            <br>
            <span style="font-size: 12px;">{{ item.actors }}</span>
          </p>
        </div>
      </el-option>
    </el-select>
    <div>
      <label style="display: inline-block;font-size: 12px;font-weight: 700;width: 40px;">主演：</label>
      <el-input style="width: calc(100% - 40px);" type="text" v-model="actors" />
    </div>
    <div style="margin-top: 15px;height: 60px;line-height: 60px;">
      <label style="display: inline-block;font-size: 12px;font-weight: 700;width: 40px;">简介：</label>
      <el-input class="textareabox" style="width: calc(100% - 40px);height: 60px;" type="textarea" v-model="sumary" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus'
import  { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import api from '@/api'

export default defineComponent({
  components: { ElDropdown, ElDropdownItem, ElDropdownMenu },
  props: ['type', 'modelValue'],
  emits: ['update:modelValue', 'search'],
  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const state: any = reactive({
      searchValue: '',
      materialCates: [],
      currentIndex: 1,
      loading: false,
      movieList: [],
      actors: '',
      sumary: '',
      movieMap: {}
    })

    if (props.type != 'none') {
      api.home.getCategories({ type: 1 }).then((list: any) => {
        list.unshift({ id: 0, name: '全部' })
        state.materialCates = list
        const { cate } = route.query
        cate && (state.currentIndex = cate)
        cate && action('change', state.materialCates[Number(cate)], Number(cate))
      })
    }

    watch(
      () => state.searchValue,
      () => {
        context.emit('update:modelValue', state.searchValue)
      },
    )

    function action(fn: string, type: any, currentIndex: number | string) {
      currentIndex && (state.currentIndex = currentIndex)
      context.emit(fn, type)
    }
    const searchImg = async (value: string) => {
      if (value) {
        state.actors = state.movieMap[value].actors
        const sumary: any = await api.home.getSummary({id: value})
        state.sumary = typeof sumary === 'string' ? sumary : ''
        store.commit('setComment', '正在加载。。。')
        const comments: any = await api.home.getComments({id: value})
        store.commit('setComment', comments)
      } else {
        state.actors = ''
        state.sumary = ''
      }
      context.emit('search', true)
    }
    const remoteMethod = async (query) => {
        if (query !== '') {
          state.loading = true;
          state.movieList = await api.home.getmovielist({q: query})
          state.loading = false;
        } else {
          state.movieList = [];
        }
        const obj = {}
        state.movieList.forEach(item => {
          obj[item.id] = item
        })
        state.movieMap = obj
      }
    return {
      ...toRefs(state),
      action,
      searchImg,
      remoteMethod
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-input__suffix) {
  padding-top: 9px;
}
.search__wrap {
  padding: 16px;
  cursor: pointer;
  position: relative;
}
.search {
  &__type {
    border: 1px solid #e8eaec;
    color: #666666;
    width: 44px;
    margin: 0 0 10px 0;
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    .iconfont {
      font-size: 20px;
    }
  }
  &__type:hover {
    color: @active-text-color;
  }
}

.cate {
  &__text {
    font-weight: bold;
  }
  &--select {
    color: @main-color;
  }
}
.listDiv {
  width: calc(100% - 2em);
  height: auto;
  max-height: 500px;
  box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.12);
  position: absolute;
  top: 60px;
  left: 15px;
  min-height: 100px;
  background: white;
}
.imgselect .el-select-dropdown__list .el-select-dropdown__item {
  height: auto;
}
.textareabox ::v-deep .el-textarea__inner {
  height: 60px;
}
</style>
