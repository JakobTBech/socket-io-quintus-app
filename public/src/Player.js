require([], function () {

  Q.component('cannon', {
    added: function() {
      this.entity.p.shots = [];
      this.entity.on('step', 'handleFiring');
    },
    extend: {

      fire: function () {
        if (Q.inputs['fire']) {
          var entity = this;
          var shot = Q.stage().insert(new Q.Shot({
            x: entity.p.x,
            y: entity.p.y,
            speed: 200,
            type: Q.SPRITE_DEFAULT || Q.SPRITE_FRIENDLY
          }));
          entity.p.shots.push(shot);
        }
      },

      handleFiring: function(dt) {
        var entity = this;
        var i;
        // 
        // for (i = entity.p.shots.length - 1; 1 >= 0; i--) {
        //
        // }

        if (Q.inputs['fire']) {
          this.fire();
        }
      }

    }
  });

  Q.Sprite.extend('Player', {
    init: function (p) {
      p.rotation_speed = 150;
      p.thrust = 3;
      p.slowdown = 0.9;
      p.thrustX = 0;
      p.thrustY = 0;
      p.speed = 0;
      p.max_speed = 100;
      p.min_speed = -75;
      this._super(p, {
        sheet: 'player'
      });

      this.add('2d, animation, cannon');
    },
    step: function (dt) {
      if (Q.inputs["right"]) {
        this.p.angle += this.p.rotation_speed * dt;
      }
      else if (Q.inputs["left"]) {
        this.p.angle -= this.p.rotation_speed * dt;
      }

      this.p.thrustX = -Math.sin(this.p.angle * Math.PI / 180);
      this.p.thrustY = Math.cos(this.p.angle * Math.PI / 180);

      if (Q.inputs["up"]) {
        this.p.speed = clamp(this.p.speed + this.p.thrust, this.p.min_speed, this.p.max_speed);
      } else if (Q.inputs["down"]) {
        this.p.speed = clamp(this.p.speed - this.p.thrust, this.p.min_speed, this.p.max_speed);
      } else {
        this.p.speed *=this.p.slowdown;

        if (this.p.speed < 1 && this.p.speed > -1) {
          this.p.speed = 0;
        }
      }

      this.p.vx = this.p.thrustX * this.p.speed;
      this.p.vy = this.p.thrustY * this.p.speed;

      this.p.socket.emit('update', {
        playerId: this.p.playerId,
        x: this.p.x,
        y: this.p.y,
        angle: this.p.angle,
        sheet: this.p.sheet
      });
    }
  });
});

Q.Sprite.extend('Actor', {
  init: function (p) {
    this._super(p, {
      update: true
    });

    var temp = this;
    setInterval(function () {
      if (!temp.p.update) {
        temp.destroy();
      }
      temp.p.update = false;
    }, 3000);
  }
});

function clamp(x, min, max){
  return x < min ? min : (x > max ? max : x);
}
