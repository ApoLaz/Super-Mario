var Level2 = {
		preload:function(){

			//Audio
			game.load.audio('gameover', ['audio/gameover.mp3']);
			game.load.audio('death',['audio/die.mp3']);
			game.load.audio('coin',['audio/coin.mp3']);
			game.load.audio('theme song',['audio/mario.mp3']);
			game.load.audio('jump',['audio/jump.wav']);
			game.load.audio('stomp',['audio/stomp.wav']);
			game.load.audio('portalsound', ['audio/portalsound.mp3']);
			

			//  We need this because the assets are on github pages
			//  Remove the next 2 lines if running locally
			this.load.baseURL = 'https://ApoLaz.github.io/Super-Mario/';
			this.load.crossOrigin = 'anonymous';

			this.load.spritesheet('tiles', 'assets/super_mario_tiles.png', 16,
					16);
			this.load.spritesheet('goomba', 'assets/goomba.png', 16, 16);
			this.load.spritesheet('mario', 'assets/mario.png', 20, 29);
			this.load.spritesheet('coin', 'assets/coin.png', 16, 16);
			this.load.spritesheet('enemy', 'assets/enemy.png', 43, 49);
			this.load.tilemap('level', 'assets/Map2.json', null,
					Phaser.Tilemap.TILED_JSON);

		},

		create: function(){

			this.camera.flash(000000, 2000);
			themesnd = game.add.audio("theme song");
			themesnd.loopFull(0.2);		//theme song	
			deathsnd = game.add.audio("die");			//death sound
			gameoversnd = game.add.audio("gameover");
			jumpsnd = game.add.audio("jump");
			portalsnd = game.add.audio("portalsound");

			Phaser.Canvas.setImageRenderingCrisp(game.canvas)
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.stage.backgroundColor = '#191970';

			map = game.add.tilemap('level');
			map.addTilesetImage('tiles', 'tiles');
			map.setCollisionBetween(3, 12, true, 'solid');

			map.createLayer('background');

			layer = map.createLayer('solid');
			layer.resizeWorld();
			
			portalbox = game.add.group();
			portalbox.enableBody = true;
			map.createFromTiles(26,null,'portalbox','stuff',portalbox);
			portalbox.callAll('animations.add', 'animations', 'still', [0],1,true);
			portalbox.callAll('animations.play','animations','still');
			portalbox.setAll('body.immovable',true);

			mysterybox = game.add.group();
			mysterybox.enableBody = true;
			
			
			

			coins = game.add.group();
			coins.enableBody = true;
			map.createFromTiles(2, null, 'coin', 'stuff', coins);
			coins.callAll('animations.add', 'animations', 'spin',
					[ 0, 1, 2, 3, 4 ], 3, true);
			coins.callAll('animations.play', 'animations', 'spin');

			goombas = game.add.group();
			goombas.enableBody = true;
			map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
			goombas.callAll('animations.add', 'animations', 'walk', [ 0, 1 ],
					2, true);
			goombas.callAll('animations.play', 'animations', 'walk');
			goombas.setAll('body.bounce.x', 1);
			goombas.setAll('body.velocity.x', -20);
			goombas.setAll('body.gravity.y', 500);

			enemy= game.add.group();
			enemy.enableBody = true;
			map.createFromTiles(27, null, 'enemy', 'stuff', enemy);
			enemy.callAll('animations.add', 'animations', 'walkRight', [0], 1, true);
			enemy.callAll('animations.add', 'animations', 'walkLeft', [1], 1, true);
			enemy.callAll('animations.play', 'animations', 'walkLeft');
			enemy.setAll('body.bounce.x', 1);
			enemy.setAll('body.velocity.x', -80);
			enemy.setAll('body.gravity.y', 500);

			player = game.add.sprite(16, game.world.height - 61, 'mario');
			game.physics.arcade.enable(player);
			player.body.gravity.y = 370;
			player.body.setSize(16,29);
			player.body.collideWorldBounds = true;
			player.animations.add('mushroomSuper', [8, 1, 8, 1], 4, true);
			player.animations.add('walkRight', [4, 0], 5, true);
			player.animations.add('walkLeft', [2, 3], 5, true);
			player.animations.add('walkRightSuper', [11, 7], 5, true);
			player.animations.add('walkLeftSuper', [9, 10], 5, true);
			player.goesRight = true;

			player.body.enable = false;
			level2Text = game.add.bitmapText(150,85,'font', 'Level 2',55);
			level2Text.fixedToCamera = true;
			game.time.events.add(Phaser.Timer.SECOND * 3, function() {
						level2Text.destroy();
						player.body.enable = true;
					});

			game.camera.follow(player);
			scoreText = game.add.bitmapText(16,16,'font', 'Score: '+score,16);
			scoreText.fixedToCamera = true;
			//scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '22px', fill: '#A04242' });
			livesText = game.add.bitmapText(416,16,'font', 'Lives : '+lives,16);
			livesText.fixedToCamera = true;
			//livesText = game.add.text(405, 16, 'Lives: '+lives, { fontSize: '22px', fill: '#A04242'});
			cursors = game.input.keyboard.createCursorKeys();
			//game.input.onDown.add(fade, this);

		},

		update: function() {
			game.physics.arcade.collide(player, layer);
			game.physics.arcade.collide(goombas, layer);
			game.physics.arcade.collide(enemy, layer);
			game.physics.arcade.collide(player, mysterybox, mysteryboxOverlap);
			game.physics.arcade.collide(mushroom, player, mushroomOverlap);
			game.physics.arcade.overlap(enemy, layer, enemyHit);
			game.physics.arcade.overlap(player, goombas, goombaOverlap);
			game.physics.arcade.overlap(player, coins, coinOverlap);
			game.physics.arcade.overlap(portalbox, player, portalboxOverlap);
			game.physics.arcade.overlap(player, enemy, enemyOverlap);



		if(ascent == 0){
			if (player.body.enable) {
				player.body.velocity.x = 0;
				if (cursors.left.isDown) {
					player.body.velocity.x = -90;
					player.animations.play('walkLeft');
					player.goesRight = false;
				} else if (cursors.right.isDown) {
					player.body.velocity.x = 90;
					player.animations.play('walkRight');
					player.goesRight = true;
				} else {
					player.animations.stop();
					if (player.goesRight)
						player.frame = 0;
					else
						player.frame = 3;
				}

				if (cursors.up.isDown && player.body.onFloor()) {
					jumpsnd.play();
					player.body.velocity.y = -190;
					player.animations.stop();
				}	

				if (player.body.velocity.y != 0) {
					if (player.goesRight)
						player.frame = 4;
					else
						player.frame = 5;

				}
			}
		}
			else if(ascent == 1){
				if (player.body.enable) {
				player.body.velocity.x = 0;
				if (cursors.left.isDown) {
					player.body.velocity.x = -90;
					player.animations.play('walkLeftSuper');
					player.goesRight = false;
				} else if (cursors.right.isDown) {
					player.body.velocity.x = 90;
					player.animations.play('walkRightSuper');
					player.goesRight = true;
				} else {
					player.animations.stop();
					if (player.goesRight)
						player.frame = 7;
					else
						player.frame = 10;
				}

				if (cursors.up.isDown && player.body.onFloor()) {
					jumpsnd.play();
					player.body.velocity.y = -190;
					player.animations.stop();
				}	

				if (player.body.velocity.y != 0) {
					if (player.goesRight)
						player.frame = 11;
					else
						player.frame = 12;
				}
			}
		}
	}
}
