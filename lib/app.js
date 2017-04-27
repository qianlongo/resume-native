import './styles/base.scss'
import stylesEditor from './stylesEditor'
import resumeEditor from './resumeEditor'
import co from './co'

let { showStyles } = stylesEditor
let { showResume, markdownToHtml } = resumeEditor

co(function* drawMyResume() {
  yield showStyles(0)
  yield showResume()
  yield showStyles(1)
  yield markdownToHtml()
  yield showStyles(2)
})
