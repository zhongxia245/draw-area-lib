## 一、绘制常见图形类库
>需要绘制图形的时候，简单的采用 mousedown,mousemove,mouseup 几个鼠标事件，来实现图形的绘制，但是绘制图形的时候，常常还需要使用辅助线，因此，这里封装了一下这个类库。

- [x] 绘制图形
- [x] 可控制的辅助线功能，辅助线可以对齐绘制出来的其他图形
- [x] 支持矩形，圆角矩形，圆，椭圆
- [x] 纯JS实现，不依赖其他类库

- [ ] 自带移动功能


## 二、如何使用？

```javascript
var drawCustomArea = new Draw.DrawCustomArea({
  pageId: 'main',   //可以绘制图形的容器id
  type: 'roud',     //绘制的类型  roud 圆角矩形,rect 矩形,circle 圆,oval 椭圆
  pointId: guid(),  //绘制出来图形的id
  useLine:true,     //是否使用辅助线
  beforeDrawCallback: function () {
    console.log('绘制前回调')
  },
  callback: function (data) {
    console.log('绘制结束', data)
  }
});
```