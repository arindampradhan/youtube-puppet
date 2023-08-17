export const hasVideoId = (url) => {
  return new URL(url).searchParams.get('v') !== 'undefined'
}

export function sleep(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
