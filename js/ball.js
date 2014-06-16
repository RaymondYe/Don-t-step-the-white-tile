"use strict";
/*
 * 别碰白格子
 * @author RaymondyYip
 * @version 2014/6/9
 */
void

function(exports) {
  var DEBUG = false;

  var BallInfo = {
    timer: 5,
    Time: getId('time'),
    sTime: '',
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
    var h = '';
    for (var i = 0; i < Grid.total / Grid.cols; i++) {
      h += renderGridcols();
    };
    return h;
  }

  // render Grid cols
  function renderGridcols() {
    var h = '',
      p = random(10),
      b = random(Grid.cols);
    for (var i = 0; i < Grid.cols; i++) {
      if (b == i) {
        if (p == 0) {
          h += '<li data-ball="me"><img src="img/ball-2.png" alt="Ball"/></li>'
        } else {
          h += '<li data-ball="me"><img src="img/ball-1.png" alt="Ball"/></li>'
        }
      } else {
        h += '<li></li>'
      }
    }
    return h;
  }

  // render view
  function render(g) {

    g.innerHTML = renderGrid();

    var l = g.getElementsByTagName('li');

    Grid.height = Grid.width / 4;
    getId('wall').style.height = Grid.width + 'px';

    for (var i = 0; i < l.length; i++) {
      l[i].style['height'] = Grid.height + 'px';
    }

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

    if (t > 0 && this.running) {
      var m = Math.floor(t / 1000);
      var h = (t / 10).toFixed(0).toString().substr(-2, 2);
      BallInfo.Time.innerHTML = m + "'" + h + "''";
      getId('score').innerHTML = score;
    } else {
      this.stop();
    }
  }

  //Tap the ball
  function tap() {
    if (this.attributes['data-ball'] && ball.running && !ball.paused) {
      toggleGrid();
      toggleBall(this);
      score += 1;
    }
  }

  // Toggle Grid
  function toggleGrid() {
    var g = Grid.height;
    getId('game').style.webkitTransform = 'translate3d(0,' + g + 'px,0)';
    console.log(renderGridcols());
  }

  //ToggleBall
  function toggleBall(b) {
    var img = b.getElementsByTagName('img')[0];
    img.className = 'animated shake';
    img.src = 'img/ball-3.png';
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
      var self = this;
      this.id = g;
      Grid.width = this.id.offsetWidth;
      render(g);

      //Init Score
      getId('score').innerHTML = '&#215;' + score;

      //add Event for Game Start
      getId('start').addEventListener('click', function() {
        getId('review').className = 'flipOutX animated';
        getId('review').style.display = 'none';
        self.start();
      }, false);

      if (DEBUG) debugger
    },
    onStart: function() {

      // Change the Game Start button add ball event , init timer start
      getId('start').style.display = 'none';
      this.initEvent();
      this.timer.start = Date.now();
      this.onRun();

      if (DEBUG) debugger
    },
    initEvent: function() {

      //add Event for the Grid
      var self = this;
      var l = this.id.getElementsByTagName('li');

      for (var i = 0; i < l.length; i++) {
        l[i].addEventListener('click', tap, false);
      };

    },
    removeEvent: function() {

      // remove Event for the Grid
      var l = this.id.getElementsByTagName('li');

      for (var i = 0; i < l.length; i++) {
        l[i].removeEventListener('click', tap);
      };

    },
    onRun: function() {

      // Running the timer add update time
      var self = this;
      BallInfo.sTime = setInterval(function() {
        updateTime.call(self);
      }, this.timer.step);

    },
    onStop: function() {

      // clear the time Interval
      clearInterval(BallInfo.sTime)

      // post the time html
      BallInfo.Time.innerHTML = "0'" + "00''"

      // remove the ball event
      this.removeEvent()

      // show the modal
      $('#myModal').modal('show')
      // save the game info saveInfo()
      if (DEBUG) debugger
    }

  });
}(this);