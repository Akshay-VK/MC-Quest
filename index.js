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

client.on("message",gotMessage);

function gotMessage(msg){
	console.log(msg.content);

	var mobs = ["STEVE","CREEPER","SKELETON","ZOMBIE","ENDERMAN","ALEX","ENDER-DRAGON","SPIDER","WITCH","VILLAGER","PARROT","DOG","CAT","SHULKER","WITHER","PIGLIN"];

	if(msg.content === '*rnmob'){
		msg.reply("Your random mob is: "+mobs[Math.floor(Math.random()*mobs.length)]);
	}
}
