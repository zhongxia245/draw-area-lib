/**
 * 自定义绘制图形
 * roud 圆角矩形  
 * rect 矩形
 * circle  圆
 * square 正方形【目前没用上】
 */
window.Draw = (function () {
  function DrawCustomArea(options) {
    var that = this
    that.data = options
    this.data.enable = options.enable || true;
    this.useLine = options.useLine || true;

    var xLine, yLine, oR
    var oCanvas = document.getElementById(that.data.pageId)

    oCanvas.onmousedown = function (ev) {
      oCanvas.style.cursor = 'se-resize'
      // 是否允许绘制,默认为true
      if (that.data.enable) {
        // 绘制之前的回调
        if (options.beforeDrawCallback) {
          options.beforeDrawCallback()
        }
        if (oCanvas.setCapture) {
          oCanvas.setCapture();
        }
        var oEv = ev || window.event;
        var dragging = false;

        /**
         * 因为clientX 获取的是鼠标在距离窗口的位置，因此页面上滑的时候，初始化有问题
         * offsetX 因为在 鼠标移动的时候，有时候不准，会变到0，因此得 clientX 和 offsetX 结合
         */
        var disX = oEv.offsetX;
        var disY = oEv.offsetY;
        var tempOffsetX = disX - oEv.clientX;
        var tempOffsetY = disY - oEv.clientY;

        oR = document.createElement('div');
        oR.id = that.data.pointId;
        oR.className = 'draw-area-container'
        oR.setAttribute('data-type', 'drawcustomarea')
        oR.style.cursor = 'se-resize'
        oR.style.top = disY + 'px';
        oR.style.left = disX + 'px';
        oR.style.background = '#5b9bd5';
        oR.style.position = 'absolute';
        oR.style.border = '2px solid #FFF';
        oCanvas.appendChild(oR);

        document.onmousemove = function (ev) {
          if (that.useLine) {
            initLine(oCanvas)
          }
          ev.stopPropagation()
          ev.preventDefault()

          var x = ev.clientX + tempOffsetX;
          var y = ev.clientY + tempOffsetY;

          if (that.useLine) {
            var newLocation = moveLine(oCanvas, x, y)
            x = newLocation.x;
            y = newLocation.y;
          }

          /**
           * 限制绘制的区域限制
           */
          // if (x < oCanvas.offsetLeft) {
          //   x = oCanvas.offsetLeft;
          // }
          // else if (x > oCanvas.offsetLeft + oCanvas.offsetWidth) {
          //   x = oCanvas.offsetLeft + oCanvas.offsetWidth
          // }
          // if (y < oCanvas.offsetTop) {
          //   y = oCanvas.offsetTop;
          // }
          // else if (y > oCanvas.offsetTop + oCanvas.offsetHeight) {
          //   y = oCanvas.offsetTop + oCanvas.offsetHeight
          // }

          oR.style.width = Math.abs(x - disX) + 'px';
          oR.style.top = Math.min(disY, y) + 'px';
          oR.style.left = Math.min(disX, x) + 'px';

          oR.classList.add('draw-custom-area__' + that.data.type)

          switch (that.data.type) {
            // 圆角矩形
            case 'roud':
              oR.style.height = Math.abs(y - disY) + 'px';
              break;
            // 圆形
            case 'circle':
              oR.style.height = Math.min(Math.abs(x - disX), Math.abs(y - disY)) + 'px';
              oR.style.width = Math.min(Math.abs(x - disX), Math.abs(y - disY)) + 'px';
              oR.style.borderRadius = '50%'
              break;
            // 椭圆形
            case 'oval':
              oR.style.height = Math.abs(y - disY) + 'px';
              oR.style.borderRadius = '50%'
              break;
            // 矩形
            case 'rect':
              oR.style.height = Math.abs(y - disY) + 'px';
              break;
            // 正方形
            case 'square':
              oR.style.height = Math.min(Math.abs(x - disX), Math.abs(y - disY)) + 'px';
              oR.style.width = Math.min(Math.abs(x - disX), Math.abs(y - disY)) + 'px';
          }
        }

        document.onmouseup = function () {
          oCanvas.style.cursor = 'pointer'
          oR.style.cursor = 'move'
          document.onmousemove = null;
          document.onmouseup = null;

          if (that.useLine) {
            removeLine()
          }

          if (oCanvas.releaseCapture) {
            oCanvas.releaseCapture();
          }
          if (that.data.callback) {
            that.data.callback({
              left: parseInt(oR.style.left),
              top: parseInt(oR.style.top),
              width: parseInt(oR.style.width),
              height: parseInt(oR.style.height)
            })
          }
        }
        return false;
      } else {
        oCanvas.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
    return that;
  }

  /**
   * 绘制一个图形之后，就默认不允许继续绘制，需要重新点击一下绘制的图形
   */
  DrawCustomArea.prototype.setEnable = function (enable) {
    this.data.enable = enable;
  }

  /**
   * 添加辅助线
   * @param {any} dom 
   */
  function initLine(dom) {
    if (!document.getElementById('__xline__')) {
      var xLine = document.createElement('div')
      xLine.setAttribute('id', '__xline__')
      xLine.classList.add('u-x-line')
      dom.appendChild(xLine)
    }
    if (!document.getElementById('__yline__')) {
      var yLine = document.createElement('div')
      yLine.setAttribute('id', '__yline__')
      yLine.classList.add('u-y-line')
      dom.appendChild(yLine)
    }
  }

  /**
   * 移动辅助线,并且有边线对其功能
   * @param {any} x 
   * @param {any} y 
   * @returns 
   */
  function moveLine(oCanvas, x, y) {
    var xLine = document.getElementById('__xline__')
    var yLine = document.getElementById('__yline__')
    var newLocation = calNearArea(oCanvas, x, y)
    xLine.style.top = newLocation.y + 'px'
    yLine.style.left = newLocation.x + 'px'
    return {
      x: newLocation.x,
      y: newLocation.y
    }
  }

  /**
   * 对齐线计算坐标
   * @param {any} x 
   * @param {any} y 
   * @returns 
   */
  function calNearArea(oCanvas, x, y) {
    var size = 10;
    var $areas = oCanvas.querySelectorAll('[data-type="drawcustomarea"]')
    for (var i = 0; i < $areas.length; i++) {
      var ele = $areas[i]
      var otherX = parseInt(ele.style.left)
      var otherY = parseInt(ele.style.top);
      var otherW = parseInt(ele.style.width);
      var otherH = parseInt(ele.style.height);

      if (Math.abs(x - otherX) < size) {
        x = otherX;
      }
      if (Math.abs(x - otherX - otherW) < size) {
        x = otherX + otherW;
      }
      if (Math.abs(y - otherY) < size) {
        y = otherY;
      }
      if (Math.abs(y - otherY - otherH) < size) {
        y = otherY + otherH;
      }
    }
    return {
      x: x,
      y: y
    }
  }

  /**
   * 移除辅助线
   */
  function removeLine() {
    var xLine = document.getElementById('__xline__')
    var yLine = document.getElementById('__yline__')
    xLine.parentNode.removeChild(xLine)
    yLine.parentNode.removeChild(yLine)
  }

  return {
    DrawCustomArea: DrawCustomArea,
  }
})()