import resumeMarkdown from './data/resume'
import dom from './dom'
import marked from 'marked'

let { $, html, css } = dom

let $resumeWrap = $('#app .resume-wrap')[0]
let $resumetag = $('.resume-tag', $resumeWrap)[0]
let $resumeMarkdown = $('.resume-markdown', $resumeWrap)[0]

let currentMarkdown = ''
let length = resumeMarkdown.length
let timer = null
let delay = 1
let start = 0
let enableHtml = false

const goBottom = () => {
  $resumeWrap.scrollTop = 10000
}

const markdownToHtml = (callback) => {
  css($resumeMarkdown, {
    display: 'none'
  })
  html($resumetag, marked(resumeMarkdown))
  callback && callback()
}

const showResume = (callback) => {
  clearInterval(timer)
  timer = setInterval(() => {
    currentMarkdown += resumeMarkdown.substring(start, start + 1)
    if (currentMarkdown.length === resumeMarkdown.length) {
      clearInterval(timer)
      callback && callback()
    } else {
      html($resumeMarkdown, currentMarkdown)
      start++
    }
  }, delay)
}

module.exports = {
  showResume,
  markdownToHtml
}
