(function(){

  var resolutionGame = navigator.isCocoonJS ? [window.innerWidth, window.innerHeight] : [480, 320],
      scaleFactor = [Math.round(window.innerWidth / 480 * 10) / 10, Math.round(window.innerHeight / 320 * 10) / 10];

      console.log(scaleFactor[0], scaleFactor[1]);

  var BootState = {
   create: function(){
      if(!navigator.isCocoonJS){
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resize your window to see the stage resize too
        this.game.scale.setShowAll();
        this.game.scale.refresh();
        this.game.scale.setScreenSize(true);
      }else{
        this.world.scale.setTo(scaleFactor[0], scaleFactor[1]);
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

      this.bomb = this.add.sprite(resolutionGame[0] / 2, -32, 'bomb');
      this.bomb.inputEnabled = true;
      this.bomb.dragged = false;
      this.bomb.anchor.setTo(0.5,0.5);

      this.physics.enable(this.bomb, Phaser.Physics.ARCADE);
      this.bomb.enableBody = true;
      this.bomb.physicsBodyType = Phaser.Physics.ARCADE;

      //need to make this change in fonction of the different scale
      this.physics.arcade.moveToXY(this.bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));

      this.bomb.events.onInputDown.add(this.dragBomb, this);
      this.bomb.events.onInputUp.add(this.dropBomb, this);
    },

    update: function(){
      // console.log(this.input.activePointer.x, this.input.activePointer.y);
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
    },

    dropBomb: function(bomb, pointer){
      this.bomb.dragged = false;
    },

    createTween: function(objectToTween){
      objectToTween.tween = this.add.tween(objectToTween);
      objectToTween.tween.to({ y: Math.random() * resolutionGame[0] }, 5000, Phaser.Easing.Linear.None);
      objectToTween.tween.start();
    }
  };

  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();