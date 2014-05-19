(function(){

  var resolutionGame = navigator.isCocoonJS ? [window.innerWidth, window.innerHeight] : [480, 320];

  var BootState = {
    create: function(){
      this.state.start('preload');
    }
  };

  var PreloadState = {
    preload: function(){

    },

    create: function(){
      this.state.start('game');
    }
  };

  var GameState = {
    create: function(){
      
    },

    update: function(){
      
    }
  };


  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();