"use strict"
void

function(exports) {
  /*
   * 别碰白格子
   * @author RaymondyYip
   * @version 2014/6/9
   */
  var DEBUG = false;

  var BallInfo = {
    timer: 5,
    Time: document.getElementById('time'),
    sTime: '',
  };


  var Grid = {
    total: 16,
    cols: 4,
    width: 640
  };



  // random number
  function random(x) {
    return Math.floor(Math.random() * x);
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
      b = random(Grid.cols);
    for (var i = 0; i < Grid.cols; i++) {
      if (b == i) {
        h += '<li data-id="me"><img src="img/ball-1.png" alt="Ball"/></li>';
      } else {
        h += '<li></li>';
      }
    }
    return h;
  }

  // render view
  function render(g) {

    g.innerHTML = renderGrid();

    var l = g.getElementsByTagName('li');
    for (var i = 0; i < l.length; i++) {
      l[i].style['height'] = Grid.width / 4 + 'px';
    };

    initTime();
    if (DEBUG) {
      console.log('%s loaded.', g);
    }

  }

  function tap() {
    if (this.attributes['data-id']) {
      toggleBall(this);
    }
  }

  function initTime() {
    BallInfo.Time.innerHTML = BallInfo.timer + "'" + "00''";
  }

  function updateTime() {

    this.timer.last = Date.now();

    var t = BallInfo.timer * 1000 - (this.timer.last - this.timer.start);

    if (t > 0) {
      var m = Math.floor(t / 1000);
      var h = (t / 10).toFixed(0).toString().substr(-2, 2);
      BallInfo.Time.innerHTML = m + "'" + h + "''";
    } else {
      clearInterval(BallInfo.sTime);
      BallInfo.Time.innerHTML = "0'" + "00''";
      this.stop();
    }

  }

  function toggleBall(b) {

    var img = b.getElementsByTagName('img')[0];

    img.className = 'animated shake';

    img.src = 'img/ball-3.png';

  }

  exports.ball = new Best.Game({

    onInit: function(g) {

      var self = this;
      this.id = g;
      Grid.width = this.id.offsetWidth;
      render(g);

      document.getElementById('start').addEventListener('click', function() {
        self.onStart();
      }, false);

    },
    onStart: function() {
      this.initEvent();
      this.timer.start = Date.now();
      this.onRun();
    },
    initEvent: function() {

      var l = this.id.getElementsByTagName('li');

      for (var i = 0; i < l.length; i++) {
        l[i].addEventListener('click', tap, false);
      };

    },
    onRun: function() {
      var self = this;
      BallInfo.sTime = setInterval(function() {
        updateTime.call(self);
      }, this.timer.step);
    },
    onStop: function() {
      removeEventListener();
      alert('Over game');
    }

  });
}(this);