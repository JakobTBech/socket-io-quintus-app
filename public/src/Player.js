require([], function () {
  Q.Sprite.extend('Player', {
    init: function (p) {
      p.rotation_speed = 150;
      p.thrust = 3;
      p.slowdown = 0.8;
      p.thrustX = 0;
      p.thrustY = 0;
      p.speed = 0;
      p.max_speed = 200;
      p.min_speed = -100;
      this._super(p, {
        sheet: 'player'
      });

      this.add('2d, animation');
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

      console.log('angle:', this.p.angle);
      console.log('vx:', this.p.vx);
      console.log('vy:', this.p.vy);
      console.log('speed:', this.p.speed);
      console.log('thrustY:', this.p.thrustY);
      console.log('thrustX:', this.p.thrustX);

      console.log('\n');

      this.p.socket.emit('update', { playerId: this.p.playerId, x: this.p.x, y: this.p.y, sheet: this.p.sheet });
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
