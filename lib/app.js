import './styles/reset.scss'
import stylesEditor from './stylesEditor'
import resumeEditor from './resumeEditor'

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
