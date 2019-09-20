/**
 * Restituisce il volere del csrf token
 * @return {string} Il token
 */
export function csrf(): string {
  return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

/**
 * Restituisce un ogetto di tipo FormData a partire dal JSON passato come parametro
 * @param {JSON} object 
 * @return {FormData}
 */
export function objectToFormData(object) {
  let formData = new FormData();
  const keys = Object.keys(object);
  for(const key of keys) {
    formData.append(key, object[key]);
  }
  return formData;
}

/**
 * Restituisce l'url sanitized
 * @param {string} url
 * @return {string}
 */
export function sanitizeUrl(url: string): string {
  if(url.charAt(url.length - 1) === '/') {
    return url.slice(0, -1);
  }
  
  return url;
}