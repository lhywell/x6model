import { Graph } from '@antv/x6';

export default class FlowGraph {
  constructor(opts) {
    this.graph = null
  }
  init() {
    let option = {
      container: document.getElementById('app-content'),
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
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
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

    return this.graph
  }
}
