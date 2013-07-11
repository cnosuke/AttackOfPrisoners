(function() {
  var Prisoner, PrisonerEnemy, PrisonerGame, PrisonerMe, p,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  p = function(arg) {
    return console.log(arg);
  };

  PrisonerGame = (function() {
    function PrisonerGame() {
      this.gameCount = 0;
      this.me = new PrisonerMe;
      this.enemy = new PrisonerEnemy;
      this.rule = [[3, 0], [5, 1]];
      this.readyEnvironment();
    }

    PrisonerGame.prototype.readyEnvironment = function() {
      var _this = this;
      this.ws = new WebSocket("ws://localhost:55555");
      this.eventKick();
      this.ws.onopen = function() {
        return p("ws connected.");
      };
      this.ws.closed = function() {
        return p("ws closed.");
      };
      this.ws.onmessage = function(evt) {
        p("ws onmessage");
        _this.enemy.setStrategy(parseInt(evt.data));
        return _this.eventKick();
      };
      $("#betrayal").click(function() {
        p("click betrayal");
        _this.me.setStrategy(1);
        _this.ws.send(1);
        return _this.eventKick();
      });
      $("#collaborate").click(function() {
        p("click collaborate");
        _this.me.setStrategy(0);
        _this.ws.send(0);
        return _this.eventKick();
      });
      return $("#gamebtn").click(function() {
        _this.stepGame();
        $("#gamebtn").hide();
        $("#betrayal").show();
        $("#collaborate").show();
        _this.messageArea(_this.resultMessage());
        $("#totalScore").html("あなたの合計は " + (_this.me.scoreSum()) + " 点で, 相手の合計は " + (_this.enemy.scoreSum()) + " 点");
        return $("#scoreList").prepend("<p>" + _this.gameCount + ": " + (_this.resultMessage()) + "</p>");
      });
    };

    PrisonerGame.prototype.resultMessage = function() {
      var enemy, me;
      me = this.me.meRecords[this.me.meRecords.length - 1];
      enemy = this.enemy.meRecords[this.enemy.meRecords.length - 1];
      return "あなたは " + (this.judgeConv(me)) + " , 相手は " + (this.judgeConv(enemy));
    };

    PrisonerGame.prototype.judgeConv = function(arg) {
      if (arg === 1) {
        return '裏切り';
      } else {
        return '協力';
      }
    };

    PrisonerGame.prototype.eventKick = function() {
      if (this.me.prepare) {
        if (this.enemy.prepare) {
          this.messageArea("準備が完了しました");
          $("#gamebtn").show();
          $("#betrayal").hide();
          return $("#collaborate").hide();
        } else {
          return this.messageArea("相手の準備が未だです.");
        }
      } else {
        if (this.enemy.prepare) {
          return this.messageArea("あなたの入力待ちです.");
        } else {
          return this.messageArea("あなたと相手の入力待ちです.");
        }
      }
    };

    PrisonerGame.prototype.messageArea = function(arg) {
      return $("#message").html(arg);
    };

    PrisonerGame.prototype.stepGame = function() {
      var enemyStrategy, meStrategy;
      if (this.me.prepare && this.enemy.prepare) {
        p("GAME!!");
        this.gameCount += 1;
        meStrategy = this.me.strategy();
        enemyStrategy = this.enemy.strategy();
        this.me.step(this.rule, meStrategy, enemyStrategy);
        return this.enemy.step(this.rule, enemyStrategy, meStrategy);
      } else {

      }
    };

    return PrisonerGame;

  })();

  Prisoner = (function() {
    function Prisoner(role) {
      this.role = role;
      this.prepare = false;
      this.nextSt = false;
      this.meRecords = [];
      this.enemyRecords = [];
      this.scores = [];
    }

    Prisoner.prototype.step = function(rule, me, enemy) {
      this.meRecords.push(me);
      this.enemyRecords.push(enemy);
      this.scores.push(rule[me][enemy]);
      return this.prepare = false;
    };

    Prisoner.prototype.strategy = function() {
      var buf;
      if (this.nextSt !== false) {
        buf = this.nextSt;
        this.nextSt = false;
        return buf;
      } else {
        return 1;
      }
    };

    Prisoner.prototype.setStrategy = function(st) {
      this.nextSt = st;
      return this.prepare = true;
    };

    Prisoner.prototype.scoreSum = function() {
      var res, score, _i, _len, _ref;
      res = 0;
      _ref = this.scores;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        score = _ref[_i];
        res += score;
      }
      return res;
    };

    return Prisoner;

  })();

  PrisonerMe = (function(_super) {
    __extends(PrisonerMe, _super);

    function PrisonerMe() {
      PrisonerMe.__super__.constructor.call(this, "me");
    }

    return PrisonerMe;

  })(Prisoner);

  PrisonerEnemy = (function(_super) {
    __extends(PrisonerEnemy, _super);

    function PrisonerEnemy() {
      PrisonerEnemy.__super__.constructor.call(this, "enemy");
    }

    return PrisonerEnemy;

  })(Prisoner);

  define(function() {
    var run;
    run = function() {
      return new PrisonerGame;
    };
    return {
      run: run
    };
  });

}).call(this);
