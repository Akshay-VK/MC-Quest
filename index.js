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
var people ={};

client.on("message",gotMessage);


function gotMessage(msg){
	console.log(msg.content);
	
	var words = msg.content.split(' ');

	var mobs = ["CREEPER","SKELETON","ZOMBIE","ENDERMAN", "ENDER-DRAGON","SPIDER","WITCH","VILLAGER","PARROT","DOG","CAT","SHULKER","WITHER","PIGLIN"];

	if(msg.channel.id === '858225245060333569'){
		if(msg.content === '*rnmob'){
			msg.reply("Your random mob is: "+mobs[Math.floor(Math.random()*mobs.length)]);
		}
		if(msg.content === '*creators'){
			msg.reply("MC Quest was made by 2 simple people who led simple lives. They went by the name of Akshay and Kishan.");
		}
		
		if(words[0] === '*setnick'){
		  	people[msg.author.id] = words[1];
			msg.reply('Your nickname is set to '+words[1]);
		  	console.log(people);
		}
		if(msg.content === '*getnick'){
		  	if(people.hasOwnProperty(msg.author.id)){
			    	msg.reply("Your nickname is "+people[msg.author.id]);
		  	}else{
		    		msg.reply(`You haven't set a nickname yet. To do so, type *setnick (your nickname)`);
		  	}
		}
	}
}
