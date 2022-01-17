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

  if (!style) {
    return
  }

  let start = 0

  clearInterval(timer)
  timer = setInterval(() => {
    let char = style.substring(start, start + 1) || ''

    currentStyle += char

    if (start >= style.length) {
      console.log('结束', num)
      clearInterval(timer)
      callback && callback()
    } else {
      goBottom($stylesWrap, $stylePre)
      goBottom($resumeWrap, $resumetag)
      $style.html(currentStyle)
      $stylePre.html(Prism.highlight(currentStyle, Prism.languages.css))
      start += 1
    }
  }, DELAY)
}

export {
  showStyles
}
