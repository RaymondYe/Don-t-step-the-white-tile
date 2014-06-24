"use strict";
/*
 * Tap the ball.
 * @ author RaymondyYip
 * @ version 2014/6/9
 * @ email 478562258@qq.com
 */
void

function(exports) {
  var DEBUG = false;

  var BallInfo = {
    timer: 30,
    Time: getId('time'),
    sTime: '',
    moveSpeed: 200,
    fslBall: 20,
    fsnStop: 2000,
  };


  var Grid = {
    total: 24,
    cols: 4,
    width: 640,
    height: 0,
    rows: 6
  };

  var queue = 0;
  var score = 0; //积分
  var fsnBest = 0; //历史最高分
  if (window.localStorage) {
    fsnBest = localStorage.getItem('fsnBest') || 0;
  }

  var status; // 'loading', 'ready', 'playing', 'gameover'
  var bestNew = false; // 新记录
  function gameOver() {
    if (score > fsnBest) {
      fsnBest = score;
      bestNew = true;
      if (window.localStorage) {
        localStorage.setItem('fsnBest', fsnBest);
        getId('best').innerHTML = fsnBest;
      }
    }
  }

  // Common func
  function random(x) {
    return Math.floor(Math.random() * x);
  }

  function getId(o) {
    return document.getElementById(o);
  }

  var ta = Grid.rows,
    firstCol;

  // render Grid
  function renderGrid() {
    var h = '<ul class="game">'
    Grid.height = Grid.width / 4
    ta = Grid.rows
    for (var i = 0; i < Grid.total / Grid.cols; i++) {
      ta -= 1
      h += renderGridcols()
    };
    h += '</ul>';
    return h;
  }

  function refeshGrid() {
    var h = ''
    Grid.height = Grid.width / Grid.cols
    ta = Grid.rows
    for (var i = 0; i < Grid.total / Grid.cols; i++) {
      ta -= 1
      h += renderGridcols()
    }
    return h;
  }


  // render Grid cols
  function renderGridcols() {

    var h = '<li style="height:' + Grid.height + 'px"><ul>',
      p = random(BallInfo.fslBall),
      b = random(Grid.cols);

    if (firstCol && ta == 0) {
      b = 999
      firstCol = false
    }
    for (var i = 0; i < Grid.cols; i++) {
      if (b == i) {
        if (p == 0) {
          h += '<li style="height:' + Grid.height + 'px" class="b2" data-t=' + ta + '></li>'
        } else {
          h += '<li style="height:' + Grid.height + 'px" class="b1" data-t=' + ta + '></li>'
        }
      } else {
        h += '<li style="height:' + Grid.height + 'px"></li>'
      }
    }
    h += '</ul></li>'
    return h;
  }

  // render view
  function render(g) {

    g.innerHTML += renderGrid()

    g.innerHTML += renderGrid()

    getId('wall').style.height = Grid.width + 'px'

    initTime()

  }

  //Init time
  function initTime() {
    BallInfo.Time.innerHTML = BallInfo.timer + "'" + "00''";
  }
  //Update time
  function updateTime() {
    this.timer.last = Date.now();
    var t = BallInfo.timer * 1000 - (this.timer.last - this.timer.start);
    if (this.running) {
      if (t > 0) {
        var m = Math.floor(t / 1000);
        var h = (t / 10).toFixed(0).toString().substr(-2, 2);
        BallInfo.Time.innerHTML = m + "'" + h + "''"
        updateScore()
      } else {
        clearInterval(BallInfo.sTime)
        this.stop()
      }
    }
  }

  //Update score
  function updateScore() {
    getId('score').innerHTML = '&#215;' + score
  }

  //Next Ball Cols
  function Next(id, y, m) {

    id.style['webkitTransition'] = m + 'ms'
    id.style['webkitTransform'] = 'translate3D(0,' + y + 'px,0)'

  }



  //Save the user ball info
  function saveInfo() {
    getId.ajax({
      url: './server/controller.php',
      type: 'post',
      dataType: 'json',
      data: {
        param1: 'value1'
      },
    })
      .done(function() {
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
  }
  exports.ball = new Best.Game({

    onInit: function(g) {

      //Rendering the game grid
      var self = this
      this.id = g
      firstCol = true
      Grid.width = screen.availWidth
      render(g)

      //Init Score
      updateScore()

      //add Event for Game Start
      getId('start').addEventListener('touchstart', function() {
        self.start()
      }, false);

      // Set the gamelayer
      Next(this.id.firstChild, 0)
      Next(this.id.lastChild, -Grid.height * Grid.rows)

      gameSound()


      if (DEBUG) debugger
    },
    onStart: function() {

      // show Game info
      $('.game-info').slideDown(300)

      // Change the Game Start button add ball event , init timer start
      getId('start').style.display = 'none'

      this.initEvent()
      this.timer.start = Date.now()
      this.onRun()

      if (DEBUG) debugger
    },
    moveLi: function() {
      this.id.removeChild(this.id.lastChild)
    },
    initEvent: function() {
      //add Event for the Grid
      var self = this

      var type = 1

      this.ta = 1

      this.even = true

      this.total = 1

      this.id.addEventListener('touchstart', function(e) {

        var li = e.target
        if (!li['attributes']['data-t']) return;
        var tt = parseInt(li['attributes']['data-t'].value || '')

        if (tt == self.ta && ball.running && !ball.paused) {

          // same ball
          if (li.className == 'b1') {
            li.className = 'b3'
          }

          // fsn ball
          if (li.className == 'b2') {
            li.className = 'b4'

            self.onPause()
          }

          // sound tap
          createjs.Sound.play("tap")

          //move canvas
          var x, y;
          if (self.even) {
            y = self.id.firstChild
            x = self.id.lastChild
          } else {
            x = self.id.firstChild
            y = self.id.lastChild
          }

          if (tt == 0) {
            Next(y, Grid.rows * Grid.height, BallInfo.moveSpeed)
            Next(x, 0, BallInfo.moveSpeed)
          } else {
            Next(y, tt * Grid.height, BallInfo.moveSpeed)
            if (tt == 1) {
              Next(x, -(Grid.rows - tt) * Grid.height, 0)
              x.innerHTML = refeshGrid()
            } else {
              Next(x, -(Grid.rows - tt) * Grid.height, BallInfo.moveSpeed)
            }
          }

          if (self.total % 6 == 0) self.even = self.even ? false : true

          // change ta value
          if (tt < Grid.rows) self.ta += 1
          if (tt == Grid.rows - 1) {
            self.ta = 0
          }
          self.total += 1

          // add Score
          score += 1
        }

      }, false);

    },
    onRun: function() {

      // Running the timer add update time
      var self = this

      BallInfo.sTime = setInterval(function() {
        updateTime.call(self)
      }, self.timer.step)

    },
    onPause: function() {

      var self = this

      //show big ball
      $('#big').removeClass('hidden').addClass('animated bounceIn').bind('touchstart', function() {

        $('#hand').addClass('hidden')
        // tap big ball music
        createjs.Sound.play("tap")

        $(this).removeClass('bounceIn').addClass('shake infinite')

        score += 1
        updateScore()

      })

      this.timer.start += BallInfo.fsnStop

      var to = setTimeout(function() {

        $('#big').removeClass('bounceIn infinite').addClass('hidden').unbind()
        self.onRun()

      }, BallInfo.fsnStop)

      clearInterval(BallInfo.sTime)
    },
    onResume: function() {
      this.id.innerHTML = ''
      this.onInit(getId('wall'))
      this.id.className = 'wall'
      if (DEBUG) debugger
      score = 0
      this.start()
    },
    onStop: function() {

      var self = this

      //over music
      createjs.Sound.play("over")

      // disabled the click event
      this.id.className += ' disabled'

      // post the time html
      BallInfo.Time.innerHTML = "0'" + "00''"

      // show the modal And post the modal score
      getId('modalScore').innerHTML = score
      var end = getId('game-end')
      end.style.display = 'block'
      $('#J-Simple-Mask').show()

      // add close event
      touch.on('#close', 'tap', function(ev) {
        end.style.display = 'none'
        $('#J-Simple-Mask').hide()
      })

      touch.on('#J-Simple-Mask', 'tap', function(ev) {
        $('#J-Simple-Mask').css('z-index', '999')
        document.getElementById('J_share-tips').style.display = 'none'
      })

      touch.on('#share', 'tap', function(ev) {
        $('#J-Simple-Mask').css('z-index', '1111')
        document.getElementById('J_share-tips').style.display = 'block'
      })

      //add resume event
      getId('resume').addEventListener('touchend', function() {
        end.style.display = 'none'
        $('#J-Simple-Mask').hide()
        self.resume()
      }, false)

      // save the game info
      saveInfo()
      if (DEBUG) debugger
    }

  });
}(this);