## 用原生js写一个"多动症"的简历

[预览地址](https://qianlongo.github.io/resume-native/dist/)
[源码地址](https://github.com/qianlongo/resume-native)

> 最近在知乎上看到@方应杭用vue写了一个[会动的简历](https://zhuanlan.zhihu.com/p/25541520)，觉得挺好玩的，研究一下其实现思路，决定试试用原生js来实现。

![http://odssgnnpf.bkt.clouddn.com/return.gif](http://odssgnnpf.bkt.clouddn.com/160529jhf0hrzhffcl8jh4.jpg)


## 会动的简历实现思路

> 这张会`动`的简历，就好像一个打字员在不断地录入文字，页面呈现动态效果。又好像一个早已经录制好影片，而我们只是坐在放映机前观看。

**原理分两个部分**

1. 页面能看见的不断跳动着的增加的文字，由innerHTML控制
2. 页面的布局效果由藏在"背后的"`style`标签完成

**想象一下你要往一张网页每间隔0.1秒增加一个`啊`字，是不是开个定时器，间断地往body里面塞`啊`，就可以啊！没错，做到这一步就完成了原理的第一部分**

**再想象一下，在往页面里面塞`啊`的时候，我还想改变啊字的字体颜色以及网页背景颜色，那应该怎么做呢，是不是执行下面的代码就可以呢，没错，只不过更改字体和背景色不是突然改变的，而是也是开个定时器，间断地往`style`标签中塞入以下代码，这样就完成了原理的第二步，是不是好简单 😀😀😀， 接下来让我们一步步完成它**

```style
.xxx{
  color: blue;
  background: red; 
}

```

## 项目搭建

> 在这个项目中我们

1. 使用webpack2来完成项目的构建
2. 使用yarn来处理依赖包的管理
3. 使用es6的写法
4. 使用部分原生dom操作api

目录结构如下

![目录结构](http://odssgnnpf.bkt.clouddn.com/QQ20170503-013138@2x.png)

最重要的几个模块分别是`resumeEditor(简历编辑模块)` 、 `stylesEditor(简历样式编辑模块)` 、 `以及vQuery(封装的dom操作模块)`
最后`app.js(入口模块)`再将几个模块的功能结合起来完成整个项目。
