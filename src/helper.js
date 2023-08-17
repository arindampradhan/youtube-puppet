export const hasVideoId = (url) => {
  return new URL(url).searchParams.get('v') !== 'undefined'
}