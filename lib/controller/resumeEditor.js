import marked from 'marked'
import resumeMarkdown from 'data/resume'
import $ from 'common/vQuery'
import { DELAY } from 'config/index'
import { goBottom } from 'common/dom'

let $resumeWrap = $('#app .resume-wrap')
let resumeWrap = $resumeWrap.get(0)
let $resumetag = $('.resume-tag', resumeWrap)
let $resumeMarkdown = $('.resume-markdown', resumeWrap)

let currentMarkdown = ''
let length = resumeMarkdown.length
let timer = null
let start = 0
let iClass = 'html-mode'

const markdownToHtml = (callback) => {
  $resumeMarkdown.css({
    display: 'none'
  })
  $resumeWrap.addClass(iClass)
  $resumetag.html(marked(resumeMarkdown))
  goBottom($resumeWrap, $resumetag)
  callback && callback()
}

const showResume = (callback) => {
  clearInterval(timer)
  timer = setInterval(() => {
    currentMarkdown += resumeMarkdown.substring(start, start + 1)
    if (currentMarkdown.length === length) {
      clearInterval(timer)
      callback && callback()
    } else {
      goBottom($resumeWrap, $resumeMarkdown)
      $resumeMarkdown.html(currentMarkdown)
      start++
    }
  }, DELAY)
}

export {
  showResume,
  markdownToHtml
}
