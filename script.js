const urlParams = new URLSearchParams(window.location.search)
const windowId = parseInt(urlParams.get('id'))

if (
  !localStorage.getItem('maxWindowId') ||
  localStorage.getItem('maxWindowId') < windowId
) {
  localStorage.setItem('maxWindowId', windowId)
}

if (!windowId && windowId != 0) {
  throw new Error('Missing window Id')
}

setInterval(function () {
  updateLocationInLocalStorage()
  // document.querySelector('.currentWindowInfo').innerHTML = JSON.stringify(
  //   getCurrentWindowLocationFromLocalStorage()
  // )
  // document.querySelector('.otherWindowInfo').innerHTML = JSON.stringify(
  //   getOtherWindowLocationsFromLocalStorage()
  // )
  // createDivAtCenter(windowId)
  drawMiniMap()
  drawLineToNextWindowCenter()
  drawLineToPreviousWindowCenter()
}, 50)

function updateLocationInLocalStorage() {
  const location = {
    screenX: window.screenX,
    screenY: window.screenY,
    screenWidth: window.screen.availWidth,
    screenHeight: window.screen.availHeight,
    width: window.outerWidth,
    height: window.innerHeight,
    windowId: windowId,
  }
  localStorage.setItem(`location_${windowId}`, JSON.stringify(location))
}

function getOtherWindowLocationsFromLocalStorage() {
  const windows = []
  for (let i = 0; i <= localStorage.getItem('maxWindowId'); i++) {
    if (i == windowId) continue
    windows.push(JSON.parse(localStorage.getItem(`location_${i}`)))
  }
  return windows
}

function getCurrentWindowLocationFromLocalStorage() {
  return JSON.parse(localStorage.getItem(`location_${windowId}`))
}

function getNextWindowLocationFromLocalStorage() {
  if (!localStorage.getItem(`location_${windowId + 1}`)) {
    return JSON.parse(localStorage.getItem('location_0'))
  }
  return JSON.parse(localStorage.getItem(`location_${windowId + 1}`))
}

function getPreviousWindowLocationFromLocalStorage() {
  if (!localStorage.getItem(`location_${windowId - 1}`)) {
    return JSON.parse(
      localStorage.getItem(`location_${localStorage.getItem('maxWindowId')}`)
    )
  }
  return JSON.parse(localStorage.getItem(`location_${windowId - 1}`))
}

function getScreenCenter(id) {
  const location = JSON.parse(localStorage.getItem(`location_${id}`))
  return {
    x: location.width / 2,
    y: location.height / 2,
  }
}

function createDivAtCenter(id) {
  if (document.querySelector('#centerDiv')) {
    document.querySelector('#centerDiv').remove()
  }
  const div = document.createElement('div')
  div.id = 'centerDiv'
  div.setAttribute(
    'style',
    `position: fixed; background-color: red; width: 10px; height: 10px; top: ${
      getScreenCenter(id).y
    }px; left: ${getScreenCenter(id).x}px`
  )
  document.body.appendChild(div)
}

function drawMiniMap() {
  if (document.querySelector('#miniMap')) {
    document.querySelector('#miniMap').remove()
  }
  const container = document.createElement('div')
  container.id = 'miniMap'
  container.style.width = `${
    getCurrentWindowLocationFromLocalStorage().screenWidth / 10
  }px`
  container.style.height = `${
    getCurrentWindowLocationFromLocalStorage().screenHeight / 10
  }px`
  container.style.backgroundColor = 'black'
  container.style.position = 'fixed'
  container.style.bottom = '5px'
  container.style.right = '5px'
  document.body.appendChild(container)

  const otherWindowLocations = getOtherWindowLocationsFromLocalStorage()
  const currentWindowLocation = getCurrentWindowLocationFromLocalStorage()

  const currentWindowDiv = document.createElement('div')
  currentWindowDiv.style.width = `${currentWindowLocation.width / 10}px`
  currentWindowDiv.style.height = `${currentWindowLocation.height / 10}px`
  currentWindowDiv.style.position = 'absolute'
  currentWindowDiv.style.top = `${currentWindowLocation.screenY / 10}px`
  currentWindowDiv.style.left = `${currentWindowLocation.screenX / 10}px`
  currentWindowDiv.style.backgroundColor = 'rgb(255, 0, 144)'
  currentWindowDiv.style.border = '2px solid white'
  currentWindowDiv.style.zIndex = '1'
  currentWindowDiv.innerHTML = windowId
  container.appendChild(currentWindowDiv)

  for (const otherWindowLocation of otherWindowLocations) {
    const otherWindowDiv = document.createElement('div')
    otherWindowDiv.style.width = `${otherWindowLocation.width / 10}px`
    otherWindowDiv.style.height = `${otherWindowLocation.height / 10}px`
    otherWindowDiv.style.position = 'absolute'
    otherWindowDiv.style.top = `${otherWindowLocation.screenY / 10}px`
    otherWindowDiv.style.left = `${otherWindowLocation.screenX / 10}px`
    otherWindowDiv.style.backgroundColor = 'cyan'
    otherWindowDiv.style.border = '2px solid white'
    otherWindowDiv.innerHTML = otherWindowLocation.windowId
    container.appendChild(otherWindowDiv)
  }
}

function drawLineToNextWindowCenter() {
  if (document.querySelector('#lineToNextWindowCenter')) {
    document.querySelector('#lineToNextWindowCenter').remove()
  }
  const currentWindowLocation = getCurrentWindowLocationFromLocalStorage()
  const nextWindowLocation = getNextWindowLocationFromLocalStorage()

  let secondCoord
  if (!localStorage.getItem(`location_${windowId + 1}`)) {
    secondCoord = {
      x2:
        getScreenCenter(0).x +
        nextWindowLocation.screenX -
        currentWindowLocation.screenX,
      y2:
        getScreenCenter(0).y +
        nextWindowLocation.screenY -
        currentWindowLocation.screenY,
    }
  } else {
    secondCoord = {
      x2:
        getScreenCenter(windowId + 1).x +
        nextWindowLocation.screenX -
        currentWindowLocation.screenX,
      y2:
        getScreenCenter(windowId + 1).y +
        nextWindowLocation.screenY -
        currentWindowLocation.screenY,
    }
  }

  const line = getLine(
    { x1: getScreenCenter(windowId).x, y1: getScreenCenter(windowId).y },
    secondCoord
  )
  const div = document.createElement('div')
  div.id = 'lineToNextWindowCenter'
  div.style.height = '2px'
  div.style.width = `${line.length}px`
  div.style.backgroundColor = 'blue'
  div.style.position = 'fixed'
  div.style.top = `${line.top}px`
  div.style.left = `${line.left}px`
  div.style.transform = `rotate(${line.angle * -1}deg)`
  div.style.transformOrigin = '0% 0%'
  document.body.appendChild(div)
}

function drawLineToPreviousWindowCenter() {
  if (document.querySelector('#lineToPreviousWindowCenter')) {
    document.querySelector('#lineToPreviousWindowCenter').remove()
  }
  const currentWindowLocation = getCurrentWindowLocationFromLocalStorage()
  const previousWindowLocation = getPreviousWindowLocationFromLocalStorage()

  let secondCoord
  if (!localStorage.getItem(`location_${windowId - 1}`)) {
    secondCoord = {
      x2:
        getScreenCenter(localStorage.getItem('maxWindowId')).x +
        previousWindowLocation.screenX -
        currentWindowLocation.screenX,
      y2:
        getScreenCenter(localStorage.getItem('maxWindowId')).y +
        previousWindowLocation.screenY -
        currentWindowLocation.screenY,
    }
  } else {
    secondCoord = {
      x2:
        getScreenCenter(windowId - 1).x +
        previousWindowLocation.screenX -
        currentWindowLocation.screenX,
      y2:
        getScreenCenter(windowId - 1).y +
        previousWindowLocation.screenY -
        currentWindowLocation.screenY,
    }
  }
  const line = getLine(
    { x1: getScreenCenter(windowId).x, y1: getScreenCenter(windowId).y },
    secondCoord
  )
  const div = document.createElement('div')
  div.id = 'lineToPreviousWindowCenter'
  div.style.height = '2px'
  div.style.width = `${line.length}px`
  div.style.backgroundColor = 'blue'
  div.style.position = 'fixed'
  div.style.top = `${line.top}px`
  div.style.left = `${line.left}px`
  div.style.transform = `rotate(${line.angle * -1}deg)`
  div.style.transformOrigin = '0% 0%'
  document.body.appendChild(div)
}

function getLine({ x1, y1 }, { x2, y2 }) {
  if (x2 < x1) {
    let tmp
    tmp = x2
    x2 = x1
    x1 = tmp
    tmp = y2
    y2 = y1
    y1 = tmp
  }
  return {
    angle: (Math.atan((y1 - y2) / (x2 - x1)) * 180) / Math.PI,
    length: Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)),
    top: y1,
    left: x1,
  }
}

function reload() {
  localStorage.clear()
  location.reload()
}
