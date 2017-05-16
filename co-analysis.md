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
  // 如果整个generator函数的内部状态已经表示走完，便将Promise的状态设置为成功状态，并执行resolve
  if (ret.done) return resolve(ret.value);
  // 这一步是将ret的value转换为Promise形式
  var value = toPromise.call(ctx, ret.value);
  // 这里非常关键，是co实现自己调用自己，实现流程自动化的关键
  // 注意这里使用value.then，即为返回值添加成功和失败的回调，在成功的回调里面再去执行onFulfilled，紧接着就是调用内部的next函数
  // 那不是就保证了流程完全按照你写的顺序来了？
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  // 抛出错误，yield后只能跟着指定的下列这几种类型
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
    + 'but the following object was passed: "' + String(ret.value) + '"'));
}

```

**聪明的你，是不是已经明白了co是怎么将异步流程自动管理起来了**

但是我对next函数中的toPromise函数还有疑问，他到底做了什么事？使得co(generatorFun)中yield可以支持数组、对象、generator函数等形式。

**一步步来看**

``` javascript

function toPromise(obj) {
  // obj不存在，直接返回
  if (!obj) return obj;
  // 如果obj已经是Promise，则也是直接返回
  if (isPromise(obj)) return obj;
  // 如果是个generator函数或者generator生成器，那就像你自己调用co函数一样，手动传到co里面去执行
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  // 如果obj既不是Promise，也不是isGeneratorFunction和isGenerator，要是一个普通的函数（需要符合thunk函数规范），就将该函数包装成Promise的形式
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  // 如果是一个数组的形式，就去arrayToPromise包装一番
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}

```

首先如果obj不存在，就直接返回，你想啊，co本来就是依赖上一次指针返回的value是Promise或者其他，这个时候如果返回

``` javascript
{
  value: false,
  done: false
}
```
那就没有必要再给一个false值转成Promise形式了吧。


接着，如果obj本身就是个Promise也是直接返回，用了内部的isPromise函数进行判断，我们看下他怎么实现的。

``` javascript

function isPromise(obj) {
  return 'function' == typeof obj.then;
}
```

其实就是判断了obj的then属性是不是个函数

**再接着，如果是个generator函数或者generator生成器，那就像你自己调用co函数一样，手动传到co里面去执行。**

**isGeneratorFunction**

``` javascript

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

```

通过obj的constructor属性去判断其是否属于`GeneratorFunction`,最后如果constructor属性没判断出来，再去用isGenerator，判断obj的原型是不是generator生成器

``` javascript
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
```

**判断的条件也比较直接，需要符合两个条件，一个是obj.next要是一个函数，一个是obj.throw要是一个函数**


**接下来继续看**

如果obj既不是Promise，也不是isGeneratorFunction和isGenerator，要是一个普通的函数，就将该函数包装成Promise的形式，这里我们主要需要看`thunkToPromise`

``` javascript
function thunkToPromise(fn) {
  var ctx = this;
  // 将thunk函数包装成Promise
  return new Promise(function (resolve, reject) {
      // 执行这个thunk函数
    fn.call(ctx, function (err, res) { 
      // 注意thunk函数内部接收的回调函数中传入的第一个参数是err，出现了err，当然需要走reject了
      if (err) return reject(err); 
      // 参数是两个以上的情况下，将参数整成一个数组
      if (arguments.length > 2) res = slice.call(arguments, 1);
      // 最后执行成功的回调
      resolve(res);
    });
  });
}

```

**接下来是重头戏了，co中如果处理yield后面跟一个数组呢？主要是arrayToPromise函数的作用**

``` javascript
function arrayToPromise(obj) {
  // 使用到了Promise.all，将obj中多个promise实例(当然你也可以在数组中填thunk函数，generator函数等)重新包装成一个。最后返回一个新的Promise
  return Promise.all(obj.map(toPromise, this));
}

```

**还有最后一个判断，如果obj是个对象怎么办？**

``` javascript
function objectToPromise(obj){
  // 构造一个和传入对象有相同构造器的对象, results也是
  var results = new obj.constructor();
  // 获取obj的keys
  var keys = Object.keys(obj);
  // 存储obj中是Promise的属性
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    // 如果是结果是Promise，则用defer函数对results进行修改
    if (promise && isPromise(promise)) defer(promise, key);
    // 如果是非Promise就按原样返回
    else results[key] = obj[key];
  }
  // 最后 使用到了Promise.all，将obj中多个promise实例
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      // 运行成功之后再讲结果赋值给results
      results[key] = res;
    }));
  }
}

```

## 结尾

> 到这里，co源码分析就告一段落了。总感觉有些没有说到位，欢迎大家拍砖，晚安。








