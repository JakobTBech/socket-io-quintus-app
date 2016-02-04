var Q = Quintus({ audioSupported: ['wav', 'mp3'] })
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, TMX, UI, Audio')
      .setup({ 
          //maximize: true,
          upsampleWidth:  1920,
          upsampleHeight: 1280,
          width:   1140, 
          height:  560, 
          scaleToFit: true 
          })
        // And turn on default input controls and touch input (for UI)
        .controls(true).touch()
        // Enable sounds.
        .enableSound()


Q.gravityY = 0;

var objectFiles= [
  './src/cannon',
  './src/shot',
  './src/player'
];

var boundingBox = {minX:16, minY:0, maxX:99*64, maxY: 54*14};
var players = [];
var socket = io.connect('http://localhost:3000');
var UiPlayers = document.getElementById('players');

require(objectFiles, function () {
  function setUp (stage) {
    socket.on('count', function (data) {
      UiPlayers.innerHTML = 'Players: ' + data.playerCount;
    });

    socket.on('connected', function (data) {
      selfId = data.id;
      player = new Q.Player({
        playerId: selfId,
        x: 100,
        y: 100,
        socket: socket
      });
      stage.insert(player);
      stage.add('viewport').follow(player);
    });

    socket.on('updated', function (data) {

      var actor = players.filter(function (obj) {
        return obj.playerId == data['playerId'];
      })[0];

      if (actor) {
        actor.player.p.x = data['x'];
        actor.player.p.y = data['y'];
        actor.player.p.angle = data['angle'];
        actor.player.p.sheet = data['sheet'];
        actor.player.p.update = true;
      } else {
        var temp = new Q.Actor({ playerId: data['playerId'], x: data['x'], y: data['y'], sheet: data['sheet'] });
        players.push({ player: temp, playerId: data['playerId'] });
        stage.insert(temp);
      }

    });
  }

Q.scene("arena",function(stage) {
  Q.stageTMX("404-level.tmx",stage);

  stage.add("viewport").follow(player, {x: true, y:true}, boundingBox);
  stage.viewport.scale = 0.8;

});
/*
  Q.scene('arena', function(stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));

    setUp(stage);
  });

*/
  var files = [
    '/images/shot.png',
    '/images/shot.json',
    '/images/tank.png',
    '/images/tank.json',
    '/images/404-tiles.png',
    '/images/bg_castle.png',
    '/maps/tank-level.tmx'
  ];



 // Q.load(files.join(','), function () {
  Q.loadTMX(files.join(','), function () {
    Q.compileSheets('/images/shot.png', '/images/shot.json');
    Q.compileSheets('/images/tank.png', '/images/tank.json');
    Q.stageScene('arena');
  });
});
