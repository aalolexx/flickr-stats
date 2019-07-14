import { getUserPhotos, getPhotoExif } from './restClient.js'
import { DataAnalyser } from './dataAnalyser.js'


async function initAnalysis() {
  let photosResponse = await getUserPhotos('144541346@N03')
  let photos = []

  // Loop trough all photos and add exif data to them
  let i = 0;
  for (let photo of photosResponse.photos.photo) {
    i++;
    console.log(`get photo ${i} / ${photosResponse.photos.photo.length}`)
    let enrichedPhoto = await getPhotoExif(photo.id)
    photos.push(enrichedPhoto)
  }

  console.log(photos)

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