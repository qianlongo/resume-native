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
5. standard.js(代码风格约束利器)

目录结构如下

![目录结构](http://odssgnnpf.bkt.clouddn.com/QQ20170503-013138@2x.png)

最重要的几个模块分别是`resumeEditor(简历编辑模块)` 、 `stylesEditor(简历样式编辑模块)` 、 `以及vQuery(封装的dom操作模块)`
最后`app.js(入口模块)`再将几个模块的功能结合起来完成整个项目。

## 以及vQuery(封装的dom操作模块)

> 因为后面的几个模块都要依赖这个小模块，所以我们先简单的看下。


``` javascript
class Vquery {
  constructor (selector, context) {
    this.elements = getEles(selector, context)
  }

  optimizeCb (callback) {
    ...
  }

  get (index) {
    ...
  }

  html (sHtml) {
    ...
  }

  addClass (iClass) {
    ...
  }

  css (styles) {
    ...
  }

  height (h) {
    ...
  }

  scrollTop (top) {
    ...
  }
}

export default (selector, context) => {
  return new Vquery(selector, context)
}


```

**可以看出它做的事就是封装一个构造函数Vquery，它的实例会有一些简单的dom操作方法，最后为了能够像jQuery那样使用$().funcName的形式去使用，我们导出了一个匿名函数，在匿名函数中去new Vquery**

### stylesEditor(简历样式编辑模块)

> 简历所展现的布局效果都是由这个模块完成的,核心方式是showStyles。

``` javascript
const showStyles = (num, callback) => {
  let style = styles[num]
  let length
  let prevLength

  if (!style) {
    return
  }

  length = styles.filter((item, i) => { // 计算数组styles前n个元素的长度
    return i <= num
  }).reduce((result, item) => {
    result += item.length
    return result
  }, 0)

  prevLength = length - style.length

  clearInterval(timer)
  timer = setInterval(() => {
    let start = currentStyle.length - prevLength
    let char = style.substring(start, start + 1) || ''
    currentStyle += char
    if (currentStyle.length === length) { // 数组styles前n个元素已经全部塞入，则关闭定时器，并且执行外面传进来的回调，进而执行下一步操作
      clearInterval(timer)
      callback && callback()
    } else {
      let top = $stylePre.height() - MAX_HEIGHT
      if (top > 0) { // 当塞入的内容已经操作了容器的高度，我们需要设置一下滚动距离才方便演示接下来的内容
        goBottom(top)
      }
      $style.html(currentStyle)
      $stylePre.html(Prism.highlight(currentStyle, Prism.languages.css))
    }
  }, delay)
}


```
## stylesEditor(简历样式编辑模块)

> 简历编辑模块用来展示简历内容，主要会经历由markdown格式往html页面形式的转换。

```
const markdownToHtml = (callback) => {
  $resumeMarkdown.css({
    display: 'none'
  })
  $resumeWrap.addClass(iClass)
  $resumetag.html(marked(resumeMarkdown)) // 借助marked工具将markdown转化为html
  callback && callback() // 执行后续的回调
}

const showResume = (callback) => { // 原理基本上同stylesEditor， 不断地往简历编辑的容器中塞入事先准备好的简历内容，当全部塞入的时候再关闭定时器，并执行后续的回调操作
  clearInterval(timer)
  timer = setInterval(() => {
    currentMarkdown += resumeMarkdown.substring(start, start + 1)
    if (currentMarkdown.length === length) {
      clearInterval(timer)
      callback && callback()
    } else {
      $resumeMarkdown.html(currentMarkdown)
      start++
    }
  }, delay)
}

```

## app(入口模块)

> 最后由app入口模块将以上几个模块整合完成项目的功能，我们找出其中的核心代码来, 😀，你没看错，传说中的回调地狱，亮瞎了我的狗眼啊。想必大家和我一样都是不愿意看到这坨恶心的代码的，单对于处理异步问题，回调又的确是一直以来的解决方案之一。

**因为定时器的操作是异步行为，而我们的简历生成过程会涉及到多个异步操作，所以为了看到如首页预览页面的效果，必须等前一个步骤完成之后，才能执行下一步步骤，这里首先使用的回调函数的解决方案，大家可以从github上拉取代码，分别切换以下几个分支来查看不同的解决方案**

1. master(使用回调函数处理)
2. promise(使用promise处理)
3. generator-thunk(使用generator + thunk函数处理)
4. generator-promise(使用generator + promise处理)
5. async(使用async处理)

![](http://odssgnnpf.bkt.clouddn.com/400-5.jpg)

```javascript
showStyles(0, () => {
  showResume(() => {
    showStyles(1, () => {
      markdownToHtml(() => {
        showStyles(2)
      })
    })
  })
})


```