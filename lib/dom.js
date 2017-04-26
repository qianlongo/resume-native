let doc = document
const $ = (selector, context) => {
  return Array.from((context && context || doc).querySelectorAll(selector))
}

const html = (ele, sHtml) => {
  if (sHtml === void 0) {
    return ele.innerHTML
  }

  if (Array.isArray(ele)) {
    ele.forEach((item, i) => {
      item.innerHTML = sHtml
    })
  } else {
    ele.innerHTML = sHtml
  }
}

const css = (ele, styles) => {
  for (let key in styles) {
    ele.style[key] = styles[key]
  }
} 

module.exports = {
  $,
  html,
  css
}