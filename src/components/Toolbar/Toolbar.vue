<template>
  <div class="tool-bar">
    <i @click="clear" class="iconfont iconqingchu" title="清除"></i>
    <i @click="deleteCell" class="el-icon-delete" title="删除节点|边"></i>
    <span class="line"></span>
    <i @click="undo" class="iconfont iconundo" title="撤销"></i>
    <i @click="redo" class="iconfont iconredo" title="重做"></i>
    <span class="line"></span>
    <i @click="
          e => {
            scaleView(e, 'up');
          }
        " class="el-icon-zoom-in" title="放大"></i>
    <i @click="
          e => {
            scaleView(e, 'down');
          }
        " class="el-icon-zoom-out" title="缩小"></i>
    <span class="line"></span>
    <i class="iconfont iconcopy" title="复制" @click="copy"></i>
    <i class="iconfont iconcut" title="剪切" @click="cut"></i>
    <i class="iconfont iconpaste" title="粘贴" @click="paste"></i>
    <span class="line"></span>
    <i class="iconfont iconsave" @click="save" title="保存"></i>
    <i class="iconfont iconinterface_printer_line" @click="print" title="打印"></i>
    <span class="toJSON" @click="toJSON" title="toJSON">toJSON</span>
    <span class="run" @click="runJSON" title="运行">运行</span>
  </div>
</template>
<script>
import { DataUri, Edge } from '@antv/x6'

export default {
  name: 'Toolbar',
  data() {
    return {};
  },
  mounted() {},
  methods: {
    clear() {
      this.$graph.clearCells()
      this.showAttrConfig = false;
    },
    undo() {
      this.$graph.undo();
    },
    redo() {
      this.$graph.redo();
    },
    copy() {
      const cells = this.$graph.getSelectedCells()
      if (cells && cells.length) {
        this.$graph.copy(cells)
        this.$message.success('复制成功')
      } else {
        this.$message.info('请先选中节点再复制')
      }
    },
    cut() {
      const cells = this.$graph.getSelectedCells()
      if (cells.length) {
        this.$graph.cut(cells)
      }
    },
    paste() {
      if (this.$graph.isClipboardEmpty()) {
        this.$message.info('剪切板为空，不可粘贴')
      } else {
        const cells = this.$graph.paste(this.options)
        this.$graph.cleanSelection()
        this.$graph.select(cells)
        this.$message.success('粘贴成功')
      }
    },
    scaleView(e, flag) {
      e.preventDefault();
      if (flag === "up") {
        this.$graph.zoom(0.1);
      } else {
        this.$graph.zoom(-0.1);
      }
    },
    save() {
      this.$graph.toPNG((datauri) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      // this.$graph.toJPEG((datauri) => {
      //   DataUri.downloadDataUri(datauri, 'chart.jpeg')
      // })
      // this.$graph.toDataURL((datauri) => {
      //   console.log(datauri)
      // }, {
      //   padding: {
      //     top: 20,
      //     right: 30,
      //     bottom: 40,
      //     left: 50,
      //   }
      // })
      // this.$graph.toSVG((datauri) => {
      //   DataUri.downloadDataUri(DataUri.svgToDataUrl(datauri), 'chart.svg')
      // })
    },
    print() {
      this.$graph.printPreview()
    },
    toJSON() {
      // 序列化
      console.log(this.$graph.toJSON())
      // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
    },
    deleteCell() {
      // 选中删除
      const cells = this.$graph.getSelectedCells()
      this.$graph.removeCells(cells)
    },
    runJSON() {
      const cells = this.$graph.getCells()
      cells.forEach(item => {
        if (item instanceof Edge) {
          item.attr({
            line: {
              stroke: '#1890ff',
              strokeDasharray: 5,
              targetMarker: 'classic',
              style: {
                animation: 'ant-line 30s infinite linear',
              },
            },
          })
        }
      })
    }
  }
};

</script>
<style lang="scss">
.tool-bar {
  display: flex;
  align-items: center;
  height: 38px;
  background-color: #f7f9fb;
  border-bottom: 1px solid rgba(0, 0, 0, .08);

  i {
    font-size: 14px;
    color: #595959;
    margin: 0 6px;
    height: 20px;
    width: 20px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;

    &:hover {
      color: #262626;
      background-color: #e0e0e0;
    }
  }

  .line {
    align-self: center;
    width: 1px;
    height: 40%;
    margin: 0 6px;
    background-color: rgba(0, 0, 0, .15);
    content: " ";
    pointer-events: none;
  }

  .toJSON {
    background: #fff;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid #ddd;
    padding: 4px 8px;
    cursor: pointer;
  }

  .run {
    background: #398dee;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    padding: 4px 8px;
    cursor: pointer;
    margin: 0 0 0 10px;
  }
}

</style>
