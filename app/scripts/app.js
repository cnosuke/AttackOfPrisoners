(function() {
  define(function() {
    var Paint, init, p;
    p = function(arg) {
      return console.log(arg);
    };
    Paint = (function() {
      function Paint() {
        this.canvas = $("#cvs").get(0);
        if (!this.canvas || !this.canvas.getContext) {
          p("canvas error");
          return false;
        } else {
          p("canvas ready");
          this.ctx = this.canvas.getContext('2d');
        }
      }

      Paint.prototype.drawLine = function(x0, y0, x1, y1) {
        var clr;
        clr = 'rgba(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', 1)';
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.strokeStyle = clr;
        this.ctx.lineWidth = 10;
        this.ctx.closePath();
        return this.ctx.stroke();
      };

      Paint.prototype.drawRect = function(x0, y0, x1, y1) {
        this.ctx.beginPath();
        this.ctx.rect(x0, y0, x1, y1);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0)';
        this.ctx.fill();
        this.ctx.lineWidth = 7;
        this.ctx.strokeStyle = 'black';
        return this.ctx.stroke();
      };

      return Paint;

    })();
    init = function() {
      var paint;
      p("start!!!!");
      paint = new Paint;
      p(Math.round(1.8));
      paint.drawLine(0, 0, 50, 50);
      paint.drawLine(200, 200, 20, 100);
      paint.drawRect(100, 100, 250, 250);
      return p("foo");
    };
    return {
      init: init
    };
  });

}).call(this);
