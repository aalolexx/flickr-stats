/**
 * Get Url Parameter
 * @param {*} sParam 
 */
export function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
  }
};

/**
 * Get the user id (set in url param)
 */
export function getUserId () {
  // testing user id: '144541346@N03'
  return getUrlParameter('user_id')
}

/**
 * Set the user id in the url as a param
 * @param {*} userId 
 */
export function setUserId (userId) {
  let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?user_id=' + userId
  window.history.pushState({ path: newUrl }, '', newUrl);
}