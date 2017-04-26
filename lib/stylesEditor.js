import styles from './data/styles'
import dom from './dom'
import Prism from 'prismjs'

let { $, html } = dom
let [style0] = styles
let delay = 1
let index = 0
let sHtml = ''
let timer = null

let $stylesWrap = $('#app .styles-wrap')[0]
let $style = $('style', $stylesWrap)[0]
let $stylePre = $('pre', $stylesWrap)[0]

const goBottom = () => {
  $stylesWrap.scrollTop = 10000
}

const showStyles = () => {
  timer = setInterval(() => {
    let char = style0.substring(index, index + 1)
    sHtml += char
    if (sHtml.length === style0.length) {
      clearInterval(timer)
    } else {
      // if (style0.substring(index, index - 1)=== '\n') {
        goBottom()
      // }
      html($style, sHtml)
      html($stylePre, Prism.highlight(sHtml, Prism.languages.css))
      index++
    }
  }, delay)
}

module.exports = {
  showStyles
}