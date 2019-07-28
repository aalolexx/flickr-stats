import { getUrlParameter, getUserId, setUserId } from './utils.js'
import { getUserPhotos, getPhotoExif, getUserInfo, getUserIdByUsername } from './restClient.js'
import { DataAnalyser } from './dataAnalyser.js'
import { updateLoadingBar, showSummary, showUserHeader, showRankingProgressElement, showRankingLineChartElement } from './ui.js'

let photos = []
let user

$(document).ready(function() {
  $('.js-email-button').click(function() {
    processUserSearch($('.js-username-input').val())
  })

  if (getUserId()) {
    initAnalysis()
  }
})

async function processUserSearch(username) {
  let response = await getUserIdByUsername(username)
  console.log(response)
  if (response.stat == 'fail') {
    alert('no user found with the name "' + username + '"')
  } else {
    setUserId(response.user.id)
    initAnalysis()
  }
}

async function initAnalysis() {
  let userId = getUserId()

  if (!userId) {
    return
  }

  await processUser(userId)

  $('.js-start-section').addClass('hidden')
  $('.loading-container').removeClass('hidden')

  await processPhotos(userId)

  if (photos.length > 0) {
    renderPhotoData()

    $('.loading-container').addClass('hidden')
    $('.header').toggleClass('align-center', 'align-left')
    $('.js-main-section').removeClass('hidden')
  } else {
    $('.loading-container').addClass('hidden')
    $('.js-start-section').removeClass('hidden')
    alert('Sorry! We couldn\'t get the photos of the requested user.')
  }
}

/* 
--------------------
Processing Methods
--------------------
*/
async function processPhotos (userId) {
  let photosResponse = await getUserPhotos(userId)

  // Loop trough all photos and add exif data to them
  let i = 0; 
  for (let photo of photosResponse.photos.photo) {
    i++
    updateLoadingBar(i, photosResponse.photos.photo.length)
    let enrichedPhoto = await getPhotoExif(photo.id)
    photos.push(enrichedPhoto)
  }
}

async function processUser (userId) {
  let userResponse = await getUserInfo(userId)
  user = userResponse.person
}


/* 
--------------------
Render Methods
--------------------
*/
function renderPhotoData () {
  // Create the data analyser object
  let dataHouse = new DataAnalyser(photos)

  showUserHeader(
    user.realname ? user.realname._content : undefined,
    user.username ? user.username._content : undefined 
  )

  showSummary(
    user.realname ? user.realname._content : user.username._content,
    dataHouse.getCameraMakeRanking().keys().next().value,
    dataHouse.getLenseRanking().keys().next().value,
    dataHouse.getFNumberRanking().keys().next().value,
    dataHouse.getIsoRanking().keys().next().value,
    dataHouse.getExposureTimeRanking().keys().next().value,
  )

  showRankingProgressElement(
    '.js-camera-model-ranking',
    dataHouse.getCameraMakeRanking()
  )

  showRankingProgressElement(
    '.js-lense-ranking',
    dataHouse.getLenseRanking()
  )

  showRankingLineChartElement(
    '.js-fnumber-ranking',
    dataHouse.getFNumberRanking(),
    'F'
  )

  showRankingLineChartElement(
    '.js-iso-ranking',
    dataHouse.getIsoRanking(),
    'ISO'
  )

  showRankingLineChartElement(
    '.js-exposure-time-ranking',
    dataHouse.getExposureTimeRanking(),
    's'
  )

  //console.log(user)
  
  //console.log('lense:')
  //console.log(dataHouse.getLenseRanking())
  //console.log('camera model:')
  //console.log(dataHouse.getCameraModelRanking())
  //console.log('camera brand:')
  //console.log(dataHouse.getCameraMakeRanking())
  //console.log('iso:')
  //console.log(dataHouse.getIsoRanking())
  //console.log('exposure time:')
  //console.log(dataHouse.getExposureTimeRanking())
  //console.log('f number:')
  //console.log(dataHouse.getFNumberRanking())
  //console.log('focal length:')
  //console.log(dataHouse.getFocalLengthRanking())
}

//$(document).ready(function() {
//  initAnalysis()
//})