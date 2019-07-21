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

  let gradientLine = ctx.createLinearGradient(0, 0, 20, 250)
  gradientLine.addColorStop(0, 'rgba(255,182,138,1)')
  gradientLine.addColorStop(0.5, 'rgba(255,158,211,1)')
  gradientLine.addColorStop(1, 'rgba(41,196,255,1)')
  

  let chart = new Chart(ctx, {
    type: 'roundedBar',
    data: {
        labels: mapKeys,
        datasets: [{
            label: '',
            pointBorderColor: 'red',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointBorderColor: 'black',
            pointHitRadius: 10,
            backgroundColor: gradientLine,
            borderColor: gradientLine,
            borderWidth: 9,
            data: mapValues
        }]
    },
    options: {
      barRoundness: 1,
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


/* 
  --------------------
  Rounded Bar chart
  @author https://codepen.io/jordanwillis/pen/jBoppb
  --------------------
  */
// draws a rectangle with a rounded top
Chart.helpers.drawRoundedTopRectangle = function(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  // top right corner
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  // bottom right	corner
  ctx.lineTo(x + width, y + height);
  // bottom left corner
  ctx.lineTo(x, y + height);
  // top left	
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
  draw: function() {
    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped;
    var borderWidth = vm.borderWidth;

    if (!vm.horizontal) {
      // bar
      left = vm.x - vm.width / 2;
      right = vm.x + vm.width / 2;
      top = vm.y;
      bottom = vm.base;
      signX = 1;
      signY = bottom > top? 1: -1;
      borderSkipped = vm.borderSkipped || 'bottom';
    } else {
      // horizontal bar
      left = vm.base;
      right = vm.x;
      top = vm.y - vm.height / 2;
      bottom = vm.y + vm.height / 2;
      signX = right > left? 1: -1;
      signY = 1;
      borderSkipped = vm.borderSkipped || 'left';
    }

    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
      // borderWidth shold be less than bar width and bar height.
      var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
      borderWidth = borderWidth > barSize? barSize: borderWidth;
      var halfStroke = borderWidth / 2;
      // Adjust borderWidth when bar top position is near vm.base(zero).
      var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
      var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
      var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
      var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
      // not become a vertical line?
      if (borderLeft !== borderRight) {
        top = borderTop;
        bottom = borderBottom;
      }
      // not become a horizontal line?
      if (borderTop !== borderBottom) {
        left = borderLeft;
        right = borderRight;
      }
    }

    // calculate the bar width and roundess
    var barWidth = Math.abs(left - right);
    var roundness = this._chart.config.options.barRoundness || 0.5;
    var radius = barWidth * roundness * 0.5;
    
    // keep track of the original top of the bar
    var prevTop = top;
    
    // move the top down so there is room to draw the rounded top
    top = prevTop + radius;
    var barRadius = top - prevTop;

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    // draw the rounded top rectangle
    Chart.helpers.drawRoundedTopRectangle(ctx, left, (top - barRadius + 1), barWidth, bottom - prevTop, barRadius);

    ctx.fill();
    if (borderWidth) {
      ctx.stroke();
    }

    // restore the original top value so tooltips and scales still work
    top = prevTop;
  },
});

Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

Chart.controllers.roundedBar = Chart.controllers.bar.extend({
  dataElementType: Chart.elements.RoundedTopRectangle
});
