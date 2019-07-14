import { getUrlParameter, getUserId } from './utils.js'
import { getUserPhotos, getPhotoExif, getUserInfo } from './restClient.js'
import { DataAnalyser } from './dataAnalyser.js'

let photos = []
let user

async function initAnalysis() {
  let userId = getUserId()

  await processUser(userId)

  await processPhotos(userId)
  renderPhotoData()
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
    i++;
    console.log(`get photo ${i} / ${photosResponse.photos.photo.length}`)
    let enrichedPhoto = await getPhotoExif(photo.id)
    photos.push(enrichedPhoto)
  }

  console.log(photos)
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
  console.log('lense:')
  console.log(dataHouse.getLenseRanking())
  console.log('camera model:')
  console.log(dataHouse.getCameraModelRanking())
  console.log('camera brand:')
  console.log(dataHouse.getCameraMakeRanking())
  console.log('iso:')
  console.log(dataHouse.getIsoRanking())
  console.log('exposure time:')
  console.log(dataHouse.getExposureTimeRanking())
  console.log('f number:')
  console.log(dataHouse.getFNumberRanking())
  console.log('focal length:')
  console.log(dataHouse.getFocalLengthRanking())
}

initAnalysis()