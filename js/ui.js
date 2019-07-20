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

function prepareDataShowcaseElement(containerClass, rankedMap, keyPrefix = '') {
  let container = $(containerClass)
  container.append('<div class="ranking-keys"></div>')
  container.append('<div class="ranking-values"></div>')

  let rankingKeysContainer = container.find('.ranking-keys')
  let i = 0;
  rankedMap.forEach((value, key) => {
    if (i <= 8) {
      rankingKeysContainer.append(`
        <div class="ranking-key-row">
          <strong class="gradient-text">#${i+1}</strong> 
          ${i == 0 ? '<strong>' : ''}<span>${keyPrefix} ${key}</span>${i == 0 ? '</strong>' : ''}
        </div>
      `)
      
    } else if (i == 9) {
      rankingKeysContainer.append(`
        <div class="ranking-key-row">
          <span>...</span>
        </div>
      `)
    } else {
      return
    }
    i++
  })
}

export function showRankingProgressElement(containerClass, rankedMap, keyPrefix = '') {
  prepareDataShowcaseElement(containerClass, rankedMap, keyPrefix)

  let container = $(containerClass)
  let rankingValuesContainer = container.find('.ranking-values')
  let rankingLength = [...rankedMap.values()]
                            .reduce((prev, next) => prev + next)
  let i = 0;
  rankedMap.forEach((value, key) => {
    if (i <= 8) {
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
    } else if (i == 9) {
      rankingKeysContainer.append(`
        <div class="ranking-key-row">
          <span>...</span>
        </div>
      `)
    } else {
      return
    }
    i++
  }) 
}

export function showRankingLineChartElement(containerClass, rankedMap, keyPrefix = '') {
  prepareDataShowcaseElement(containerClass, rankedMap, keyPrefix)

  let container = $(containerClass)
  let rankingValuesContainer = container.find('.ranking-values')

  rankingValuesContainer.append(`
    <div class="ranking-value-row">
      <canvas id="pie-chart-${containerClass.replace('.', '')}"></canvas>
    </div>
  `)

  let keySortedMap = new Map([...rankedMap.entries()].sort())
  let rankingLength = [...rankedMap.values()]
                            .reduce((prev, next) => prev + next)

  let mapKeys = []
  let mapValues = []
  let i = 0;
  keySortedMap.forEach((value, key) => {
    mapKeys.push(key)
    mapValues.push((value / rankingLength) * 100)
    i++
  })

  let ctx = document.getElementById('pie-chart-' + containerClass.replace('.', '')).getContext('2d')

  let gradientLine = ctx.createLinearGradient(0, 0, 0, 250)
  gradientLine.addColorStop(0, 'rgba(255,182,138,1)')
  gradientLine.addColorStop(0.5, 'rgba(255,158,211,1)')
  gradientLine.addColorStop(1, 'rgba(41,196,255,1)')
  

  let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: mapKeys,
        datasets: [{
            label: '',
            pointBorderColor: 'red',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointBorderColor: 'black',
            pointHitRadius: 10,
            backgroundColor: 'transparent',
            borderColor: gradientLine,
            borderWidth: 9,
            data: mapValues
        }]
    },
    options: {
      layout: {
        padding: {
          top: 10
        }
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            display: false
             /*callback: function(value) {
                return value + '%';
             }*/
          },
          gridLines: {
            display: false,
            drawBorder: false,
          }
        }],
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
             callback: function(value) {
                return keyPrefix + ' ' + value
             }
          },
        }]
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) { 
              return Math.round(tooltipItems.yLabel)  + '%'
          }
        }
      }
    }
  })
}