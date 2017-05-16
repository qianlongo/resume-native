## 前言

> 了解`co`的前提是已经知晓`generator`是什么，可以看软大神的[Generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator),
co是TJ大神写的能够使generator自动执行的函数库，而我们熟知的koa也用到了它管理异步流程控制，将异步任务书写同步化，爽的飞起，也摆脱了一直以来的回调地狱问题。


![](http://odssgnnpf.bkt.clouddn.com/ad51ce297e8dd51850842ff012bdc3cb.jpg)


## 如何使用

> 首先我们根据[co](https://github.com/tj/co)的官方文档来稍做改变看下，到底如何使用co，再一步步进行源码分析工作(这篇文章分析的co版本是`4.6.0`)。

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
  console.log(a) // delayTime: 1000
  let b = yield timeout2()
  console.log(b) // delayTime: 200
}

co(function * () {
  yield gen()

  return 'end'
}).then((res) => {
  console.log(res) // end
})

```

**最后说一下，关于执行传入的generator函数接收参数的问题**

``` javascript
let co = require('co')

co(function * (name) {
  console.log(name) // qianlongo
}, 'qianlongo')

```

从co函数的第二个参数开始，便是传入的generator函数可以接收的实参

## 开始分析源码

> 你可以把以上代码拷贝至本地测试一番看看效果，接下来我们一步步开始分析co的源码

**首先经过上面的例子可以发现，co函数本身接收一个generator函数，并且co执行后返回的是Promise**

``` javascript
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1)

  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    // xxx
  });
}

```

在Promise的内部，先执行了外部传入的`gen`,执行的结果如果不具备next属性(且要是一个函数)，就直接返回，并将执行成功回调`resolve(gen)`,否则得到的是一个指针对象。

**接下来继续看...**

``` javascript

onFulfilled();

/**
  * @param {Mixed} res
  * @return {Promise}
  * @api private
  */

function onFulfilled(res) {
  var ret;
  try {
    ret = gen.next(res); // 用上面执行gen之后的generator生成器将指针指向下一个位置
  } catch (e) {
    return reject(e);
  }
  next(ret); // 紧接着执行next，正是它实现了反复调用自己，自动流程控制，注意ret(即上一次gen.next执行后返回的对象{value: xxx, done: true or false})
}

/**
  * @param {Error} err
  * @return {Promise}
  * @api private
  */

function onRejected(err) {
  var ret;
  try {
    ret = gen.throw(err);
  } catch (e) {
    return reject(e);
  }
  next(ret);
}

```

我觉得可以把 `onFulfilled` 和 `onRejected` 看成是返回的Promise的`resolve`和`reject`。

而`onFulfilled`也是将原生的generator生成器的next方法包装了一遍，大概是为了抓取错误吧(看到内部的try catch了吗)


**好，我们看到了co内部将指针移动到了第一个位置之后，接着执行了内部的next方法，接下来聚焦在该函数上**

``` javascript

function next(ret) {
  // 如果整个generator函数已经走完，便将Promise的状态设置为成功状态，并执行resolve
  if (ret.done) return resolve(ret.value);
  // 这一步是将ret的value转换为Promise形式
  var value = toPromise.call(ctx, ret.value);
  // 这里非常关键，是co实现自己调用自己，实现流程自动化的关键
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  // 抛出错误，yield后只能跟着指定的下列这几种类型
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
    + 'but the following object was passed: "' + String(ret.value) + '"'));
}

```
