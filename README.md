## 谢谢你来啦

也许你我素未谋面，但很可能相见恨晚。希望这里能成为你的栖息之地，我愿和你一起收获喜悦，奔赴成长。

这里每年都会分享不少于`200+篇`精选优质好文，如果你想第一时间获取文章内容，可以前往[【公众号】](#公众号)，也可以加我[【微信】](#公众号)噢。

<p align="center">
  <a href="#公众号"><img src="https://img.shields.io/badge/weChat-微信群-blue.svg" alt="微信群"></a>
  <a href="#公众号"><img src="https://img.shields.io/badge/%E5%85%AC%E4%BC%97%E5%8F%B7-前端胖头鱼-blue.svg" alt="公众号"></a>
  <a href="https://juejin.cn/user/3438928099549352"><img src="https://img.shields.io/badge/juejin-掘金-blue.svg" alt="公众号"></a>
  <a href="https://segmentfault.com/u/116263"><img src="https://img.shields.io/badge/sg-sg-blue.svg" alt="公众号"></a>
  <a href="https://www.zhihu.com/people/qian-duan-pang-tou-yu"><img src="https://img.shields.io/badge/zhihu-知乎-informational" alt="投稿"></a>
 </p>

## 简要说明

> 一个好玩的会动的简历 O(∩_∩)O哈哈~，通过`callback`、`promise`、`generator`、`async`四种方式分别实现。

[点击预览](https://qianlongo.github.io/resume-native/dist/)

## 异步流程控制说明

> 可以切换到以下不同的分支来查看，简历生成过程中异步流程控制解决方案

1. master(使用回调函数处理)
2. promise(使用promise处理)
3. generator-thunk(使用generator + thunk函数处理)
4. generator-promise(使用generator + promise处理)
5. async(使用async处理)


## install

```javascript
yarn i

```

## run

```javascript
npm run dev

```

## preview

```javascript
localhost:8080

or

127.0.0.1:8080

or

0.0.0.0:8080

```

## build

```javascript
npm run build

```

## co源码分析

> 其实开始对generator感兴趣，正是由写这个会动的简历开始，一步步弄明白了怎么使用，以及通过它来解决一些异步流程控制问题。而[co](https://github.com/tj/co)这个东西是什么呢？其正是解决上述问题的非常好的方案。所以打算写一篇[走一步再走一步，揭开co的神秘面纱](https://github.com/qianlongo/resume-native/blob/master/co-analysis.md)源码分析的文章。放在这个仓库里，也是有一定的纪念意义。


## koa源码分析(进行中)

> 最近的工作涉及到编写nodejs的事情，而使用的框架正是横向同事基于koa而搭建的，虽然平时使用起来没有什么问题，但是总想整明白框架本身到底是怎么回事，既然框架本身是基于koa而搭建，那么先熟悉和了解koa的源码，再去看同事搭建的框架应该会更好，说干就干...

[你知道koa中间件执行原理吗？](https://github.com/qianlongo/resume-native/issues/1)