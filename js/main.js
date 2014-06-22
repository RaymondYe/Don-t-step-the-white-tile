function gameSound() {
  createjs.Sound.alternateExtensions = ["mp3"]

  createjs.Sound.registerSound({
    id: "tap",
    src: "./src/tap.mp3"
  })
  createjs.Sound.registerSound({
    id: "over",
    src: "./src/over.mp3"
  })
}

$(function() {
  FastClick.attach(document.getElementById('wall'))
});

void

function() {
  window.onload = function() {
    var wall = document.getElementById('wall')
      // Game init
    ball.init(wall)

    // gHand init
    var gHand = wall.firstChild.lastChild.previousSibling.getElementsByTagName('li')

    for (var i = 0; i < gHand.length; i++) {
      if (gHand[i].className !== '') {
        $('#start').css({
          'left': gHand[i].offsetLeft,
          'top': gHand[i].offsetTop,
          'width': gHand[i].offsetWidth,
          'height': gHand[i].offsetWidth,
        }).removeClass('hidden');

      }

    }

    $("#start").on('touchstart', function() {
      ball.start()
      $("html, body").animate({
        scrollTop: document.body.offsetHeight + "px"
      }, {
        duration: 500,
        easing: "swing"
      });
      return false;
    });

    gameSound()
  }
}();