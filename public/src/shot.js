require([], function () {

  Q.Sprite.extend('Shot', {
      init: function(p) {
        this._super(p, {
          sprite: 'shot',
          sheet: 'shot',
          speed: 200,
        });
      },

      step: function(dt) {
        this.p.y -= this.p.speed * dt;

        if (this.p.y > Q.el.height || this.p.y < 0) {
          this.destroy();
        }
      }
  });

});
