var Adventure;
(function ($, Adventure) {
    'use strict';

    (function (Stories) {
        var newStory = {
			title: 'Your Title',
			titleSubtext: 'Subtitle',
			author: 'Author',
			canStepBack: true,
			variables: {},
			labelGroups: [],
			pages: [{id: 0, pageText: 'Create your very own "Choose your own adventure"! <br/><br/>This is your first page, now <b>edit this page</b> and create a story!', choices:[]}]
		};
		
		var tutorial = {
			"title": "Demo",
			"author": "Matthew Gold",
			"titleSubtext": "Welcome to Adventure Engine",
			"canStepBack": true,
			"variables" : {
				"Key" : false,
				"Gold" : 0,
				"FinishedIntro":false,
				"Jacket": false,
				"Riddle": false,
				"Naked": false,
				"Chest":false
			 },
			"labelGroups": [{
				"color" : "Red",
				"name" : "Inventory",
				"seq" : 1,
				"labels": [{
				 "name":"Secret Key",
				 "variableName": "Key",
				 "icon":"fa-key",
				 "requirements" : [{
								"variableName": "Key",
								"condition": "=",
								"value": true
							}]
				 },{
				 "variableName":"Gold",
				 "name":"Gold",
				 "icon":"fa-circle",
				 "requirements" : [{
								"variableName": "Gold",
								"condition": ">",
								"value": -1
							},{
								"variableName": "FinishedIntro",
								"condition": "=",
								"value": true
							}]
				 },{
				 "variableName":"Jacket",
				 "name":"Warm Jacket",
				 "icon":"fa-user",
				 "requirements" : [{
								"variableName": "Jacket",
								"condition": "=",
								"value": true
							},{
								"variableName": "Naked",
								"condition": "!",
								"value": true
							}]
				 }]
			}],
			"pages": [
				{
					"id": 0,
					"pageText": "This is a demo of the various capabilities of the Adventure Engine. Click the button below to get started.",
					"choices": [
						{
							"caption": "Begin",
							"nextPage": 1,
							"isSecret": false
						}
					]
				},
				{
					"id": 1,
					"pageText": "You find yourself in a room with a locked door. What you are reading right now is the <b>story</b> for this page. The button below is a <b>choice</b>. Clicking on a choice will take you to a new page. ",
					"choices": [
						{
							"caption": "Examine the door",
							"nextPage": 2,
							"isSecret": false
						}
					]
				},
				{
					"id": 2,
					"pageText": "You try the handle and discover that the door is locked. You will need to find the key before you can pass through. <p>This is called a <b>requirement</b>. If you find the key on another page, then the option to unlock the door will become available.</p>",
					"choices": [
						{
							"caption": "Search for the key",
							"nextPage": 3,
							"isSecret": false
						},{
							"caption": "Unlock the door with your key",
							"nextPage": 5,
							"isSecret": false,
					"requirements": [{
								"variableName": "Key",
								"condition": "=",
								"value": true
							}],
							"commands" : [
							 {
							  "variableName": "Key",
							  "operation":"=",
							  "value": false
							 }]
						}
					]
				},
				{
					"id": 3,
					"pageText": "Now let's collect the key. The choice below is configured to set a <b>variable</b> to true. An adventure can have any number of variables. You can use variables to specify <b>requirements</b> for different choices in order to give your adventure a dynamic structure. </br></br> Now that you know a bit about how variables work, click the choice below to collect the key.</p>",
					"choices": [
						{
							"caption": "Collect the key",
							"nextPage": 4,
							"isSecret": false,
							"commands": [{
							  "variableName": "Key",
							  "operation":"=",
					  "value":true 
							 }]
							
						}
					]
				},
			{
					"id": 4,
					"pageText": "You found the key! <br/>Your <b>inventory</b> now reflects that the key variable has been set. The icon that popped up in your inventory is called a <b>label</b>. Variables normally operate behind the scenes, but for things like inventory you can create a <b>label</b> and assign the <b>requirements</b> that need to be met in order for the <b>label</b> to be displayed. <br/><br/>In this case, our \"Secret Key\" label is configured to be displayed when our key variable is set to true.</br></br>Now lets head back to the first page of the tutorial. Don't worry, you will keep your key.",
					"choices": [
						{
							"caption": "Head back",
							"nextPage": 1,
							"isSecret": false
							
						}
					]
				},
		{
					"id": 5,
					"pageText": "You made it through the door. In the next section we will use all of the features of the engine together to create an adventure.",
					"choices": [
						{
							"caption": "Continue",
							"nextPage": 6,
							"isSecret": false
							
						}
					]
				},{
					"id": 6,
					"pageText": "You are trapped on a mysterious island. You must explore the island to get home.",
					"choices": [
						{
							"caption": "Continue",
							"nextPage": 7,
							"isSecret": false,
							"commands": [{
							  "variableName": "FinishedIntro",
							  "operation":"=",
					  "value":true 
							 }]
							
						}
					]
				},{
					"id": 7,
					"pageText": "There is a winter chill in the air. You need to ride the ferry to get home. With [[Gold]] Gold in your pocket, You find yourself at a crossroads. ",
					"choices": [
						{
							"caption": "Approach the ferry",
							"nextPage": 8,
							"isSecret": false
							
						},{
							"caption": "Head into the forest",
							"nextPage": 10,
							"isSecret": false,
							"requirements": [{
								"variableName": "Riddle",
								"condition": "!",
								"value": true
							}]
							
						},{
							"caption": "Talk to the naked man",
							"nextPage": 12,
							"isSecret": false,
							"requirements": [{
								"variableName": "Naked",
								"condition": "!",
								"value": true
							}]
							
						},{
							"caption": "Head to the hall of mirrors",
							"nextPage": 14,
							"isSecret": false
							
						}
					]
				},{
					"id": 8,
					"pageText": "You approach the dock and are stopped by the ferry captain at the entrance. <p>\"Tickets are 100 Gold.\" he says.</p>",
					"choices": [
						{
							"caption": "Buy a ticket",
							"nextPage": 9,
							"isSecret": false,
							"requirements": [{
								"variableName": "Gold",
								"condition": ">",
								"value": 99
							}],
							"commands": [{
							  "variableName": "Gold",
							  "operation":"-",
					  "value": 100 
							 }]
							
						},{
							"caption": "Head back into the island",
							"nextPage": 7,
							"isSecret": false
							
						}
					]
				},{
					"id": 9,
					"pageText": "You hand the captain 100 gold and he steps aside. Within moments the ferry sets off, and you begin your journey home. That wraps up the tutorial!",
					"choices": [
						{
							"caption": "Restart",
							"nextPage": 0,
							"isSecret": false,
							"commands": [{
							  "variableName": "Gold",
							  "operation":"=",
							  "value": 0 
							 },
							 {
							  "variableName": "Naked",
							  "operation":"=",
							  "value": false
							 },
							 {
							  "variableName": "Riddle",
							  "operation":"=",
							  "value": false
							 },
							 {
							  "variableName": "FinishedIntro",
							  "operation":"=",
							  "value": false
							 },
							 {
							  "variableName": "Jacket",
							  "operation":"=",
							  "value": false
							 },
							 {
							  "variableName": "Chest",
							  "operation":"=",
							  "value": false
							 }]
						}
					]
				},{
					"id": 10,
					"pageText": "You head down a dirt path which leads into a grove of trees. A voice from a nearby bush calls out. <p>\"The man who invented it doesn't want it. The man who bought it doesn't need it. The man who needs it doesn't know it. What is it?\"</p>",
					"choices": [
						{
							"caption": "coffin",
							"nextPage": 11,
							"isSecret": false,
							"input" : true
						},{
							"caption": "Give up and head back out the forest.",
							"nextPage": 7,
							"isSecret": false
						}
						
					]
				},{
					"id": 11,
					"pageText": "You hear a satisfied grunt from within the bush. Several gold pieces fall from a tree branch nearby.",
					"choices": [
						{
							"caption": "Collect the gold and head back.",
							"nextPage": 7,
							"isSecret": false,
							"commands": [{
							  "variableName": "Gold",
							  "operation":"+",
					  "value": 30 
							 },{
							  "variableName": "Riddle",
							  "operation":"=",
					  "value": true 
							 }]
						}
						
					]
				},{
					"id": 12,
					"pageText": "A naked man is shivering in the cold. <p>\"I w-w-would pay g-g-GOOD money f-for a j-j-jacket right now!\"</p>",
					"choices": [
						{
							"caption": "Offer your jacket",
							"nextPage": 13,
							"isSecret": true,
							"requirements": [{
								"variableName": "Jacket",
								"condition": "=",
								"value": true
							}]
						},{
							"caption": "Shrug? Turn back.",
							"nextPage": 7,
							"isSecret": false
						}
						
					]
				},{
					"id": 13,
					"pageText": "The man tosses you some gold and takes your jacket. <p>\"Thanks!\"</p>",
					"choices": [
						{
							"caption": "Grab the gold and head back.",
							"nextPage": 7,
							"isSecret": false,
							"commands": [{
							  "variableName": "Gold",
							  "operation":"+",
					  "value": 50 
							 },{
							  "variableName": "Naked",
							  "operation":"=",
					  "value": true 
							 }]
						}
						
					]
				},{
					"id": 14,
					"pageText": "Giant mirrors surround you on each side.",
					"choices": [
						{
							"caption": "Go Left",
							"nextPage": 15,
							"isSecret": false,
							"requirements": [{
								"variableName": "Chest",
								"condition": "!",
								"value": true
							}]
						},{
							"caption": "Go Right",
							"nextPage": 17,
							"isSecret": false,
							"requirements": [{
								"variableName": "Jacket",
								"condition": "!",
								"value": true
							}]
						},{
							"caption": "Leave the hall of mirrors.",
							"nextPage": 7,
							"isSecret": false
						}]
				},{
					"id": 15,
					"pageText": "You stumble through the labyrinth for awhile, and eventually you reach a dead end with a chest sitting on the floor.",
					"choices": [
						{
							"caption": "Open the chest",
							"nextPage": 16,
							"isSecret": false,
							"commands": [{
							  "variableName": "Gold",
							  "operation":"+",
					  "value": 30 
							 },{
							  "variableName": "Chest",
							  "operation":"=",
					  "value": true 
							 }]
						}
						
					]
				},{
					"id": 16,
					"pageText": "You find 30 gold inside the chest! There doesn't seem to be anything else of interest nearby.",
					"choices": [
						{
							"caption": "Go back",
							"nextPage": 14,
							"isSecret": false
						}
						
					]
				},{
					"id": 17,
					"pageText": "You head to the right. You quickly become disoriented as your image reflects endlessly in every direction. You come to a dead end, where you find a jacket.",
					"choices": [
						{
							"caption": "Take the Jacket",
							"nextPage": 18,
							"isSecret": false,
							 "commands": [{
							  "variableName": "Jacket",
							  "operation":"=",
					  "value": true 
							 }]
						}
						
					]
				},{
					"id": 18,
					"pageText": "You grab the jacket. There is nothing else to do here.",
					"choices": [
						{
							"caption": "Turn around",
							"nextPage": 14,
							"isSecret": false
						}
						
					]
				}
			]
		};
		
		Stories.New = newStory;
		Stories.Tutorial = tutorial;
    })(Adventure.Stories || (Adventure.Stories = {}));
})(jQuery, Adventure || (Adventure = {}));