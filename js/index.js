  $(function() {
    function render() {
      var can = document.getElementById('can')
      var canvas = document.getElementById('canvas')
      var ctx = canvas.getContext('2d')
      var w = 180,
        h = 35,
        offsetX = canvas.offsetLeft + can.offsetLeft,
        offsetY = canvas.offsetTop + can.offsetTop;

      layer(ctx);

      ctx.globalCompositeOperation = 'destination-out';

      var mousedown = false;

      // add move canvas event
      canvas.addEventListener('touchstart', eventDown);
      canvas.addEventListener('touchend', eventUp);
      canvas.addEventListener('touchmove', eventMove);
      canvas.addEventListener('mousedown', eventDown);
      canvas.addEventListener('mouseup', eventUp);
      canvas.addEventListener('mousemove', eventMove);

      // render the layer
      function layer(ctx) {
        ctx.fillStyle = '#7e7e7e'
        ctx.fillRect(0, 8, w, h)

      }

      // clear the later
      function eventDown(e) {
        e.preventDefault();
        mousedown = true;
      }

      // tap end
      function eventUp(e) {
        e.preventDefault();
        mousedown = false;
        var data = ctx.getImageData(0, 8, w, h).data;
        for (var i = 0, j = 0; i < data.length; i += 4) {
          if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
            j++;
          }
        }
        if (j <= w * h * 0.4) {
          ctx.clearRect(0, 8, w, h)
        }
      }

      // tap move
      function eventMove(e) {
        e.preventDefault();
        if (mousedown) {
          if (e.changedTouches) {
            e = e.changedTouches[e.changedTouches.length - 1];
          }
          var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
            y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;

          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // add the tab nav bg toggle
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
      var src = e.target.className == 'last' ? './img/nav-top2.png' : './img/nav-top.png'
      $('#nav-top').attr('src', src);
    })

    // add card event show Gua Gua Card
    $('#card').on('touchstart', function(ev) {
      $('body').css('overflow', 'hidden')
      $('#can').show()
      render()

      var html = '<div style="width:100%; height:100%; position:fixed; top:0; left:0; background: rgba(0,0,0,.5);" id="glayer"></div>'

      $('body').append(html)

      $('#glayer').on('touchstart', function(ev) {
        $(this).remove()
        $('#can').hide()
      });

    });



  });