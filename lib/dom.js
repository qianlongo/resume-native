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

const addClass = (ele, iClass) => {
  if (ele.classList && ele.classList.add) {
    return ele.classList.add(iClass)
  }
  
  let classes = ele.className.join('')
  if (classes.indexOf(iClass) === -1) {
    ele.className += iClass
  }
}

module.exports = {
  $,
  html,
  css,
  addClass
}