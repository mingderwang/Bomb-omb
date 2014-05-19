(function(){

  var resolutionGame = navigator.isCocoonJS ? [window.innerWidth, window.innerHeight] : [480, 320],
      scaleFactor = [window.innerWidth / 480, window.innerHeight / 320];

  var BootState = {
   create: function(){
      if(!navigator.isCocoonJS){
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resize your window to see the stage resize too
        this.game.scale.setShowAll();
        this.game.scale.refresh();
        this.game.scale.setScreenSize(true);
      }else{
        console.log(window.innerWidth / 480, window.innerHeight / 320);
        this.world.scale.setTo(window.innerWidth / 480, window.innerHeight / 320);
      }

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

      this.bomb = this.add.sprite(100, 100, 'bomb');
      this.bomb.inputEnabled = true;
      this.bomb.dragged = false;
      this.bomb.anchor.setTo(0.5,0.5);

      this.bomb.events.onInputDown.add(this.dragBomb, this);
      this.bomb.events.onInputUp.add(this.dropBomb, this);
    },

    update: function(){
      if(this.bomb.dragged){
        if(navigator.isCocoonJS){
          this.bomb.x = this.input.activePointer.x / scaleFactor[0];
          this.bomb.y = this.input.activePointer.y / scaleFactor[1];
        }else{
          this.bomb.x = this.input.activePointer.x;
          this.bomb.y = this.input.activePointer.y;
        }
      }
    },

    dragBomb: function(bomb, pointer){
      this.bomb.dragged = true;
      // console.log('drag', Math.floor(bomb.x), Math.floor(bomb.y), Math.floor(pointer.x), Math.floor(pointer.y));
    },

    dropBomb: function(bomb, pointer){
      this.bomb.dragged = false;
      // console.log('drop', Math.floor(bomb.x), Math.floor(bomb.y), Math.floor(pointer.x), Math.floor(pointer.y));
    }
  };

  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();