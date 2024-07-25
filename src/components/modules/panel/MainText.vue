<template>
  <div id="style-panel">
    <div class="style-tab">
      <span :class="['tab', { 'active-tab': activeTab === 0 }]" @click="activeTab = 0">答案内容</span>
      <!-- <span :class="['tab', { 'active-tab': activeTab === 1 }]" @click="activeTab = 1">图层</span> -->
    </div>
    <div v-show="activeTab === 0" class="style-wrap" style="padding: 15px;box-sizing: border-box;overflow: auto;">
      <el-input type="textarea" autosize v-model="answerText" class="mayztext" placeholder="点击获取答案得到内容"></el-input>
    </div>
  </div>
</template>

<script>
// 样式设置面板
const NAME = 'main-text'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: NAME,
  data() {
    return {
      activeTab: 0,
      showGroupCombined: false,
      answerText: ''
    }
  },
  computed: {
    ...mapGetters(['answercontent']),
  },
  watch: {
    answercontent: {
      immediate: true,
      handler(val) {
        if (val !== this.answerText) {
          this.answerText = val
        }
      }
    },
    answerText: {
      immediate: true,
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$store.commit('setAnswer', val)
        }
      }
    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
@color0: #ffffff; // Appears 5 times
@color1: #999999; // Appears 3 times
@color2: #d7d7d7; // Appears 2 times

#style-panel ::-webkit-scrollbar {
  // display: none;
}
#style-panel {
  background-color: @color0;
  border-left: 1px solid @color2;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 280px;
  .style-tab {
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-direction: row;
    text-align: center;
    width: 100%;
    z-index: 10;
    .tab {
      user-select: none;
      background-color: @color0;
      font-size: 14px;
      color: @color1;
      cursor: pointer;
      flex: 1;
      padding: 14px 10px;
    }
    .tab.active-tab {
      // background-color: #3e4651;
      font-size: 15px;
      color: #444444;
      font-weight: 600;
    }
  }
  .style-wrap {
    flex: 1;
    overflow: auto;
    width: 100%;
    padding: 0px 20px;
  }
  .layer-wrap {
    flex: 1;
    overflow: auto;
    width: 100%;
  }
}

.gounp {
  &__btn {
    width: 100%;
    margin-bottom: 2.7rem;
  }
}
.mayztext {
  height: 100%;
  ::v-deep {
    .el-textarea__inner {
      height: 100% !important;
    }
  }
}
</style>
