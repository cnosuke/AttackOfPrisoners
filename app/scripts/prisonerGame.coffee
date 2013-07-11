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

p = (arg) ->
    console.log arg

class PrisonerGame
    constructor: ->
        @gameCount = 0
        @me = new PrisonerMe
        @enemy = new PrisonerEnemy

        @rule = [[ 3, 0 ],[ 5, 1 ]]
        @readyEnvironment()

    readyEnvironment: ->
        @ws = new WebSocket("ws://localhost:55555")

        @eventKick()

        @ws.onopen = ->
            p "ws connected."

        @ws.closed = ->
            p "ws closed."

        @ws.onmessage = (evt) =>
            p "ws onmessage"
            @enemy.setStrategy(parseInt(evt.data))
            @eventKick()

        $("#betrayal").click =>
            p "click betrayal"
            @me.setStrategy(1)
            @ws.send(1)
            @eventKick()

        $("#collaborate").click =>
            p "click collaborate"
            @me.setStrategy(0)
            @ws.send(0)
            @eventKick()

        $("#gamebtn").click =>
            @stepGame()
            $("#gamebtn").hide()
            $("#betrayal").show()
            $("#collaborate").show()
            @messageArea(@resultMessage())
            $("#totalScore").html("あなたの合計は #{@me.scoreSum()} 点で, 相手の合計は #{@enemy.scoreSum()} 点")
            $("#scoreList").prepend("<p>#{@gameCount}: #{@resultMessage()}</p>")


    resultMessage: ->
        me = @me.meRecords[@me.meRecords.length-1]
        enemy = @enemy.meRecords[@enemy.meRecords.length-1]
        return "あなたは #{@judgeConv(me)} , 相手は #{@judgeConv(enemy)}"
    
    judgeConv: (arg) ->
        return if arg == 1 then '裏切り' else '協力'


    eventKick: ->
        if(@me.prepare)
            if(@enemy.prepare)
                @messageArea("準備が完了しました")
                $("#gamebtn").show()
                $("#betrayal").hide()
                $("#collaborate").hide()
            else
                @messageArea("相手の準備が未だです.")
        else
            if(@enemy.prepare)
                @messageArea("あなたの入力待ちです.")
            else
                @messageArea("あなたと相手の入力待ちです.")

    messageArea: (arg)->
        $("#message").html(arg)

    stepGame: ->
        if(@me.prepare && @enemy.prepare)
            p "GAME!!"
            @gameCount += 1
            meStrategy = @me.strategy()
            enemyStrategy = @enemy.strategy()

            @me.step(@rule, meStrategy, enemyStrategy)
            @enemy.step(@rule, enemyStrategy, meStrategy)
        else
            return


class Prisoner
    constructor: (@role)->
        @prepare = false
        @nextSt = false
        @meRecords = []
        @enemyRecords = []
        @scores = []

    step: (rule, me, enemy) ->
        @meRecords.push me
        @enemyRecords.push enemy
        @scores.push rule[me][enemy]
        @prepare = false

    # 0 - 協力, 1 - 裏切り
    strategy: ->
        if(@nextSt != false)
            buf = @nextSt
            @nextSt = false
            return buf
        else
            return 1

    setStrategy: (st) ->
        @nextSt = st
        @prepare = true

    scoreSum: ->
        res = 0
        res += score for score in @scores
        return res


class PrisonerMe extends Prisoner
    constructor: ->
        super("me")

class PrisonerEnemy extends Prisoner
    constructor: ->
        super("enemy")

define ->
    run = ->
        new PrisonerGame

     return { run: run }