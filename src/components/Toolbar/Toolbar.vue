<template>
  <div class="tool-bar">
    <i @click="clear" class="iconfont iconqingchu" title="清除"></i>
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
    <i class="iconfont iconcopy" title="复制"></i>
    <i class="iconfont iconcut" title="剪切"></i>
    <i class="iconfont iconpaste" title="粘贴"></i>
    <span class="line"></span>
    <i class="iconfont iconsave" @click="save" title="保存"></i>
    <i class="iconfont iconinterface_printer_line" @click="print" title="打印"></i>
  </div>
</template>
<script>
import { DataUri } from '@antv/x6'

export default {
  name: 'Toolbar',
  data() {
    return {};
  },
  updated() {
    // const { graph } = FlowGraph
    // const { history } = graph
    // setCanUndo(history.canUndo())
    // setCanRedo(history.canRedo())
    // history.on('change', () => {
    //   setCanUndo(history.canUndo())
    //   setCanRedo(history.canRedo())
    // })

    this.$nextTick(() => {
      console.log(this.$graph)
      this.$graph.bindKey(['meta+d', 'ctrl+d'], this.clear)

      // this.$graph.bindKey(['meta+z', 'ctrl+z'], e => {
      //   this.undo();
      // }）
      this.$graph.bindKey(['ctrl+z'], e => { this.undo() }, "keyup");
      this.$graph.bindKey(['meta+shift+z', 'ctrl+y'], this.redo)

      this.$graph.bindKey(['meta+s', 'ctrl+s'], this.save)

      this.$graph.bindKey(['meta+c', 'ctrl+c'], e => {
        console.log(222)
        this.copy()
      }, "keyup")
      this.$graph.bindKey(['meta+v', 'ctrl+v'], this.paste)
      this.$graph.bindKey(['meta+x', 'ctrl+x'], this.cut)

      this.$graph.bindKey(['meta+p', 'ctrl+p'], this.print)
    })

  },
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
      if (cells.length) {
        this.$graph.copy(cells)
      }
      return false
    },
    cut() {
      const cells = this.$graph.getSelectedCells()
      if (cells.length) {
        this.$graph.cut(cells)
      }
      return false
    },
    paste() {
      if (!this.$graph.isClipboardEmpty()) {
        const cells = this.$graph.paste({ offset: 32 })
        this.$graph.cleanSelection()
        this.$graph.select(cells)
      }
      return false
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
    },
    print() {
      this.$graph.printPreview()
    },
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
}

</style>
