import './styles/base.scss'
import stylesEditor from './stylesEditor'
import resumeEditor from './resumeEditor'

let { showStyles } = stylesEditor
let { showResume, markdownToHtml } = resumeEditor

showStyles(0)
  .then(() => {
    return showResume()
  })
  .then(() => {
    return showStyles(1)
  })
  .then(() => {
    return markdownToHtml()
  })
  .then(() => {
    return showStyles(2)
  })