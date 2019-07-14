let cssClasses = {
  loadingBar: {
    message: '.js-loading-message',
    bar: '.js-loading-bar'
  }
}

export function updateLoadingBar(current, max) {
  $(cssClasses.loadingBar.message).html(`processing image <strong>${current}</strong> of <strong>${max}</strong>`)
  $(cssClasses.loadingBar.bar).css('width', ((current / max) * 100) + '%')
}