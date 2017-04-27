import './styles/base.scss'
import stylesEditor from './stylesEditor'
import resumeEditor from './resumeEditor'

let { showStyles } = stylesEditor
let { showResume, markdownToHtml } = resumeEditor

let showStylesWrap = (num) => {
  return showStyles(num)
}
let markdownToHtmlWrap = () => {
  return markdownToHtml()
}
let showResumeWrap = () => {
  return showResume()
}

showStylesWrap(0)
  .then(showResumeWrap)
  .then(showStylesWrap.bind(null, 1))
  .then(markdownToHtmlWrap)
  .then(showStylesWrap.bind(null, 2))