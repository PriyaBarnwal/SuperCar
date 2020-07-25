const startScreen = document.querySelector('.startscreen'),
  gamescreen = document.querySelector('.gamescreen'),
  gamearea = document.querySelector('.gameArea'),
  scoreArea = document.querySelector('.score'),
  gameOver = document.querySelector('.gameOver')

let keys = {},
  player = {},
  speed = 5,
  //colors = ["red", "green", "pink", "blue", "yellow"],
  enemies = {}

moveRoadDown = () => {
  let lines = document.querySelectorAll('.line')
  lines.forEach(line => {
    if(line.y>=750)
      line.y -= 750
    line.y = (line.y + speed)
    line.style.top = line.y +'px'
  })
}

isCollision = (item1, item2) => {
  let one = item1.getBoundingClientRect(),
    two = item2.getBoundingClientRect()
    if(!(
      (one.bottom < two.top) || (one.top > two.bottom) || (one.right < two.left) || (one.left >= two.right)))
      console.log(one, two)
  return !(
    (one.bottom < two.top) || (one.top > two.bottom) || (one.right-5 < two.left) || (one.left >= two.right))

}

function moveEnemy(car) {
  let ele = document.querySelectorAll(".enemy")
  ele.forEach(function (item, index) {
      if (isCollision(car, item)) {
        endGame()
      }
      if (item.y >= 650) {
        item.y = -650
        let found, temp
        do {
          found = true
          temp = Math.floor(Math.random() * 450)
          delete enemies.index
          Object.values(enemies).forEach(enemy => {
            if(temp>=enemy[0] && temp<=enemy[1]) {
              found = false
            }
          })
        } while(found === false)
        item.style.left = temp + "px"
        enemies[index] =[temp-51,temp+51]

        //item.style.backgroundColor = colors[Math.floor(Math.random()*5)]
      }
      item.y += speed
      item.style.top = item.y + "px"
  })
}

step = (timestamp) => {
  let car = document.querySelector(".car")
  let road = gamearea.getBoundingClientRect()
  moveEnemy(car)
  moveRoadDown()
  
  if(player.start) {
    if (keys.ArrowUp && player.y>-630) {
      player.y -= speed
    }
    if (keys.ArrowDown && player.y < (road.bottom-125)) {
      player.y += speed
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= speed
    }
    if (keys.ArrowRight && player.x < (road.width - 60)) {
      player.x += speed
    }

    car.style.left = player.x +'px'
    car.style.top = player.y +'px'
    player.score+=1
    scoreArea.innerHTML = `SCORE: ${player.score}`
    window.requestAnimationFrame(step)
  }
  
}

pressOn = (e) => {
  e.preventDefault()
  keys[e.key] = true
}

pressOff = (e) => {
  e.preventDefault()
  keys[e.key] = false
}

initialise = () => {
  gamearea.innerHTML = ''
  keys['ArrowUp'] = false
  keys['ArrowDown'] = false
  keys['ArrowLeft'] = false
  keys['ArrowRight'] = false
  player['start'] = true
  player['score'] = 0
  enemies={}
}

pauseGame = () => {
  player.start = !player.start
  if (player.start) {
    window.requestAnimationFrame(step)
    document.querySelector('.pause-game').textContent = 'PAUSE'
  } else 
    document.querySelector('.pause-game').textContent = 'RESUME'
}

endGame = () => {
  player.start = false
  gameOver.classList.remove('hide')
}

startGame = () => {
  this.initialise()

  gamescreen.classList.remove('hide')
  gameOver.classList.add('hide')
  startScreen.classList.add('hide')

  document.addEventListener('keydown', this.pressOn)
  document.addEventListener('keyup', this.pressOff)

  for(let index=0; index<5; index++) {
    let x = document.createElement("div")
    x.classList.add('line')
    x.style.top = (index*150) +'px'
    x.y = (index*150)
    gamearea.appendChild(x)
  }

  let car = document.createElement("div")
  car.setAttribute("class", "car")
  gamearea.appendChild(car)
  player.x = car.offsetLeft
  player.y = car.offsetTop

  for (let x = 0; x < 4; x++) {
    let enemy = document.createElement("div"),
      found,temp
    enemy.classList.add("enemy")
    enemy.y = Math.floor(Math.random()*700)
    enemy.style.top = enemy.y + "px"
    do {
      found = true
      temp = Math.floor(Math.random() * 450)
      Object.values(enemies).forEach(enemy => {
        if(temp>=enemy[0] &&temp<=enemy[1]) {
          found = false
        }
      })
    } while(found === false)
    enemy.style.left = temp + "px"
    enemies[x] = [temp-50,temp+50]
    //enemy.style.backgroundColor = colors[Math.floor(Math.random()*5)]
    gamearea.appendChild(enemy)
  }

  window.requestAnimationFrame(step)
}

document.querySelector('.start-game').addEventListener('click', this.startGame)
document.querySelector('.restart-game').addEventListener('click', this.startGame)
document.querySelector('.pause-game').addEventListener('click', this.pauseGame)