const Discord = require("discord.js"),
  config = require("../config/config.json"),
  utils = require("../util"),
  Requesters = require("../models/Requesters");

exports.run = async (client, msg, args) => {
  if (client.admins.indexOf(msg.author.id) > -1) {
    if (args.length === 0) {
      return msg.channel.send("Please specify a user id or mention a user!");
    }
    if (args.length > 1) {
      return msg.channel.send("Too many args");
    }
    if (msg.mentions.members.first()) {
      const user = msg.mentions.members.first();
      let username = user.user.username;
      return addUser(msg, user.id, username).then(async res => {
        await msg.channel.send(res);
      });
    }
    if (isNaN(args[0])) {
      return msg.channel.send("Invalid User ID");
    }
    try {
      const user = await client.fetchUser(args[0]);
      if (user) {
        let username = user.username;
        return addUser(msg, user.id, username).then(async res => {
          await msg.channel.send(res);
        });
      } else {
        return msg.channel.send("Error 25");
      }
    } catch (err) {
      await msg.channel.send(`Error 28: Failed to fetch user!`);
      return console.log(`Error 28: Failed to fetch user!`);
    }
  } else {
    // They cant
    return utils.noPerm(msg);
  }
};

const addUser = async function(msg, id, username) {
  let checkRecord = await Requesters.findOne({
    guildID: msg.guild.id,
    userID: id
  });
  if (checkRecord) {
    return `${username} is already a requester!`;
  }
  const newRequester = new Requesters({
    guildID: msg.guild.id,
    userID: id
  });
  await newRequester.save();
  return `Added Requester ${username}`;
};
