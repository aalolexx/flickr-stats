let baseURL = 'https://www.flickr.com/services/rest/'
let apiKey = 'a3588357c6660231416ee25fe9db3984'

/**
 * Get Response from a url
 * @param {*} method 
 * @param {*} params 
 */
async function getFromURL (method, params) {
  let url = baseURL
  url += '?method=' + method
  url += '&api_key=' + apiKey
  
  for (let param of params) {
    url += '&' + param.key + '=' + param.value
  }

  url += '&format=json&nojsoncallback=?'
  
  return await $.ajax(url)
}

/**
 * Get EXIF data of a photo
 * @param {*} photoId 
 */
export async function getPhotoExif(photoId) {
  return await getFromURL('flickr.photos.getExif', [{
    key: 'photo_id',
    value: photoId
  }])
}


/**
 * Get all Photos of a Flickr user
 * @param {*} userId 
 */
export async function getUserPhotos(userId) {
  return await getFromURL('flickr.people.getPhotos', [{
    key: 'user_id',
    value: userId
  }])
}