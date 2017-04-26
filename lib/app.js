import styles from './data/styles'
import dom from './dom'

let {$, html} = dom
let [style0] = styles
let delay = 20
let index = 0
let sHtml = ''

let $stylesWrap = $('#app .styles-wrap')[0]
let $style = $('style', $stylesWrap)[0]
let $stylePre = $('pre', $stylesWrap)[0]

setInterval(() => {
  let char = style0.substring(index, index + 1)
  sHtml += char
  html([$style, $stylePre], sHtml)
  index++
}, delay)


