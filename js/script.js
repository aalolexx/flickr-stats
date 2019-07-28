import { getUrlParameter, getUserId } from './utils.js'
import { getUserPhotos, getPhotoExif, getUserInfo } from './restClient.js'
import { DataAnalyser } from './dataAnalyser.js'
import { updateLoadingBar, showSummary, showUserHeader, showRankingProgressElement, showRankingLineChartElement } from './ui.js'

let photos = []
let user

async function initAnalysis() {
  let userId = getUserId()

  if (!userId) {
    return
  }

  await processUser(userId)

  await processPhotos(userId)
  renderPhotoData()

  $('.loading-container').addClass('hidden')
  $('.header').toggleClass('align-center', 'align-left')
  $('.container').removeClass('hidden')
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
    if (i > 10) break 
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

$(document).ready(function() {
  initAnalysis()
})