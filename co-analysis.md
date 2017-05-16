## 前言

> 了解`co`的前提是已经知晓`generator`是什么，可以看软大神的[Generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator),
co是TJ大神写的能够使generator自动执行的函数库，而我们熟知的koa也用到了它管理异步流程控制，将异步任务书写同步化，爽的飞起，也摆脱了一直以来的回调地狱问题。


![](http://odssgnnpf.bkt.clouddn.com/ad51ce297e8dd51850842ff012bdc3cb.jpg)


## 如何使用

> 首先我们根据[co](https://github.com/tj/co)的官方文档来稍做改变看下，到底如何使用co，再一步步进行源码分析工作。

**yield 后面常见的可以跟的类型**

1. promises
2. array (parallel execution)
3. objects (parallel execution)
4. generator functions (delegation)

**promises**

``` javascript
let co = require('co')
let genTimeoutFun = (delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`delayTime: ${delay}`)
      }, delay)
    })
  }
}
let timeout1 = genTimeoutFun(1000)
let timeout2 = genTimeoutFun(200)

co(function * () {
  let a = yield timeout1()
  console.log(a) // delayTime: 1000
  let b = yield timeout2()
  console.log(b) // delayTime: 200

  return 'end'
}).then((res) => {
  console.log(res)
})

```

**array**

``` javascript
let co = require('co')
let genTimeoutFun = (delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`delayTime: ${delay}`)
      }, delay)
    })
  }
}
let timeout1 = genTimeoutFun(1000)
let timeout2 = genTimeoutFun(200)

co(function * () {
  let a = yield [timeout1(), timeout2()]
  console.log(a) // [ 'delayTime: 1000', 'delayTime: 200' ]
  return 'end'
}).then((res) => {
  console.log(res) // end
})

```

**objects**

``` javascript
let co = require('co')
let genTimeoutFun = (delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`delayTime: ${delay}`)
      }, delay)
    })
  }
}
let timeout1 = genTimeoutFun(1000)
let timeout2 = genTimeoutFun(200)

co(function * () {
  let a = yield {
    timeout1: timeout1(),
    timeout2: timeout2()
  }
  console.log(a) // { timeout1: 'delayTime: 1000',timeout2: 'delayTime: 200' }
  return 'end'
}).then((res) => {
  console.log(res) // end
})

```

**generator functions**

``` javascript
let co = require('co')
let genTimeoutFun = (delay) => {
  return () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`delayTime: ${delay}`)
      }, delay)
    })
  }
}
let timeout1 = genTimeoutFun(1000)
let timeout2 = genTimeoutFun(200)

function * gen () {
  let a = yield timeout1()
  console.log(a)
  let b = yield timeout2()
  console.log(b)
}

co(function * () {
  yield gen()

  return 'end'
}).then((res) => {
  console.log(res)
})

```