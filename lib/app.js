import 'styles/base.css'
import stylesEditor from 'controller/stylesEditor'
import resumeEditor from 'controller/resumeEditor'

let { showStyles } = stylesEditor
let { showResume, markdownToHtml } = resumeEditor

// showResume()
showStyles(0, () => {
  showResume(() => {
    showStyles(1, () => {
      markdownToHtml(() => {
        showStyles(2)
      })
    })
  })
})
// showStyles(1)
// showStyles(2)
// 回调太恶心，后面应该换成其他的形式完成
