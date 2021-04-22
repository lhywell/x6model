import { Graph, DataUri, FunctionExt } from '@antv/x6';
import graphData from './data'

export default class FlowGraph {
  constructor(opts) {
    this.graph = null
  }
  static init() {
    let h = document.documentElement.clientHeight - 48 - 39
    let option = {
      container: document.getElementById('app-content'),
      height: h,
      history: true, //开启画布撤销/重做能力
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [{
          color: '#c5c5c5',
          thickness: 1,
        }],
      }, //开启网格
      snapline: { //对齐线是移动节点排版的辅助工具
        enabled: true,
        sharp: true,
      },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
        className: 'my-selecting',
      },
      keyboard: {
        enabled: true, // 是否开启快捷键系统
        /*
         * 为 true 时绑定键盘事件到 document 上，否则绑定在 container 上。
         * 当绑定键盘事件在 container 上时，需要设置 container 的 tabIndex = -1 才能捕获键盘事件
         */
        global: true,
        escape: true // 点击 esc 时是否终止连线、移动等交互
      },
      clipboard: {
        enabled: true, // 是否开启复制粘贴
        offset: 30,
        useLocalStorage: true,
      },
      panning: true,
      connecting: {
        snap: true, //自动吸附
        allowBlank: false, //是否允许连接到画布空白位置的点
        allowLoop: false, //是否允许创建循环连线
        allowNode: false, //是否允许边链接到节点
        highlight: true, //拖动边时，是否高亮显示所有可用的连接桩或节点
        connector: {
          name: 'smooth', //连接线平滑normal | smooth | rounded | jumpover
        },
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },
        validateConnection({ sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          return true
        },
      },
    }
    // scroller: {
    //   enabled: true,
    //   pageVisible: false,
    //   pageBreak: false,
    //   pannable: true,
    // },
    // keyboard: {
    //   enabled: true, // 是否开启快捷键系统
    //   /*
    //    * 为 true 时绑定键盘事件到 document 上，否则绑定在 container 上。
    //    * 当绑定键盘事件在 container 上时，需要设置 container 的 tabIndex = -1 才能捕获键盘事件
    //    */
    //   global: true,
    //   escape: true // 点击 esc 时是否终止连线、移动等交互
    // },
    // nodeStyle: {
    //   resizable: false,
    //   strokeWidth: 1
    // },
    // folding: {
    //   enabled: false // 禁止折叠
    // },
    // connection: {
    //   enabled: true // 开启连线交互
    // },
    // edgeStyle: {
    //   edge: "orth",
    //   endArrow: "classic",
    //   curved: true,
    //   fontSize: 16,
    //   movable: false
    // },
    // guide: {
    //   enabled: true,
    //   dashed: true,
    //   stroke: "#555555"
    // },
    // getAnchors(cell) {
    //   if (cell != null && cell.isNode()) {
    //     // 返回 6 个相对定位的锚点
    //     return [
    //       // [0.25, 0],
    //       // [0.5, 0],
    //       // [0.75, 0],

    //       [0, 0.5],
    //       [1, 0.5],

    //       // [0.25, 1],
    //       // [0.5, 1],
    //       // [0.75, 1]
    //     ];
    //   }
    //   return null;
    // }
    // getHtml: cell => {
    //   const wrap = document.createElement('div')
    //   wrap.style.width = '100%'
    //   wrap.style.height = '100%'
    //   wrap.innerHTML = cell.style.html
    //   wrap.addEventListener('click', () => {
    //     console.log('getHtml', cell)
    //     window.graph = graph
    //     this.nodeFrmData = Object.assign(cell.data, {
    //       isNode: cell._isNode,
    //       isEdge: cell._isEdge
    //     })
    //     this.showAttrConfig = true
    //   })
    //   wrap.innerHTML = cell.style.html
    //   return wrap
    // }
    this.graph = new Graph(option);

    this.graph.centerContent()

    // 反序列化
    this.initGraphShape()

    this.initEvent()
    this.initKey()

    return this.graph
  }
  static initGraphShape() {
    this.graph.fromJSON(graphData)
  }
  static initKey() {
    const { graph } = this;
    // https://craig.is/killing/mice
    // mousetrap
    graph.bindKey(['meta+d', 'ctrl+d'], e => {
      graph.clearCells();
      return false
    }, "keyup")

    graph.bindKey(['ctrl+z'], e => {
      graph.undo();
      return false
    }, "keyup");

    graph.bindKey(['meta+shift+z', 'ctrl+y'], e => {
      graph.redo();
      return false
    })

    graph.bindKey(["ctrl+="], e => graph.zoom(0.1));
    graph.bindKey(["ctrl+-"], e => graph.zoom(-0.1));

    graph.bindKey(['meta+c', 'ctrl+c'], e => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    }, "keyup")

    graph.bindKey(['meta+v', 'ctrl+v'], e => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    })
    graph.bindKey(['meta+x', 'ctrl+x'], e => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    })

    graph.bindKey(['meta+s', 'ctrl+s'], e => {
      graph.toPNG((datauri) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      return false
    })

    graph.bindKey(['meta+p', 'ctrl+p'], e => {
      graph.printPreview()
    })
  }
  static initEvent() {
    const { graph } = this;
    // graph.on("selection:changed", data => {
    //   // if (data.selected.length === 0) {
    //   //   this.showAttrConfig = false
    //   // } else {
    //   //   this.showAttrConfig = true
    //   //   let cell = data.selected[0]
    //   //   this.nodeFrmData = Object.assign(cell.data || {}, {
    //   //     isNode: cell._isNode,
    //   //     isEdge: cell._isEdge
    //   //   })
    //   // }
    // });
    // graph.on("mouseEvent", data => {
    //   let e = data.e;
    //   switch (data.eventName) {
    //     case "mouseDown":
    //       this.mouseDownMoveFlag = !e.state;
    //       // 记录点击位置
    //       this.mouseDownPos = e;
    //       break;
    //     case "mouseUp":
    //       this.mouseDownMoveFlag = false;
    //       // 一次移动结束，记录最终view偏移量
    //       this.viewTranslate = Object.assign({}, this.viewOffset);
    //       break;
    //     case "mouseMove":

    //       if (this.mouseDownMoveFlag) {
    //         let vt = this.viewTranslate;
    //         // 设置偏移位置
    //         let tx = e.graphX - this.mouseDownPos.graphX + vt.graphX || 0;
    //         let ty = e.graphY - this.mouseDownPos.graphY + vt.graphY || 0;
    //         // 保存view偏移量
    //         this.viewOffset = { graphX: tx, graphY: ty };
    //         graph.getView().setTranslate(tx, ty);
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // });
    // graph.on("click", ev => {
    //   let cell = ev.cell;
    //   if (cell) {
    //     this.showAttrConfig = true;
    //     this.nodeFrmData = Object.assign(cell.data || {}, {
    //       isNode: cell._isNode,
    //       isEdge: cell._isEdge
    //     });
    //   } else {
    //     this.showAttrConfig = false;
    //   }
    // });

    // 增加选中Node|Edge样式
    function reset() {
      // graph.drawBackground({ color: '#fff' })
      const nodes = graph.getNodes()
      const edges = graph.getEdges()

      nodes.forEach((node) => {
        node.attr('rect/stroke', '#108ee9')
      })

      edges.forEach((edge) => {
        edge.attr('line/stroke', '#000000')
        // edge.prop('labels/0', {
        //   attrs: {
        //     body: {
        //       stroke: '#7c68fc',
        //     },
        //   },
        // })
      })
    }

    graph.on('edge:click', ({ edge }) => {
      reset()
      edge.attr('line/stroke', 'orange')
    })
    graph.on('node:click', ({ node }) => {
      reset()
    })

    const container = document.getElementById('app-content')

    graph.on(
      'node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll(
          '.x6-port-body'
        )
        this.showPorts(ports, true)
      }),
      500
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body'
      )
      this.showPorts(ports, false)
    })
  }
  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
}
