require('dotenv').config();

console.log("Bot starting..");

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOTTOKEN);

console.log('BOT LOGGED IN!!...');

client.on("ready",botReady);

function botReady(){
	console.log("bot ready...");
}

var mobs = ["CREEPER","SKELETON","ZOMBIE","ENDERMAN", "ENDER-DRAGON","SPIDER","WITCH","VILLAGER","PARROT","DOG","CAT","SHULKER","WITHER","PIGLIN"];

var biomes = ["plains","swamps","forest","savanna","taiga","snowy tundra","mesa","jungle"];

var people ={};

client.on("message",gotMessage);

function pickRandom(arr){
	return arr[Math.floor(Math.random()*arr.length)];
}

function gotMessage(msg){
	console.log(msg.content);
	
	var words = msg.content.split(' ');

	if(msg.channel.id === '858225245060333569'){
	  if(msg.content === '*help'){
	    msg.reply('All commands must be prefixes with a star(*)\n\n**rnmob**-\tDisplays a random mob name\n**nick**-\tDisplays the set nickname\n**setnick**-\tSets a nickname\n**startgame**-\tStarts a new game\n**stopgame**-\tStops the current game\n**creators**-\tDisplays the creators of this bot');
	  }
	  //RANDOM MOB
		if(msg.content === '*rnmob'){
			msg.reply("Your random mob is: "+mobs[Math.floor(Math.random()*mobs.length)]);
		}
		//CREATORS
		if(msg.content === '*creators'){
			msg.reply("MC Quest was made by 2 simple people who led simple lives. They went by the name of Akshay and Kishan.");
		}
		//SET NICKNAME
		if(words[0] === '*setnick'){
		  	people[msg.author.id] = {'nickname':words[1]};
			msg.reply('Your nickname is set to '+words[1]);
		  	console.log(people);
		}
		//GET NICKNAME
		if(msg.content === '*nick'){
		  	if(people.hasOwnProperty(msg.author.id) && people[msg.author.id].hasOwnProperty('nickname')){
			    	msg.reply("Your nickname is "+people[msg.author.id].nickname);
		  	}else{
		    		msg.reply(`You haven't set a nickname yet. To do so, type *setnick (your nickname)`);
		  	}
		}
		//START A GAME
		if(msg.content === '*startgame'){
			if(!people.hasOwnProperty(msg.author.id)){
				people[msg.author.id] = {};
			}
			handleGame(msg);
		}
		//STOP A GAME
		if(msg.content === "*stopgame"){
			var id = msg.author.id;
			if(people[id]['gameState'] == true){
				people[id]['gameState'] = false;
				msg.reply("Game stopped.");
			}else{
				msg.reply(`You don't have any game running right now...`);
			}
		}
	}
}

function handleGame(msg){
	var id = msg.author.id;
	console.log(people);
	if(people[id]['gameState'] == true){
		msg.reply("Umm..you have a game running. If you want to start a new game, type *stopgame and then start a new game");
	}else{
		people[id]['gameState'] = true;
		var biome = pickRandom(biomes);
		people[id]['currentBiome'] = biome;
		msg.reply("New game started....\nYou spawned in the "+biome+" biome!");
	}
}
