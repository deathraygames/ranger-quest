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

	var GOLD_WEIGHT = 0.1;

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
				g.createRandomBuildings(); // TODO: remove this later
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
		}
	});

	g.inventory = []; // TODO: fill this with items

	g.incrementer.addCurrencies([
		// DEMAND
		{
			name: "hp",
			displayName: "Hit Points",
			selectors: {
				val: [".R .val"],
				rate: [".R .rate"]
			}, 
			value: 0,
			min: 0,
			max: 100,
			rate: 0
		},{
			name: "distance",
			displayName: "Distance",
			selectors: {
				val: [".C .val"],
				rate: [".C .rate"]
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
				val: [".I .val"],
				rate: [".I .rate"]
			}, 
			value: 100,
			min: 0,
			max: 100,
			rate: -0.0001
		},{
			name: "gold",
			displayName: "Gold",
			selectors: {},
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


	//==== U.I.

	g.tabs = new RocketBoots.Tabs({
		tabbedContentContainerSelector:		".tabbed-content-container",
		tabbedContentSelector:				"section",
		tabsContainerSelector:				".tabs",
		tabsSelector:						"a",
		selectedClass: 						"selected"
	});
	g.tabs.setup().select("about");



	//==== Start Up

	g.state.transition("preload");

}).init();