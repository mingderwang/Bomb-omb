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
      this.load.spritesheet('bomb0', 'assets/bomb0.png', 32, 32, 3);
      this.load.spritesheet('bomb1', 'assets/bomb1.png', 32, 32, 3);
      this.load.image('containerLeft', 'assets/containerLeft.jpg');
      this.load.image('containerRight', 'assets/containerRight.jpg');
    },

    create: function(){
      this.state.start('game');
    }
  };

  var GameState = {
    create: function(){
      this.bg = this.add.image(0, 0, 'background');

      this.groupContainer = this.add.group();
      this.groupContainer.enableBody = true;
      this.groupContainer.physicsBodyType = Phaser.Physics.ARCADE;

      this.containerLeft = this.groupContainer.create(0, 89, 'containerLeft');
      this.containerRight = this.groupContainer.create(357, 89, 'containerRight');

      this.bombs = this.add.group();
      this.bombs.enableBody = true;
      this.bombs.physicsBodyType = Phaser.Physics.ARCADE;

      this.timerEvents = [];
      this.timerEvents[0] = this.time.events.loop(Phaser.Timer.SECOND * 1, this.createBomb, this);

      // this.game.plugins.add('Juicy');
      this.juicy = this.game.plugins.add(new Phaser.Plugin.Juicy(this));
    },

    update: function(){
      // console.log(this.input.activePointer.x, this.input.activePointer.y);
      game.physics.arcade.overlap(this.bombs, this.groupContainer, this.collideContainer, null, this);

      for(var i in this.bombs.children){
        if(this.bombs.children[i].dragged){
          this.bombs.children[i].x = this.input.activePointer.x / scaleFactor[0];
          this.bombs.children[i].y = this.input.activePointer.y / scaleFactor[1];
        }

        if(this.bombs.children[i].y > resolutionGame[1] - 16){
          this.physics.arcade.moveToXY(this.bombs.children[i], Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
        }
        if(this.bombs.children[i].y < 50 + 16){
          this.physics.arcade.moveToXY(this.bombs.children[i], Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
        }
      }
    },

    render: function(){
      
    },

    createBomb: function(){
      var frame = Math.floor(Math.random() * 2),
          bomb = this.bombs.create(resolutionGame[0] / (2 * scaleFactor[0]), -32, 'bomb' + frame, 0);

      anim = bomb.animations.add('walk');
      anim.play(5, true);

      bomb.inputEnabled = true;
      bomb.anchor.setTo(0.5,0.5);

      bomb.color = (frame) ? 'red' : 'black';
      bomb.dragged = false;
      bomb.posed = false;
      bomb.collideAllowed = false;

      bomb.timer = this.time.events.add(Phaser.Timer.SECOND * 5, this.exploseBomb, this, bomb);

      this.physics.enable(bomb, Phaser.Physics.ARCADE);

      //need to make this change in fonction of the different scale
      this.physics.arcade.moveToXY(bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));

      bomb.events.onInputDown.add(this.dragBomb, this);
      bomb.events.onInputUp.add(this.dropBomb, this);
    },

    dragBomb: function(bomb, pointer){
      bomb.dragged = true;
    },

    dropBomb: function(bomb, pointer){
      if(Phaser.Rectangle.contains(this.containerLeft.getBounds(), bomb.x + bomb.width / 2, bomb.y + bomb.height / 2)){
        // score ++
        if(bomb.color == 'red'){
          this.scored(bomb);
        }else{
          this.gameOver(bomb);
        }
      }
      if(Phaser.Rectangle.contains(this.containerRight.getBounds(), bomb.x + bomb.width / 2, bomb.y + bomb.height / 2)){
        // score ++
        if(bomb.color == 'black'){
          this.scored(bomb);
        }else{
          this.gameOver(bomb);
        }
      }
      bomb.dragged = false;
    },

    createTween: function(objectToTween){
      objectToTween.tween = this.add.tween(objectToTween);
      objectToTween.tween.to({ y: Math.random() * resolutionGame[0] }, 5000, Phaser.Easing.Linear.None);
      objectToTween.tween.start();
    },

    collideContainer: function(bomb, container){
      this.physics.arcade.moveToXY(bomb, Math.floor(Math.random() * ( 360 - 130 ) + 130), Math.floor(Math.random() * ( resolutionGame[1] - 130 ) + 130 ));
    },

    scored: function(bomb){
      this.time.events.remove(bomb.timer);
      bomb.posed = true;
      bomb.inputEnabled = false;
      bomb.body.velocity = 0;
    },

    gameOver: function(bomb){
      this.juicy.shake();
      for(var i in this.bombs.children){
        this.bombs.children[i].body.velocity = 0;
        this.time.events.remove(this.bombs.children[i].timer);
      }

      // wait a second before kiling the bombs
      this.time.events.add(Phaser.Timer.SECOND, function(){
        for(var j in this.bombs.children){
          // only bombs outside of container
          if(!this.bombs.children[j].posed){
            this.bombs.children[j].kill();
            this.juicy.shake();
          }
        }
      }, this);

      // stop creating bombs
      this.time.events.remove(this.timerEvents[0]);
    },

    exploseBomb: function(bomb){
      bomb.kill();
      this.gameOver();
    }
  };

  var game = new Phaser.Game(resolutionGame[0], resolutionGame[1], Phaser.CANVAS, '');

  game.state.add('boot', BootState, true);
  game.state.add('preload', PreloadState, false);
  game.state.add('game', GameState, false);
})();