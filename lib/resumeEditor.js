import resumeMarkdown from './data/resume'
import dom from './dom'
import marked from 'marked'

let { $, html, css, addClass } = dom

let $resumeWrap = $('#app .resume-wrap')[0]
let $resumetag = $('.resume-tag', $resumeWrap)[0]
let $resumeMarkdown = $('.resume-markdown', $resumeWrap)[0]

let currentMarkdown = ''
let length = resumeMarkdown.length
let timer = null
let delay = 60
let start = 0
let iClass = 'htmlMode'

const markdownToHtml = () => {
  return new Promise((resolve, reject) => {
    css($resumeMarkdown, {
      display: 'none'
    })
    addClass($resumeWrap, iClass)
    html($resumetag, marked(resumeMarkdown))
    resolve()
  })
}

const showResume = () => {
  return new Promise((resolve, reject) => {
    clearInterval(timer)
    timer = setInterval(() => {
      currentMarkdown += resumeMarkdown.substring(start, start + 1)
      if (currentMarkdown.length === length) {
        clearInterval(timer)
        resolve()
      } else {
        html($resumeMarkdown, currentMarkdown)
        start++
      }
    }, delay)
  })
}

module.exports = {
  showResume,
  markdownToHtml
}
