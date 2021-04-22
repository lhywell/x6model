<template>
  <div class="editor">
    <h1>战法模型</h1>
    <div class="content">
      <div class="app-stencil" id="app-stencil" ref="stencilContainer"> </div>
      <div class="panel">
        <Toolbar></Toolbar>
        <div class="app-content" id="app-content" ref="x6Editor"></div>
      </div>
    </div>
    <slot name="rightPane">
      <modal :show.sync="showAttrConfig" title="属性配置" @keyup.stop.native="">
        <div slot="content">
          <el-form :model="nodeFrmData" label-width="80px" label-position="left">
            <el-form-item label="名称" prop="name">
              <el-input v-model="nodeFrmData.name"></el-input>
            </el-form-item>
            <el-form-item label="属性1" prop="属性1">
              <el-input v-model="nodeFrmData.属性1"></el-input>
            </el-form-item>
            <el-form-item label="属性2" prop="属性2">
              <el-input v-model="nodeFrmData.属性2"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </modal>
    </slot>
  </div>
</template>
<script>
import Vue from 'vue'
import FlowGraph from './Graph'
import Modal from "./Modal";
import Toolbar from './Toolbar/Toolbar.vue'

export default {
  data() {
    return {
      showAttrConfig: false,
      nodeFrmData: {},
      viewTranslate: { graphX: 0, graphY: 0 },
    };
  },
  beforeDestroy() {},
  mounted() {
    this.initRight();
  },
  methods: {
    initRight() {
      let graph = FlowGraph.init();

      Vue.prototype.$graph = graph;
    },
    close() {
      this.showAttrConfig = false;
    },
    confirm() {
      let graph = this.graph;
      let selectedCell = graph.getSelectedCell();
      selectedCell.setData(this.nodeFrmData);
      let style = selectedCell.style;
      if (selectedCell.style.shape === "html") {
        let html = selectedCell.style.html;
        let temDom = document.createElement("div");
        temDom.innerHTML = style.html;
        temDom.querySelector('[attr="name"]').innerText = this.nodeFrmData.name;
        style.html = temDom.innerHTML;
        selectedCell.setStyle(style);
      } else {
        selectedCell.style.label = this.nodeFrmData.name;
      }
      graph.refresh(selectedCell);
      this.showAttrConfig = false;
    }
  },
  components: {
    Modal,
    Toolbar
  }
};

</script>
<style lang="scss">
.editor {
  text-align: left;
  height: 800px;

  h1 {
    font-size: 18px;
    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    /*box-shadow: 0 2px 6px 0 rgb(0 0 0 / 10%);*/
    position: relative;
    color: rgba(0, 0, 0, .45);
    font-weight: normal;
  }
}

.content {
  font-family: sans-serif;
  display: flex;

  .panel {
    height: 100%;
    width: 100%;
  }

  .app-stencil {
    width: 250px;
    border: 1px solid #f0f0f0;
    position: relative;
  }

  .app-content {
    flex: 1;
    height: 520px;
    margin-left: 8px;
    margin-right: 8px;
    box-shadow: 0 0 10px 1px #e9e9e9;
  }
}

</style>
