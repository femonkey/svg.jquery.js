# svg.jquery.js
## 这是一个关于 svg 结合 jquery 主要操作 path 元素，解析 path 命令的插件。
### 静态方法：
点坐标示例：point = {x: num, y: num};
求两点间的距离：$.distance(point1, point2)；
求两点组成线段与水平方向夹角：$.angle(point1, point2)；
创建一个 svg 元素：$.svg();
创建节点元素：$.create();
绘制 path：$.path().M(point1).L(point1).Z();
