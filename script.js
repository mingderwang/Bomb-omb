(function(){

  var resolutionGame = navigator.isCocoonJS ? [window.innerWidth, window.innerHeight] : [480, 320];

  var BootState = {
    create: function(){
      this.state.start('preload');
    }
  };

  var PreloadState = {
    preload: function(){
      this.load.image('background', 'assets/bg.png');
      this.load.image('bomb', 'assets/bomb.png');
    },

    create: function(){
      this.state.start('game');
    }
  };

  var GameState = {
    create: function(){
      this.bg = this.add.image(0, 0, 'background');

      this.bomb = this.add.sprite(0, 0, 'bomb');
      this.bomb.inputEnabled = true;
      this.bomb.input.enableDrag(false, true);
      this.bomb.events.onDragStop.add(this.dropBomb);
    },

    update: function(){
      
    },

    dropBomb: function(bomb, pointer){
      console.log(bomb, pointer);
    }
  };


  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();