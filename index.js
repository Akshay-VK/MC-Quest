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
	  
	  switch (words[0]){
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
	     setNickname(msg,words);
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
	  }
	}
}

function stopGame(msg){
  var id = msg.author.id;
	if (people[id]['gameState'] == true) {
		people[id]['gameState'] = false;
		msg.reply("Game stopped.");
	} else {
		msg.reply(`You don't have any game running right now...`);
	}
}

function getNickname(msg){
  if (people.hasOwnProperty(msg.author.id) && people[msg.author.id].hasOwnProperty('nickname')) {
		msg.reply("Your nickname is " + people[msg.author.id].nickname);
	} else {
		msg.reply(`You haven't set a nickname yet. To do so, type *setnick (your nickname)`);
	}
}

function setNickname(msg,words){
  people[msg.author.id] = {
		'nickname': words[1]
	};
	msg.reply('Your nickname is set to ' + words[1]);
	console.log(people);
}

function randomMobCommand(msg){
	 msg.reply("Your random mob is: " + mobs[Math.floor(Math.random() * mobs.length)]);
}

function helpCommand(msg){
	msg.channel.send('All commands must be prefixes with a star(*)\n\n**rnmob**-\tDisplays a random mob name\n**nick**-\tDisplays the set nickn    ame\n**setnick**-\tSets a nickname\n**startgame**-\tStarts a new game\n**stopgame**-\tStops the current game\n**creators**-\tDisplays the creators of this bot');
}

function creatorsCommand(msg){
	msg.reply("MC Quest was made by 2 simple people who led simple lives. They went by the name of Akshay and Kishan.");
}

function handleGame(msg) {
	var id = msg.author.id;
	console.log(people);
	if (people[id]['gameState'] == true) {
		msg.reply("Umm..you have a game running. If you want to start a new game, type *stopgame and then start a new game");
	} else {
		people[id]['gameState'] = true;
		var biome = pickRandom(biomes);
		people[id]['currentBiome'] = biome;
		msg.reply("New game started....\nYou spawned in the " + biome + " biome!");


	        //OPTIONS 1

        	msg.channel.send("Now choose what you want to do..\n\na)**Search for trees and punch them**\nb)**Go exploring for another biome**\nc)**Pause the game for now and continue later**\n\nType the option name.For example, a or b or c. (If anything else is typed, the 3rd option will be taken)...");

	        inputCollector(msg,firstOption,(nmsg,collected)=>{console.log('first option ended');});

        	//END OF OPTION 1
	}
}

function firstOption(msg,m){
  var res = m.content;

		if(res === 'a'){
			//SEARCHING FOR TREES
			msg.reply("Now searching for trees...");
		}else if(res === 'b'){
			//EXPLORING...
			optionAnswer = 2;
			msg.reply("The exploration starts now!!!");
		}else {
			//PAUSED
			optionAnswer = 3;
			msg.reply("Game paused.. type *resume");
	    people[msg.author.id]["paused"] = true;
		}
    
}

function inputCollector(msg,onCollect,onEnd){
  function filter(m){
    return m.author.id === msg.author.id;
  }
  const collector = msg.channel.createMessageCollector(filter,{max:1,time:15000});
  collector.on('collect',m=>{
    onCollect(msg,m);
  });
  collector.on('end',collected=>{
    onEnd(msg,collected);
  })
}
