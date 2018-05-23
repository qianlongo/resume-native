import 'styles/base.css'

import compose from 'utils/compose'
import { showStyles } from 'controller/stylesEditor'
import { showResume, markdownToHtml } from 'controller/resumeEditor'

// 借鉴koa-compose的方式处理异步回调，下面的注释是原来的写法
compose([
  showStyles.bind(null, 0),
  showResume,
  showStyles.bind(null, 1),
  markdownToHtml,
  showStyles.bind(null, 2)
])()

// // showResume()
// showStyles(0, () => {
//   showResume(() => {
//     showStyles(1, () => {
//       markdownToHtml(() => {
//         showStyles(2)
//       })
//     })
//   })
// })
// showStyles(1)
// showStyles(2)
// 回调太恶心，后面应该换成其他的形式完成
