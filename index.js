"use strict";

// Dependencies
const { Client, Intents } = require("discord.js")

// Variables
const bot = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS ] })
var stopMentioning = {
    token: "",
    maxPings: 5,
    userPings: {}
}

// Main
bot.on("ready", ()=>{
    bot.user.setActivity("Watching for mentioners.")
    console.log("StopMentioning is running.")
})

bot.on("message", (message)=>{
    if(!message.guild) return
    if(message.author.bot) return

    const userID = message.author.id
    const mentions = message.mentions.users

    if(!stopMentioning.userPings[userID]) stopMentioning.userPings[userID] = 0
    mentions.size > 0 ? stopMentioning.userPings[userID]++ : stopMentioning.userPings[userID] = 0

    if(stopMentioning.userPings[userID] >= stopMentioning.maxPings){
        message.channel.send(`Potential spam mention has been detected because of <@${userID}>. The channel has been locked down.`)
        message.channel.permissionOverwrites.create(message.guild.roles.everyone, { SEND_MESSAGES: false })
        stopMentioning.userPings[userID] = 0
    }
})

bot.login(stopMentioning.token)