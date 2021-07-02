require('dotenv').config();

console.log("Bot starting..");

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOTTOKEN);

console.log('BOT LOGGED IN!!...');

client.on("ready", botReady);

function botReady() {
	console.log("bot ready...");
}

var mobs = ["CREEPER", "SKELETON", "ZOMBIE", "ENDERMAN", "ENDER-DRAGON", "SPIDER", "WITCH", "VILLAGER", "PARROT", "DOG", "CAT", "SHULKER", "WITHER", "PIGLIN", "PILLAGER", "HORSE", "PANDA"];

var biomes = ["plains", "swamps", "forest", "savanna", "taiga", "snowy tundra", "mesa", "jungle"];

var people = {};

client.on("message", gotMessage);

function pickRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function gotMessage(msg) {
	console.log(msg.content);

	var words = msg.content.split(' ');

	if (msg.channel.id === '858225245060333569') {

		switch (words[0]) {
			case '*help':
				helpCommand(msg);
				break;
			case '*rnmob':
				randomMobCommand(msg);
				break;
			case '*creators':
				creatorsCommand(msg);
				break;
			case '*setnick':
				setNickname(msg, words);
				break;
			case '*nick':
				getNickname(msg);
				break;
			case '*startgame':
				if (!people.hasOwnProperty(msg.author.id)) {
					people[msg.author.id] = {};
				}
				handleGame(msg);
				break;
			case '*stopgame':
				stopGame(msg);
				break;
			case '*resume':
				resumeGame(msg);
				break;
			case '*inv':
				getInv(msg);
		}
	}
}

function resumeGame(msg) {
	if (people.hasOwnProperty(msg.author.id)) {
		if (people[msg.author.id]["paused"]) {
			//CASES
			switch (people[msg.author.id]['landmark']) {
				case 'first-option':
					msg.channel.send("Game resumed...\n\nNow choose what you want to do..\n\na)**Search for trees and punch them**\nb)**Go exploring for another biome**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

					inputCollector(msg, firstOption, (nmsg, collected) => {
						if (collected.size < 1) {
							giveReply(msg, "No input provided, game stopped.");
							stopGame(msg);
						}
					});
					break;
				case 'village-found':
					msg.channel.send("Game resumed...\n\nHey,remember that village you found...\n\n Now choose what you want to do:\n\na)**Loot the village**\nb)**Start mining**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

					inputCollector(msg, villageFound, (nmsg, collected) => {
						if (collected.size < 1) {
							giveReply(msg, "No input provided, game stopped.");
							stopGame(msg);
						}
					});
					break;
				case 'village-not-found':
					msg.channel.send("Game resumed...\n\nNow choose what you want to do:\n\na)**Go hunting...**\nb)**Start mining**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

					inputCollector(msg, villageNotFound, (nmsg, collected) => {
						if (collected.size < 1) {
							giveReply(msg, "No input provided, game stopped.");
							stopGame(msg);
						}
					});
					break;
				case 'the-choice-before-the-mine':
					msg.channel.send("Now choose what you want to do:\n\na)**Go mining**\nb)**Stake out for the night and mine in the morning**\nc)**Pause for now and resume later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

					//mine or stake out for the night and the nmine
					inputCollector(msg, theChoiceBeforeTheMine, (nmsg, collected) => {
						if (collected.size < 1) {
							giveReply(msg, "No input provided, game stopped.");
							stopGame(msg);
						}
					});
					break;
			}
		}
	} else {
		people[msg.author.id] = {};
		giveReply(msg, "Umm.. you don't have any paused game.");
	}
}

function stopGame(msg) {
	if (people.hasOwnProperty(msg.author.id)) {
		var id = msg.author.id;
		if (people[id].hasOwnProperty('gameState') && people[id]['gameState'] == true) {
			people[id]['gameState'] = false;
			people[id]['hungry'] = false;
			people[id]['landmark'] = '';
			people[id]['paused'] = false;
			giveReply(msg, 'Game stopped.');
		} else {
			giveReply(msg, `You don't have any game running right now...`);
		}
	} else {
		people[id] = {};
		giveReply(msg, `You don't have any game running right now...`);
	}
	console.log(people);
}

function getNickname(msg) {
	if (people.hasOwnProperty(msg.author.id) && people[msg.author.id].hasOwnProperty('nickname')) {
		msg.reply("Your nickname is " + people[msg.author.id].nickname);
	} else {
		msg.reply(`You haven't set a nickname yet. To do so, type *setnick (your nickname)`);
	}
}

function setNickname(msg, words) {
	people[msg.author.id] = {
		'nickname': words[1]
	};
	msg.reply('Your nickname is set to ' + words[1]);
	console.log(people);
}

function randomMobCommand(msg) {
	msg.reply("Your random mob is: " + mobs[Math.floor(Math.random() * mobs.length)]);
}

function helpCommand(msg) {
	msg.channel.send('All commands must be prefixes with a star(*)\n\n**rnmob**-\t\tDisplays a random mob name\n**nick**-\t\tDisplays the set nickname\n**setnick**-\t\tSets a nickname\n**startgame**-\t\tStarts a new game\n**stopgame**-\t\tStops the current game\n**inv**\t\tShows your inventory\n**creators**-\t\tDisplays the creators of this bot');
}

function creatorsCommand(msg) {
	msg.reply("MC Quest was made by 2 simple people who led simple lives. They went by the name of Akshay and Kishan.");
}

function handleGame(msg) {
	var id = msg.author.id;
	console.log(people);
	if (people[id]['gameState'] == true) {
		giveReply(msg, "Umm..you have a game running. If you want to start a new game, type *stopgame and then start a new game");
	} else {
		people[id]['gameState'] = true;
		var biome = pickRandom(biomes);
		people[id]['currentBiome'] = biome;
		giveReply(msg, "New game started....\nYou spawned in the " + biome + " biome!");
		people[id]['inventory'] = {};

		//OPTIONS 1

		msg.channel.send("Now choose what you want to do..\n\na)**Search for trees and punch them**\nb)**Go exploring for another biome**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

		inputCollector(msg, firstOption, (nmsg, collected) => {
			if (collected.size < 1) {
				giveReply(msg, "No input provided, game stopped.");
				stopGame(msg);
			}
		});

		//END OF OPTION 1
	}
}

function firstOption(msg, m) {
	var res = m.content;

	if (res === 'a' || res === 'A') {
		//SEARCHING FOR TREES
		msg.channel.send("Now searching for trees...");

		var apples = Math.floor((Math.random() + 0.1) * 11)

		msg.channel.send("You found trees and crafted up some tools.\n\nAnd while you were at it you also got " + apples + " apples.");

		people[msg.author.id]["inventory"]["wooden-sword"] = 1;
		people[msg.author.id]["inventory"]["wooden-pickaxe"] = 1;
		people[msg.author.id]["inventory"]["wooden-shovel"] = 1;
		people[msg.author.id]["inventory"]["wooden-axe"] = 1;
		people[msg.author.id]["inventory"]["apples"] = apples;

		if (Math.random() < 0.3) {
			msg.channel.send("Oh my god! Is that a village! Now choose what you want to do:\n\na)**Loot the village**\nb)**Start mining**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

			inputCollector(msg, villageFound, (nmsg, collected) => {
				if (collected.size < 1) {
					giveReply(msg, "No input provided, game stopped.");
					stopGame(msg);
				}
			});
		} else {
			msg.channel.send("Now choose what you want to do:\n\na)**Go hunting...**\nb)**Start mining**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

			inputCollector(msg, villageNotFound, (nmsg, collected) => {
				if (collected.size < 1) {
					giveReply(msg, "No input provided, game stopped.");
					stopGame(msg);
				}
			});
		}


	} else if (res === 'b' || res === 'B') {
		//EXPLORING...
		giveReply(msg, "The exploration starts now!!!");

		if (people[msg.author.id]['hungry'] && Math.random() < 0.35) {
			msg.channel.send('You were starving...a bit too much..so...\n\n\nYou died.☠☠');
			stopGame(msg);
			return;
		}

		var newBiome = pickRandom(biomes);

		people[msg.author.id]['currentBiome'] = newBiome;
		msg.channel.send('You went on exploring, and reached the ' + newBiome + ' biome..');

		if (Math.random() > 0.5) {
			msg.channel.send('And it seems that you have gotten hungry...');
			people[msg.author.id]['hungry'] = true;
		}

		msg.channel.send("Now choose what you want to do..\n\na)**Search for trees and punch them**\nb)**Go exploring for another biome**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

		inputCollector(msg, firstOption, (nmsg, collected) => {
			if (collected.size < 1) {
				giveReply(msg, "No input provided, game stopped.");
				stopGame(msg);
			}
		});

	} else {
		//PAUSED
		giveReply(msg, "Game paused.. type *resume");
		people[msg.author.id]["paused"] = true;
		people[msg.author.id]["landmark"] = 'first-option';
	}

}

function villageFound(msg, m) {
	if (m.content === 'a' || m.content === 'A') {
		//RAID VILLAGE
		raidVillage(msg);
	} else if (m.content === 'b' || m.content === 'B') {
		//START MINING
		theMine(msg);
	} else {
		//PAUSED
		giveReply(msg, "Game paused.. type *resume");
		people[msg.author.id]["paused"] = true;
		people[msg.author.id]["landmark"] = 'village-found';
	}
}

function villageNotFound(msg, m) {
	if (m.content === 'a' || m.content === 'A') {
		//HUNTING...
		hunting(msg);
	} else if (m.content === 'b' || m.content === 'B') {
		//STARTING TO MINE
		theMine(msg);
	} else {
		//PAUSED
		giveReply(msg, "Game paused.. type *resume");
		people[msg.author.id]["paused"] = true;
		people[msg.author.id]["landmark"] = 'village-not-found';

	}
}

function hunting(msg) {
	var huntedItems = [];
	var huntedItemQuantity = [];
	if (Math.random() > 0.4) {
		var numOfItems = addItemToInv(msg.author.id, 'pork', 11, true);
		huntedItems.push("pork");
		huntedItemQuantity.push(numOfItems);
	}
	if (Math.random() > 0.7) {
		var numOfItems = addItemToInv(msg.author.id, 'leather', 3, true);
		huntedItems.push("leather");
		huntedItemQuantity.push(numOfItems);
	}
	displayItems(msg, huntedItems, huntedItemQuantity, "You went hunting and came back empty handed.", 'You went hunting and caught..');

	msg.channel.send("Oh my god! Is that a village! Now choose what you want to do:\n\na)**Loot the village**\nb)**Start mining**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

	inputCollector(msg, villageFound, (nmsg, collected) => {
		if (collected.size < 1) {
			msg.channel.send('No input provided.. game stopped.');
			stopGame(msg);
		}
	});
}

function theMine(msg) {
	msg.channel.send("Starting to mine...");
}

function raidVillage(msg) {
	msg.channel.send("Raiding village...");

	var items = [];
	var itemQuant = [];
	//shears
	if (Math.random() > 0.4) {
		items.push("shears");
		itemQuant.push(addItemToInv(msg.author.id, 'shears', 2, true));
	}
	//wheat
	if (Math.random() > 0.1) {
		items.push("wheat");
		itemQuant.push(addItemToInv(msg.author.id, 'wheat', 33, true));
	}
	//leather armour
	if (Math.random() > -1) {
		items.push("leather-armour");
		itemQuant.push(addItemToInv(msg.author.id, 'leather-armour', 1, true, true));
	}
	//beds
	if (Math.random() > -1) {
		items.push("bed");
		itemQuant.push(addItemToInv(msg.author.id, 'bed', 1, true, true));
	}
	//bread
	if (Math.random() > 0.1) {
		items.push("bread");
		itemQuant.push(addItemToInv(msg.author.id, 'bread', 17, true));
	}
	//emeralds
	if (Math.random() > 0.7) {
		items.push("emeralds");
		itemQuant.push(addItemToInv(msg.author.id, 'emeralds', 6, true));
	}
	//flint
	if (Math.random() > 0.2) {
		items.push("flint");
		itemQuant.push(addItemToInv(msg.author.id, 'flint', 17, true));
	}
	//raw beef
	if (Math.random() > 0.3) {
		items.push("raw-beef");
		itemQuant.push(addItemToInv(msg.author.id, 'raw-beef', 2, true));
	}

	displayItems(msg, items, itemQuant, "The villagers chased you away...", 'You raided the village and got...');

	msg.channel.send("Now choose what you want to do:\n\na)**Go mining**\nb)**Stake out for the night and mine in the morning**\nc)**Pause for now and resume later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

	//mine or stake out for the night and the nmine
	inputCollector(msg, theChoiceBeforeTheMine, (nmsg, collected) => {
		if (collected.size < 1) {
			giveReply(msg, "No input provided, game stopped.");
			stopGame(msg);
		}
	});
}

function theChoiceBeforeTheMine(msg, m) {
	if (m.content === 'a' || m.content === 'A') {
		//Go mining
		theMine(msg);
	} else if (m.content === 'b' || m.content === 'B') {
		//Stake out
		stakeOut(msg);
	} else {
		//PAUSED
		giveReply(msg, "Game paused.. type *resume");
		people[msg.author.id]["paused"] = true;
		people[msg.author.id]["landmark"] = 'the-choice-before-the-mine';
	}
}

function stakeOut(msg) {
	msg.channel.send("Alright...good night!!( I hope ) .... zzzzZZZ");
}

function getInv(msg) {
	if (people.hasOwnProperty(msg.author.id) && people[msg.author.id].hasOwnProperty('inventory') && people[msg.author.id]['inventory'] != {}) {
		//display inv
		var items = Object.keys(people[msg.author.id]['inventory']);
		var res = 'Ýour inventory:\n\n';
		for (var i = 0; i < items.length; i++) {
			res += getEmoji(items[i]) + '\t**' + items[i] + '**\t\t*' + people[msg.author.id]['inventory'][items[i]] + '*\n\n';
		}
		giveReply(msg, res);

	} else {
		giveReply(msg, "Your inventory is empty");
	}
}

function getEmoji(inp) {
	switch (inp) {
		case 'wooden-pickaxe':
			return "<:woodpik:860396585774088212>";
			break;
		case 'wooden-axe':
			return "<:woodaxe:860396749154680862>";
			break;
		case 'wooden-sword':
			return "<:woodsword:860396654179385345>";
			break;
		case 'apples':
			return "<:apple:860396715215421440>";
			break;
		case 'wooden-shovel':
			return '<:woodshowel:860407397892489216>';
			break;
		default:
			return "";
			break;

	}
}

function inputCollector(msg, onCollect, onEnd) {
	function filter(m) {
		return m.author.id === msg.author.id;
	}
	const collector = msg.channel.createMessageCollector(filter, {
		max: 1,
		time: 60000
	});
	collector.on('collect', m => {
		onCollect(msg, m);
	});
	collector.on('end', collected => {
		onEnd(msg, collected);
	})
}

function giveReply(msg, text) {
	if (people.hasOwnProperty(msg.author.id) && people[msg.author.id].nickname != undefined) {
		msg.channel.send(people[msg.author.id].nickname + ', ' + text);
	} else {
		msg.reply(text);
	}
}

function addItemToInv(id, itemname, multVal, ret, compulsory) {
	var numOfItems;
	if (!compulsory) {
		numOfItems = Math.floor(Math.random() * multVal);
	} else {
		numOfItems = multVal;
	}
	if (!people[id].hasOwnProperty('inventory')) {
		people[id]['inventory'] = {};
	}
	if (people[id]['inventory'].hasOwnProperty(itemname)) {
		people[id]['inventory'][itemname] += numOfItems;
	} else {
		people[id]['inventory'][itemname] = numOfItems;
	}
	if (ret) {
		return numOfItems;
	}
}

function displayItems(msg, items, itemQuantity, ifEmptyMsg, ifNotEmptyMsg) {
	if (items.length < 1) {
		giveReply(msg, "ifEmptyMsg");
	} else {
		var rep = ifNotEmptyMsg + '\n\n';
		console.log(items, itemQuantity);

		for (var i = 0; i < items.length; i++) {
			if (itemQuantity[i] != 0) {
				rep = rep.concat(" **", items[i], "** : ", itemQuantity[i], "\n");
			}
		}
		rep = rep.concat("\n\n");

		console.log(people);
		giveReply(msg, rep);
	}
}
