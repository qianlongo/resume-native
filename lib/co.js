// 实现generator函数的异步流程管理
const co = (generator) => {
  let gen = generator()
  let next = (data) => {
    let result = gen.next(data)

    if (result.done) {
      return result.value
    } else {
      result.value.then((data) => {
        next(data)
      })
    }
  }
  next()
}

export default co
