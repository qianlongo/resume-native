let doc = document
let $ = (selector, context) => {
  return Array.from((context && context || doc).querySelectorAll(selector))
}

let html = (ele, sHtml) => {
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

module.exports = {
  $,
  html
}