let cssClasses = {
  loadingBar: {
    message: '.js-loading-message',
    bar: '.js-loading-bar'
  },
  header: {
    realName: '.js-user-full-name',
    userName: '.js-user-name'
  },
  dataQuickShowcase: '.js-data-quick-showcase'
}

export function updateLoadingBar(current, max) {
  $(cssClasses.loadingBar.message).html(`processing image <strong>${current}</strong> of <strong>${max}</strong>`)
  $(cssClasses.loadingBar.bar).css('width', ((current / max) * 100) + '%')
}

export function showSummary(realName, camera, lense, fNumber, iso, exposureTime) {
  let text = `
  ${realName} mostly uses his <span>${camera}</span> camera with the <span>${lense}</span> lens.
  He shoots most at <span>F ${fNumber}</span>, <span>ISO ${iso}</span> at a <span>${exposureTime}s</span> exposure time.
  `;
  $(cssClasses.dataQuickShowcase).html(text)
}

export function showUserHeader(realName, userName) {
  if (realName) {
    $(cssClasses.header.realName).html(realName)
    $(cssClasses.header.userName).html(userName)
  } else {
    $(cssClasses.header.realName).html(userName)
  }
}