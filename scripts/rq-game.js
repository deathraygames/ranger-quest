RocketBoots.loadComponents([
	"Game",
	"Coords",
	"ImageBank",
	"StateMachine",
	"Dice",
	"Loop",
	"Stage",
	"World",
	"Incrementer",
	"Stage",
	"Storage",
	"SoundBank",
	"Notifier",
	"Walkthrough",
	"Tabs"
]).ready(function(){

	//==== Constants

	var GOLD_WEIGHT 	= 0.1
		,LOOP_DELAY 	= 100   	// 10 = 1/100th of a second (better than 60 fps)
	;


	//==== GAME

	console.log(RocketBoots);
	console.log(RocketBoots.Game);

	var g = window.g = new RocketBoots.Game({
		name: "Ranger Quest",
		instantiateComponents: [
			{"state": "StateMachine"},
			{"loop": "Loop"},
			{"incrementer": "Incrementer"},
			{"dice": "Dice"},
			{"images": "ImageBank"},
			{"sounds": "SoundBank"},
			{"notifier": "Notifier"},
			{"storage": "Storage"},
			{"walkthrough": "Walkthrough"},
			{"world": "World"},
			{"stage": "Stage"}
		],
		version: "v0.1"
	});

	g.state.addStates({
		"preload": {
			start: function(){
				$('.screen').hide();
				$('body > footer').show();
				$('.splash').show().find('.start').hide();
				$('.splash .loading').show();

				g.state.transition("splash");
			}, end: function(){
				$('.splash .loading').hide();
			}
		},
		"splash": {
			start: function(){
				$('.screen').hide();
				$('body > footer').show();
				$('.splash').show().find('.start').show();

				g.state.transition("game");
			}, end: function(){
				$('.splash').hide();
				$('body > footer').hide();
			}
		},
		"menu": {
			start: function () {
				g.state.transition("game"); // go straight to the game; TODO: change this later
			}
		},
		"game": {
			start: function () {
				$('.screen').show();
				$('.controls').show();
				$('.action').show().find('.travel').show()
					.end().find('.combat').hide();

				console.log("----------------===== Starting Game =====----------------");
				//g.stage.draw();
				g.loop.start();
			}, end: function () {
				g.loop.stop();
			}
		},
		"town": {
			start: function () {
				g.loop.start();
			}, end: function () {
				g.loop.stop();
			}
		},
		"running": {
			start: function () {
				g.loop.start();
			}, end: function () {
				g.loop.stop();
			}
		}, 
		"resting": {
			start: function () {
				g.loop.start();
			}, end: function () {
				g.loop.stop();
			}			
		}
	});

	g.inCombat = false;
	g.direction = 0;
	g.inventory = []; // TODO: fill this with items

	g.incrementer.addCurrencies([
		{
			name: "health",
			displayName: "Hit Points",
			selectors: {
				val: [".health-value"],
				max: [".health-max"],
				rate: [".health-rate"]
			}, 
			value: 0,
			min: 0,
			max: 100,
			rate: 0
		},{
			name: "distance",
			displayName: "Distance",
			selectors: {
				val: [".distance-value"],
				max: [".distance-max"],
				rate: [".distance-rate"]
			}, 
			value: 0,
			min: 0,
			max: 1000,
			rate: function(){
				// TODO: Based on bonuses
				return 1;
			}
		},{
			name: "morale",
			displayName: "Morale",
			selectors: {
				val: [".morale-value"],
				max: [".morale-max"],
				rate: [".morale-rate"]
			}, 
			value: 100,
			min: 0,
			max: 100,
			rate: -0.0001
		},{
			name: "gold",
			displayName: "Gold",
			selectors: {
				val: [".gold-value"],
				max: [".gold-max"],
				rate: [".gold-rate"]
			},
			value: 0,
			min: 0,
			max: function(){
				// TODO: Based on free encumberance
				return 100;
			}
		},{
			name: "encumberance",
			displayName: "Encumberance",
			value: function(c){
				var wt = c.gold.val * GOLD_WEIGHT;
				// Based on gold an items
				return wt;
			},
			min: 0,
			max: function(){
				// TODO: based on type of bag
				return 100;
			}
		}
	]);

	g.loop.set(function quickLoop (iteration){
		g.incrementer.incrementByElapsedTime(undefined, true);
		g.incrementer.calculate();

		//var onePlotAngle = (Math.PI * 2) / TOTAL_PLOTS;
		//g.stage.camera.pos.theta -= onePlotAngle/100;
		//g.stage.camera.rotation += onePlotAngle/100;
		g.stage.draw();
	}, LOOP_DELAY);


	//==== U.I.

	g.tabs = new RocketBoots.Tabs({
		tabbedContentContainerSelector:		".tabbed-content-container",
		tabbedContentSelector:				"section",
		tabsContainerSelector:				".tabs",
		tabsSelector:						"a",
		selectedClass: 						"selected"
	});
	g.tabs.setup().select("about");

	g.setupUI = function () {
		$('.go-left').click(function(e){
			g.state.transition('running');
			g.direction = -1;
		});
		$('.go-right').click(function(e){
			g.state.transition('running');
			g.direction = 1;
		});
		$('.stop').click(function(e){
			g.state.transition('resting');
			g.direction = 0;
		});
		$('.morale').click(function(e){
			g.incrementer.currencies.morale.add(1);
		});
	};



	//==== Start Up

	g.setupUI();
	g.state.transition("preload");


}).init();