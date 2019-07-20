let cssClasses = {
  loadingBar: {
    message: '.js-loading-message',
    bar: '.js-progress-bar'
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

export function showRankingElement(containerClass, rankedMap) {
  console.log(rankedMap)
  let container = $(containerClass)
  container.append('<div class="ranking-keys"></div>')
  container.append('<div class="ranking-values"></div>')

  let rankingKeysContainer = container.find('.ranking-keys')
  let rankingValuesContainer = container.find('.ranking-values')

  let rankingLength = Array.from(rankedMap.values())
                            .reduce((prev, next) => prev + next)
  let i = 0;
  rankedMap.forEach((value, key) => {
    rankingKeysContainer.append(`
      <div class="ranking-key-row">
        ${i == 0 ? '<strong>' : ''}<span>${key}</span>${i == 0 ? '</strong>' : ''}
      </div>
    `)
    rankingValuesContainer.append(`
      <div class="ranking-value-row">
        <span class="ranking-value-label">${Math.round((value / rankingLength) * 100)}%</span>
        <div class="ranking-value-progress">
          <div class="progress-bar-wrapper">
            <div class="progress-bar" style="width: ${(value / rankingLength) * 100}%"></div> 
          </div>
        </div>
      </div>
    `)
    i++
  })
  
}