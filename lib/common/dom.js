export const goBottom = (wrapContainer, innerContainer) => {
  let top = innerContainer.height() - wrapContainer.contentHeight()

  if (top > 0) {
    wrapContainer.scrollTop(top)
  }
}
