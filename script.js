(function(){

  var resolutionGame = navigator.isCocoonJS ? [window.innerWidth, window.innerHeight] : [480, 320],
      scaleFactor = [Math.round(resolutionGame[0] / 480 * 10) / 10, Math.round(resolutionGame[1] / 320 * 10) / 10];

  var BootState = {
   create: function(){
      if(!navigator.isCocoonJS){
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //resize your window to see the stage resize too
        // this.game.scale.setShowAll();
        // this.game.scale.refresh();
        // this.game.scale.setScreenSize(true);
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
      this.load.image('containerLeft', 'assets/containerLeft.jpg');
      this.load.image('containerRight', 'assets/containerRight.jpg');
    },

    create: function(){
      this.state.start('game');
    }
  };

  var GameState = {
    create: function(){
      // this.physics.startSystem();

      this.bg = this.add.image(0, 0, 'background');

      this.groupContainer = this.add.group();
      this.groupContainer.enableBody = true;
      this.groupContainer.physicsBodyType = Phaser.Physics.ARCADE;

      this.containerLeft = this.groupContainer.create(0, 89, 'containerLeft');
      this.containerRight = this.groupContainer.create(357, 89, 'containerRight');

      this.bomb = this.add.sprite(resolutionGame[0] / 2, -32, 'bomb');
      this.bomb.inputEnabled = true;
      this.bomb.anchor.setTo(0.5,0.5);
      this.bomb.dragged = false;
      this.bomb.collideAllowed = false;

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

      game.physics.arcade.overlap(this.bomb, this.groupContainer, this.collideContainer, null, this);

      if(this.bomb.dragged){
        this.bomb.x = this.input.activePointer.x / scaleFactor[0];
        this.bomb.y = this.input.activePointer.y / scaleFactor[1];
      }

      if(this.bomb.y > resolutionGame[1] - 16){
        this.physics.arcade.moveToXY(this.bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
      }
      if(this.bomb.y < 100 + 16){
        this.physics.arcade.moveToXY(this.bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
      }

      console.log(this.bomb.collideAllowed);
    },

    render: function(){
      // game.debug.spriteBounds(this.bomb);
      // game.debug.spriteBounds(this.containerLeft);
      // game.debug.spriteBounds(this.containerRight);
    },

    dragBomb: function(bomb, pointer){
      this.bomb.dragged = true;
      this.bomb.collideAllowed = true;
    },

    dropBomb: function(bomb, pointer){
      if(Phaser.Rectangle.contains(this.containerLeft.getBounds(), this.bomb.x + this.bomb.width / 2, this.bomb.y + this.bomb.height / 2) ||
        Phaser.Rectangle.contains(this.containerRight.getBounds(), this.bomb.x + this.bomb.width / 2, this.bomb.y + this.bomb.height / 2)){
        this.bomb.collideAllowed = true;
      }
      this.bomb.dragged = false;
      // this.bomb.collideAllowed = false;
    },

    createTween: function(objectToTween){
      objectToTween.tween = this.add.tween(objectToTween);
      objectToTween.tween.to({ y: Math.random() * resolutionGame[0] }, 5000, Phaser.Easing.Linear.None);
      objectToTween.tween.start();
    },

    collideContainer: function(bomb, container){
      if(!bomb.collideAllowed){
        this.physics.arcade.moveToXY(bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
      }
    }
  };

  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();