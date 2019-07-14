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