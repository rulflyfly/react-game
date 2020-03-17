import React, { Component } from 'react';

export default class App extends Component {
  canvasWidth = 500
  canvasHeight =  500

  state = {

    paddle: {
      x: this.canvasWidth/2 - 50,
      y: this.canvasHeight,
      width: 100,
      height: 10,
      speed: 5,
      move_left: false,
      move_right: false
    },
    gameState: {
      SCORE: 0,
      LIVES: 3,
      START: true,
      PAUSE: false,
      LOSE: false,
      WIN: false
    },
    rects: [{
      size: 50,
      speed: 1,
      color: 'lightblue',
      x: this.canvasWidth /2 - 75,
      y: 0
  }],
 
  
  
  levels: {
    LEVEL_1: true,
    LEVEL_2: false,
    LEVEL_3: false,
    LEVEL_4: false,
    LEVEL_5: false, 
  },
  littleRects: [],
  bigRects: [],
  bonusRects: [],
  rectTypes: {
    SMALL_RECT: {
        size: 30,
        speed: 2
    },
    RECT: {
        size: 50,
    },
    BIG_RECT: {
        id: 3,
        size: 80,
        hit: 0,
        move_rect: 20
    },
    BONUS_RECT: {
        id: 4,
        size: 40,
        speed: 3,
        color: 'transparent'
    },
    BOSS_RECT: {
        killer: true,
        id: 5,
        size: 150,
        speed: 0.5,
        hit: 0,
        move_rect: 5,
        x: (this.canvasWidth / 2 - 75),
        y: 0,
        color: `rgb(${Math.floor(Math.random()*255)}, 
                ${Math.floor(Math.random()*255)}, 
                ${Math.floor(Math.random()*255)})`,
    }
}
  }

getType = () => {
  let {LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5} = this.state.levels
  const {SCORE} = this.state.gameState
  const {RECT, SMALL_RECT, BIG_RECT, BONUS_RECT, BOSS_RECT} = this.state.rectTypes

  LEVEL_1 = SCORE < 50 ? true : false
  LEVEL_2 = SCORE < 150 && SCORE >= 50 ? true : false
  LEVEL_3 = SCORE < 300 && SCORE >= 150 ? true : false
  LEVEL_4 = SCORE < 500 && SCORE >= 300 ? true : false
  LEVEL_5 = SCORE >= 500 ? true : false

  this.setState(({levels}) => {
    levels.LEVEL_1 = LEVEL_1
    levels.LEVEL_2 = LEVEL_2 
    levels.LEVEL_3 = LEVEL_3
    levels.LEVEL_4 = LEVEL_4
    levels.LEVEL_5 = LEVEL_5

    return {
      levels
    }
  })
		const num = Math.random()
		if (LEVEL_1) {
			return RECT
		} else if (LEVEL_2) {
			if (num <= 0.5) return RECT;
			else if (num <=9) return SMALL_RECT;
			else if (num <= 0.97) return BIG_RECT;
			else return BONUS_RECT
		} else if (LEVEL_3) {
			if (num <= 0.5) return BIG_RECT;
			if (num <= 0.9) return SMALL_RECT;
			else if (num <= 0.97) return RECT;
			else return BONUS_RECT
		} else if (LEVEL_4) {
			if (num <= 0.97) return BIG_RECT;
			else return BONUS_RECT;
		} else if (LEVEL_5) {
			return BOSS_RECT
		}
	}
 
  getRectArrays = () => {
    const littleRects = []
    const bigRects = []
    const bonusRects = []

    for (let i = 0; i < 10; i++) {
      littleRects.push({
          killer: true,
          x: Math.floor(Math.random()*(this.canvasWidth - 90))  + 15,
          y: Math.floor(Math.random()* 40),
          size: 30,
          speed: 2,
          color: `rgb(${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)})`
      })
  }
  
  for (let i = 0; i < 5; i++) {
      bigRects.push({
          killer: true,
          x: Math.floor(Math.random()*(this.canvasWidth - 90))  + 15,
          y: Math.floor(Math.random()* 40),
          speed: 1,
          id: 3,
          size: 80,
          hit: 0,
          move_rect: 20,
          color: `rgb(${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)})`
      })
  }
  
  for (let i = 0; i < 100; i++) {
      bonusRects.push({
          x: Math.floor(Math.random()*(this.canvasWidth - 90))  + 15,
          y: Math.floor(Math.random()* this.canvasWidth/3),
          size: 10,
          speed: 0,
          color: 'transparent',
          id: 4
      })
  }
  this.setState({littleRects, bigRects, bonusRects})
  }

  launchReсts = () => {
    const {SCORE} = this.state.gameState
    const {LEVEL_5} = this.state.levels
    const rects = this.state.rects

    let randomInterval = Math.floor((Math.random() + 0.8) * 
                2 *(1500 / ( SCORE + 1) )) + 
                              (600  / ((SCORE + 1)/300 > 1 ? (SCORE + 1)/300 : 1));
                              
      if (LEVEL_5) {
          randomInterval = 120000
      }
  
      const rectBase = {
          x: Math.floor(Math.random()*(this.canvasWidth - 90))  + 15,
          y: 0,
          color: `rgb(${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)}, 
                  ${Math.floor(Math.random()*255)})`,
          speed: 1
      }
      this.timer = setTimeout(()=>{
      const type = this.getType()
          rects.push(Object.assign(rectBase, type))
          this.setState({rects})
          this.launchReсts()
      }, randomInterval)
  }
  

  drawPaddle = (ctx) => { 
    const paddle = this.state.paddle
    ctx.fillStyle = 'pink'
    ctx.fillRect(paddle.x, paddle.y - paddle.height, paddle.width, paddle.height)
    ctx.closePath()

    if (!this.state.gameState.PAUSE) {
        if (paddle.move_left && paddle.x > 5) {
        paddle.speed = 5
        paddle.x-=paddle.speed
    } else if (paddle.move_right && paddle.x !== this.canvasWidth - paddle.width - 5) {
        paddle.speed = 5
        paddle.x+=paddle.speed
    } else {
        paddle.speed = 0
    }
    }

    this.setState({paddle})
}

drawRects = (ctx) => {
  const rects = this.state.rects
  const {PAUSE} = this.state.gameState
    rects.forEach((rect, i) => {
        ctx.fillStyle = rect.color

        if (rect.id && rect.id === 3 && rect.hit === 1) {
            ctx.fillRect(rect.x + rect.move_rect, rect.y + rect.move_rect, rect.size, rect.size)
        } else if (rect.id && rect.id === 5 && rect.hit > 0) { 
            
            ctx.fillRect(rect.x + rect.move_rect, rect.y + rect.move_rect, rect.size, rect.size)
        } else {
            ctx.fillRect(rect.x, rect.y, rect.size, rect.size)
        }
        ctx.closePath()
        if (!PAUSE) {
            rect.y+=rect.speed
        }
        if (rect.id && rect.id === 4 && rect.y > this.canvasWidth - rect.size) {
            rects.splice(i, 1)
        }
        if (rect.y > this.canvasWidth - rect.size) {
			if (rect.killer) {
                rects.splice(i, 1)
                this.setState(({gameState}) => {
                  gameState.LIVES = 0
                  gameState.LOSE = true 
                  return {
                    gameState
                  }
                })
            } else {
                rects.splice(i, 1)
                this.setState(({gameState}) => {
                  gameState.LIVES--
                  return {
                    gameState
                  }
                })
            }
            if (this.state.gameState.LIVES < 0) {
                this.setState(({gameState}) => {
                  gameState.LOSE = true
                  return {
                    gameState
                  }
                })
            }
        }
    })
    this.setState({rects})
}

 drawBullet = (ctx) => {
   const bullets = [...this.state.bullets];
   const {PAUSE} = this.state.gameState
    bullets.forEach(bullet => {
        ctx.fillStyle = 'pink'
        ctx.arc(bullet.x + 10, bullet.y - bullet.width, bullet.width/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.fill();
        ctx.restore();
        

        if (bullet.fired === true && !PAUSE) {
            bullet.y -= bullet.speed
        } else if (PAUSE) {
          bullet.y = bullet.y
        } else {
            bullet.x = this.state.paddle.x + 40
        }
    })
    this.setState({bullets})
}

  hitRect  = () => {
    const rects = [...this.state.rects]
    const bullets = [...this.state.bullets]

    for (let i = 0; i < rects.length; i ++) {
        for (let j = 0; j < bullets.length; j++) {
            if (rects[i] && bullets[j] && bullets[j].fired &&  
                bullets[j].y < rects[i].y+rects[i].size && 
                bullets[j].x + 20 > rects[i].x + (rects[i].move_rect ? rects[i].move_rect : 0) && 
                bullets[j].x+bullets[j].width - 20 <rects[i].x + +rects[i].size + (rects[i].move_rect ? rects[i].move_rect : 0) && 
                bullets[j].y !== 0 && 
                bullets[j].y + bullets[j].width > rects[i].y) {

                    if (rects[i].id && rects[i].id === 3) {
                        rects[i].size = 40
                        rects[i].hit++
                        this.setState(({gameState}) => {
                          gameState.SCORE++ 
                          return {
                            gameState
                          }
                        })
                        bullets.splice(j, 1)
                        if (rects[i].hit === 2) {
                            rects.splice(i, 1)
                        }
                    } else if (rects[i].id && rects[i].id === 5) {
                        let addToMove = rects[i].move_rect
                        let substractSize = rects[i].size

                        if (rects[i].hit < 5) {
                            if (rects[i].hit > 0) {
                                
                            rects[i].move_rect = addToMove + 5
                            addToMove = rects[i].move_rect
                            }
                            
                            rects[i].size = substractSize - 10
                            substractSize = rects[i].size
                            rects[i].hit++
                            this.setState(({gameState}) => {
                              gameState.SCORE++ 
                              return {
                                gameState
                              }
                            })
                        }

						                bullets.splice(j, 1)
                        
                        if (rects[i].hit === 5 ) {
                            rects[i].speed = 0.3
                            rects[i].hit = 6
							              rects.push(...this.state.bigRects)
                        } 

                        if (rects[i].hit >= 6 &&  rects.length === 1) {
                            rects[i].move_rect = addToMove + 5
                            addToMove = rects[i].move_rect
                            rects[i].size = substractSize - 10
                            substractSize = rects[i].size
                            rects[i].hit++
                            this.setState(({gameState}) => {
                              gameState.SCORE++ 
                              return {
                                gameState
                              }
                            })
                        }

                        if (rects[i].hit === 10 ) {
                            rects[i].speed = 0.2
                            rects[i].hit = 11
                            rects.push(...this.state.littleRects)
                        }

                        if (rects[i].size === 0) {
                            rects.splice(i, 1)
                            this.endGame()
                        }
                    } else if (rects[i].id && rects[i].id === 4) {
                        this.setState(({gameState}) => {
                          gameState.LIVES++
                          return {
                            gameState
                          }
                        })
                        rects.splice(i, 1)
						            bullets.splice(j, 1)
                    } else {
                        rects.splice(i, 1)
                        bullets.splice(j, 1)
                        this.setState(({gameState}) => {
                          gameState.SCORE++ 
                          return {
                            gameState
                          }
                        })
                    }
                    this.setState({rects, bullets})
                }
        }
    }
}


  drawBonusRect = (ctx) => {
    const rects = this.state.rects

    rects.forEach(rect => {
        if (rect.id && rect.id === 4) {
            ctx.fillStyle = `rgb(${Math.floor(Math.random()*255)}, 
                            ${Math.floor(Math.random()*255)}, 
                            ${Math.floor(Math.random()*255)})`
            ctx.fillRect(rect.x, rect.y, rect.size, rect.size)
            ctx.closePath()
        }
    })
}

  endGame = () => {
    clearTimeout(this.timer);
    this.setState(({gameState}) => {
      gameState.WIN = true;
      return {
        gameState
      }
    })
}

  onWin = (ctx) => {

    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("YOU WON", this.canvasWidth / 2, this.canvasHeight / 2);

    this.setState(({rects}) => {
      rects.push(...this.state.bonusRects)
      return {
        rects
      }
    })
    
}

  onPause = (ctx) => {
    
    let grd = ctx.createRadialGradient(250, 250, 100, 250, 250, 250);
    grd.addColorStop(0, 'rgba(255, 192, 203, 0.5)');
    grd.addColorStop(1, 'rgba(255, 192, 203, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("PLAY", this.canvasWidth / 2 + 5, this.canvasHeight/ 2 +20);
}

  onLose = (ctx) => {

    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("YOU LOST", this.canvasWidth / 2, this.canvasHeight / 2);

    clearTimeout(this.timer);
}

  onStart = (ctx) => {

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("PRESS SPACEBAR TO START", this.canvasWidth / 2, this.canvasHeight / 2);
}

  draw(){
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    const {START, WIN, PAUSE, LOSE} = this.state.gameState

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.getRectArrays()

    if (START) {
      this.onStart(ctx)
  } else {
      this.drawRects(ctx)
  
      this.drawPaddle(ctx)
      
      this.drawBullet(ctx)

      this.hitRect(ctx)
      
      if (WIN) {
          this.onWin(ctx)
      }
      this.drawBonusRect(ctx)

      if (PAUSE && !WIN
      && !LOSE) {
          this.onPause(ctx)
      }

      if (LOSE) {
          this.onLose(ctx)
      }
  }

    requestAnimationFrame(this.draw);
  }

  componentDidMount(){
    
    this.setState((bullets) => {
      bullets = [{
        x: this.state.paddle.x + 40,
        y: this.canvasHeight - this.state.paddle.height,
        width: 20,
        speed: 10,
        fired: false
    }]
    return {
      bullets
    }
    })

    this.draw = this.draw.bind(this)
    this.draw()
  }

  onKeyUp = (e) => {
    switch (e.keyCode) {
        case 37: 
            if (this.state.paddle.x !== 0) {
                this.setState(({paddle}) => {
                  paddle.move_left = false
                  return {
                    paddle
                  }
                })
            }
        break;
        case 39: 
        this.setState(({paddle}) => {
          paddle.move_right = false
          return {
            paddle
          }
        })
        break;
    }
}

onKeyDown = (e) => {
  switch (e.keyCode) {
      case 37: 
          if (this.state.paddle.x !== 0) {
              this.setState(({paddle}) => {
                paddle.move_left = true
                return {
                  paddle
                }
              })
          }
      break;
      case 39: 
          this.setState(({paddle}) => {
            paddle.move_right = true
            return {
              paddle
            }
          })
      break;
      case 32: 
          if (this.state.gameState.START) {
              this.setState(({gameState}) => {
                gameState.START = false
                return {
                  gameState
                }
              })
              this.launchReсts()
          } else {
              if (!this.state.gameState.PAUSE) {
              this.setState(({bullets}) => {
                bullets[bullets.length - 1].fired = true
                bullets.push({
                  x: this.state.paddle.x + 40,
                  y: this.canvasHeight - this.state.paddle.height,
                  width: 20,
                  speed: 10,
                  fired: false
              })
              return {
                bullets
              }
              })
          } 
          }
      break;
      case 27:
          if (!this.state.gameState.PAUSE) {
              clearTimeout(this.timer)
              this.setState(({gameState}) => {
                gameState.PAUSE = true
                return {
                  gameState
                }
              })
          } else {
              this.launchReсts()
              this.setState(({gameState}) => {
                gameState.PAUSE = false
                return {
                  gameState
                }
              })
          }
      break;
      
  }
}

  render() {
    return (
      <div tabIndex="0" onKeyUp ={e => this.onKeyUp(e)}
      onKeyDown={e => this.onKeyDown(e)}>
        <div className="state">
          <span>SCORE: {this.state.gameState.SCORE} </span>
          <span>LIVES: {this.state.gameState.LIVES > 0 ? this.state.gameState.LIVES : 0}</span>
        </div>
        <canvas ref='canvas' width='500' height='500'></canvas>
      </div>
    )
  }
}