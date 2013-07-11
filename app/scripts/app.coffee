# Copyright (C) 2013  Shinnosuke TAKEDA

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.


#
#  もはや下記のコードは使っていない
#



define ->
        p = (arg) -> console.log(arg)

        class Paint
            constructor: ->
                @canvas = $("#cvs").get(0)
                if !@canvas || !@canvas.getContext
                    p "canvas error"
                    return false
                else
                    p "canvas ready"
            
                    @ctx = @canvas.getContext('2d')

            drawLine: (x0, y0, x1, y1) ->
                clr = 'rgba('+ Math.round(Math.random()*255)+', '+Math.round(Math.random()*255)+', '+Math.round(Math.random()*255)+', 1)'
                @ctx.beginPath()
                @ctx.moveTo(x0, y0)
                @ctx.lineTo(x1, y1)
                @ctx.strokeStyle = clr
                @ctx.lineWidth = 10
                @ctx.closePath()
                @ctx.stroke()

            drawRect: (x0, y0, x1, y1) ->
                @ctx.beginPath();
                @ctx.rect(x0, y0, x1, y1);
                @ctx.fillStyle = 'rgba(255, 0, 0, 0)'
                @ctx.fill();
                @ctx.lineWidth = 7;
                @ctx.strokeStyle = 'black';
                @ctx.stroke();

        init = ->
            p "start!!!!"

            paint = new Paint
            p Math.round(1.8)
            paint.drawLine(0, 0, 50, 50)

            paint.drawLine(200, 200, 20, 100)

            paint.drawRect(100, 100, 250, 250)

            p "foo"

        return { init: init }


