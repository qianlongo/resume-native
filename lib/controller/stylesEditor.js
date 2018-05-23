import Prism from 'prismjs'
import styles from 'data/styles'
import $ from 'common/vQuery'
import { DELAY } from 'config/index'
import { goBottom } from 'common/dom'

let $stylesWrap = $('#app .styles-wrap')
let $resumeWrap = $('#app .resume-wrap')
let resumeWrap = $resumeWrap.get(0)
let $resumetag = $('.resume-tag', resumeWrap)
let stylesWrap = $stylesWrap.get(0)
let $style = $('style', stylesWrap)
let $stylePre = $('pre', stylesWrap)

let currentStyle = ''
let timer = null

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
      goBottom($stylesWrap, $stylePre)
      goBottom($resumeWrap, $resumetag)
      $style.html(currentStyle)
      $stylePre.html(Prism.highlight(currentStyle, Prism.languages.css))
    }
  }, DELAY)
}

export {
  showStyles
}
