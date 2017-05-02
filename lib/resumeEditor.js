import resumeMarkdown from './data/resume'
import $ from './vQuery'
import marked from 'marked'

let $resumeWrap = $('#app .resume-wrap')
let resumeWrap = $resumeWrap.get(0)
let $resumetag = $('.resume-tag', resumeWrap)
let $resumeMarkdown = $('.resume-markdown', resumeWrap)

let currentMarkdown = ''
let length = resumeMarkdown.length
let timer = null
let delay = 60
let start = 0
let iClass = 'htmlMode'

const markdownToHtml = (callback) => {
  $resumeMarkdown.css({
    display: 'none'
  })
  $resumeWrap.addClass(iClass)
  $resumetag.html(marked(resumeMarkdown))
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
      $resumeMarkdown.html(currentMarkdown)
      start++
    }
  }, delay)
}

export default {
  showResume,
  markdownToHtml
}
