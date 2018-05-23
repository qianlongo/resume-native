// 借鉴koa-compose的思想，处理异步回调
export default (cbs) => {
  let len = cbs.length
  let next = () => {}

  while (len--) {
    next = cbs[len].bind(null, next)
  }

  return next
}
