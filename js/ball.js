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
    total: 16,
    cols: 4,
    width: 640,
    height: 0,
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

  // render Grid
  function renderGrid() {
    var h = ''
    Grid.height = Grid.width / 4
    for (var i = 0; i < Grid.total / Grid.cols; i++) {
      h += renderGridcols();
    };
    return h;
  }

  // render Grid cols
  function renderGridcols() {

    var h = '<li style="height:' + Grid.height + 'px"><ul>',
      p = random(BallInfo.fslBall),
      b = random(Grid.cols);

    for (var i = 0; i < Grid.cols; i++) {
      if (b == i) {
        if (p == 0) {
          h += '<li style="height:' + Grid.height + 'px"><img src="img/ball-2.png" alt="Ball"  data-ball="0"/></li>'
        } else {
          h += '<li style="height:' + Grid.height + 'px"><img src="img/ball-1.png" alt="Ball"  data-ball="0"/></li>'
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

    var l = g.getElementsByTagName('li')

    g.innerHTML = renderGrid()

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

  function Next(html, l) {

    var g = $('#game');

    g.append(html)

    g.css({
      'webkitTransition': BallInfo.moveSpeed + 'ms',
      'webkitTransform': 'translate3d( 0 , -' + l * Grid.height + 'px, 0 )'
    })

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

      Grid.width = this.id.offsetWidth
      render(g)

      //Init Score
      updateScore()

      //add Event for Game Start
      getId('start').addEventListener('touchstart', function() {
        self.start()
      }, false);

      if (DEBUG) debugger
    },
    onStart: function() {

      // show Game info
      $('.game-info').slideDown(300)

      // Change the Game Start button add ball event , init timer start
      getId('start').style.display = 'none'

      this.id.className = 'game'
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

      var childUl = this.id.getElementsByTagName('ul')

      childUl[0].getElementsByTagName('img')[0].attributes['data-ball'].value = 1

      self.fristBall = true

      this.id.addEventListener('touchstart', function(e) {

        var img = e.target

        if (img.attributes['data-ball'] && ball.running && !ball.paused) {

          if (img.attributes['data-ball'].value == 1) {
            // change the ball
            var type = img.src.substr(-5, 1)

            // same ball
            if (type == 1) {
              //img.className = 'animated shake'
              createjs.Sound.play("tap")
              img.src = 'img/ball-3.png'
            }

            // fsn ball
            if (type == 2) {
              img.className = 'animated shake'
              img.src = 'img/ball-4.png'

              self.onPause()
            }

            // false to click the kill ball
            img.attributes['data-ball'].value = 0

            img.parentNode.parentNode.parentNode.nextSibling.getElementsByTagName('img')[0].attributes['data-ball'].value = 1

            //first Ball
            if (self.fristBall) {

              self.fristBall = false

            } else {

              // get new col
              var col = renderGridcols()
              var ne = self.id.childNodes.length - 3

              //move canvas
              Next(col, ne)
              if (ne > 6) {
                img.parentNode.parentNode.parentNode.previousSibling.previousSibling.innerHTML = ''
              }
            }

            // add Score
            score += 1
          }
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
      $('#game').css('webkitTransform', 'translate3d( 0 , 0 , 0 )');
      this.firstBall = true
      if (DEBUG) debugger
      this.onInit(getId('game'))
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

      // post the modal score
      getId('modalScore').innerHTML = score;

      // show the modal
      $('#myModal').modal('show')
      getId('resume').addEventListener('touchstart', function() {
        $('#myModal').modal('hide')
        self.resume()
      }, false)

      // save the game info
      saveInfo()
      if (DEBUG) debugger
    }

  });
}(this);