// 实现generator函数的异步流程管理
const co = (generator) => {
  let gen = generator()
  let next = (data) => {
    let result = gen.next(data)

    if (!result.done) {
      result.value(next)
    }
  }
  next()
}

export default co
