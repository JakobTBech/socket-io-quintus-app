require([], function () {

  Q.Sprite.extend('Cannon', {
      init: function(p) {
        this._super(p, {
          sprite: 'cannon',
          sheet: 'cannon',
          speed: 0,
          angle: 0
        });
      },

      step: function(dt) {
        this.p.y
      }
  });

});
