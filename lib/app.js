import './styles/base.scss'
import stylesEditor from './stylesEditor'
import resumeEditor from './resumeEditor'

let { showStyles } = stylesEditor
let { showResume, markdownToHtml } = resumeEditor

async function drawMyResume () {
  await showStyles(0)
  await showResume()
  await showStyles(1)
  await markdownToHtml()
  await showStyles(2)
}
drawMyResume()
// co(function * drawMyResume () {
//   yield showStyles(0)
//   yield showResume()
//   yield showStyles(1)
//   yield markdownToHtml()
//   yield showStyles(2)
// })
