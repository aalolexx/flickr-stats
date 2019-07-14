export class DataAnalyser {
  constructor (photos) {
    this.photos = photos
  }

  /* 
  --------------------
  The methods for the rankings of exif properties
  --------------------
  */
  getLenseRanking () {
    let lensesExifArray = this.getExifArray('LensModel')
    return this.getExifItemOccurensesMap(lensesExifArray)
  }

  getCameraModelRanking () {
    let modelExifArray = this.getExifArray('Make')
    return this.getExifItemOccurensesMap(modelExifArray)
  }

  getCameraMakeRanking () {
    let makeExifArray = this.getExifArray('Model')
    return this.getExifItemOccurensesMap(makeExifArray)
  }

  getIsoRanking () {
    let isoExifArray = this.getExifArray('ISO')
    return this.getExifItemOccurensesMap(isoExifArray)
  }

  getExposureTimeRanking () {
    let exposureExifArray = this.getExifArray('ExposureTime')
    return this.getExifItemOccurensesMap(exposureExifArray)
  }

  getFNumberRanking () {
    let fNumberExifArray = this.getExifArray('FNumber')
    return this.getExifItemOccurensesMap(fNumberExifArray)
  }

  getFocalLengthRanking () {
    let focalLengthExifArray = this.getExifArray('FocalLength')
    return this.getExifItemOccurensesMap(focalLengthExifArray)
  }

  /* 
  --------------------
  Util Methods
  --------------------
  */
  getExifArray (propKey) {
    let exifArray = []
    for (let photo of this.photos) {
      exifArray.push(
        this.getExifByTag(photo.photo.exif, propKey)
      )
    }
    return exifArray
  }

  getExifByTag(exifArray, tagValue) {
    return exifArray.find(obj => obj.tag == tagValue);
  } 

  getExifItemOccurensesMap (exifArray) {
    let itemArray = []
    for (let exifItem of exifArray) {
      if (exifItem) {
        itemArray.push(exifItem.raw._content)
      }
    }
    let rankingMap = new Map([...new Set(itemArray)].map(
      x => [x, itemArray.filter(y => y === x).length]
    ));
    return new Map([...rankingMap.entries()].sort((a, b) => b[1] - a[1]));
  }

}