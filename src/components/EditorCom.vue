<template>
  <div class="editor">
    <h1>战法模型</h1>
    <div class="content">
      <div class="app-stencil" ref="stencilContainer"> </div>
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

import { Graph, Shape, Addon } from '@antv/x6';
const { Stencil } = Addon
const { BorderedImage } = Shape

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

      // let g = new FlowGraph()
      let graph = FlowGraph.init();

      this.initStencil(graph);


      Vue.prototype.$graph = graph;

    },
    initStencil(graph) {
      const stencil = new Stencil({
        title: '战法模型',
        target: graph,
        // search: true,
        collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 280,
        groups: [{
          name: 'group1',
          title: '数据源',
        }, {
          name: 'group2',
          title: '基础模型',
        }],
      })

      this.$refs.stencilContainer.appendChild(stencil.container)

      let path = process.env.NODE_ENV === 'production' ?
        '/x6model/dist/' :
        '/';
      const r1 = this.newImage('table-1', path + 'table.svg')
      const r2 = this.newImage('table-2', path + 'table.svg')
      const r3 = this.newImage('table-3', path + 'table.svg')
      const r4 = this.newImage('table-4', path + 'table.svg')

      const s3 = this.newImage('image-1', path + 'fliter.svg', '差集')
      const s4 = this.newImage('image-2', path + 'jiao.svg', '交集')
      const s5 = this.newImage('image-3', path + 'bing.svg', '并集')
      const s1 = this.newImage('image-4', path + 'bu.svg', '补集')
      const s2 = this.newImage('image-5', path + 'cha.svg', '差集')


      stencil.load([r1, r2, r3, r4], 'group1')
      stencil.load([s1, s2, s3, s4, s5], 'group2')
    },

    newImage(id, url, text) {
      return new BorderedImage({
        shape: 'image-bordered',
        width: 40,
        height: 40,
        data: {
          id: id
        },
        attrs: {
          rect: { stroke: '#108ee9', strokeWidth: 1 },
          image: {
            opacity: 1, // 设置为透明避免闪动，图片加载完成后设置为 1
            'xlink:href': url,
          },
          body: {
            magnet: false,
          },
          label: {
            text: text || '',
            fill: 'black',
            y: 34,
          },
        },
        ports: {
          groups: {
            // 输入链接桩群组定义
            in: {
              position: 'left',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden'
                  }
                },
              },
            },
            // 输出链接桩群组定义
            out: {
              position: 'right',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 1,
                  fill: '#fff',
                  style: {
                    visibility: 'hidden'
                  }
                },
              },
            },
          },
          items: [{
              id: 'port1',
              group: 'in',
            },
            {
              id: 'port2',
              group: 'out',
            }
          ],
        },
      })
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
