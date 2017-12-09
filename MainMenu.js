var MainMenu = {

	preload: function() {

		game.load.image('background', 'assets/background_loading.png');
		game.load.image('lvl1', 'assets/button1.png');
		game.load.image('lvl2', 'assets/button2.png');

	},
	
	create: function() {

		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);

		var mm = game.add.sprite(0, 0, 'background');
		//mm.scale.setTo(0.1,0.1);
		

		var b1 = game.add.button(150 , 130, "lvl1", function(){
			game.state.start('Level1');
		});
		b1.scale.setTo(0.4,0.4);
		b1.anchor.set(0.5, 0.5);
		
		var b2 = game.add.button(340, 130, "lvl2", function(){
			game.state.start('Level2');
		});
		b2.scale.setTo(0.4,0.4);
		b2.anchor.set(0.5, 0.5);


	}
}