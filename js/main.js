    createjs.Sound.addEventListener("fileload", handleLoadComplete)

    function handleLoadComplete() {

    }

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

      //$('#myModal').modal('show')
      FastClick.attach(document.getElementById('wall'))
      gameSound()

      $('#share').click(function(event) {
        $('#myModal').modal('hide');
        var imgUrl = './img/img-guide.png';
        $('body').append('<img src="' + imgUrl + '" alt="" id="J_share-tips" ' +
          'style="position: fixed;left:50%;margin-left:-150px;;top:5px;width:300px;height: auto;z-index:1000;' +
          ' background-repeat: no-repeat;background-position:center 0px;z-index:99999999"/>');
        $('body').append('<div id="J-Simple-Mask" style="display: block; z-index: 999; left: 0px; position: fixed; top: 0px; width: ' + screen.availWidth + 'px; opacity: 0.8; height: ' + screen.availHeight + 'px; background-color: black;"><p style="display: block; z-index: 1000; left: 0; right: 0; position: fixed; bottom: 0px; width: 300px; color: #777777; margin: auto; height: 30px;">技术支持：星云微讯 0755-28520488</p></div>');
        $('#J_share-tips').on('click', function() {
          $('#J_share-tips').remove();
          $('#J-Simple-Mask').remove();
        });
      })
    })

     void

    function() {
      window.onload = function() { // Game init
        ball.init(document.getElementById('wall'))
      //   var gHand = $('#game').find('li')[0];
      //   $('#start').css({
      //     'left': gHand.offsetLeft,
      //     'width': gHand.width,
      //     'height': gHand.width,
      //   }).show();
      //   $("#start").bind('touchstart', function() {
      //     $("html, body").animate({
      //       scrollTop: document.body.offsetHeight + "px"
      //     }, {
      //       duration: 500,
      //       easing: "swing"
      //     });
      //     return false;
      //   });
        ball.start()

       }
    }();