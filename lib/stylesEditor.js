import styles from './data/styles'
import dom from './dom'
import Prism from 'prismjs'

let { $, html } = dom

let $stylesWrap = $('#app .styles-wrap')[0]
let $style = $('style', $stylesWrap)[0]
let $stylePre = $('pre', $stylesWrap)[0]

let currentStyle = ''
let delay = 60
let timer = null

const goBottom = () => {
  $stylesWrap.scrollTop = 10000
}

const showStyles = (num, callback) => {
  let style = styles[num]
  let length
  let prevLength

  if (!style) {
    return
  }

  length = styles.filter((item, i) => {
    return i <= num
  }).reduce((result, item) => {
    result += item.length
    return result
  }, 0)

  prevLength = length - style.length

  clearInterval(timer)
  timer = setInterval(() => {
    let start = currentStyle.length - prevLength
    let char = style.substring(start, start + 1) || ''
    currentStyle += char
    if (currentStyle.length === length) {
      clearInterval(timer)
      callback && callback()
    } else {
      // if (style0.substring(index, index - 1)=== '\n') {
      goBottom()
      // }
      html($style, currentStyle)
      html($stylePre, Prism.highlight(currentStyle, Prism.languages.css))
    }
  }, delay)
}

module.exports = {
  showStyles
}