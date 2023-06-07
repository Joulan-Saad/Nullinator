const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;



module.exports = {
  data: new SlashCommandBuilder()

    .setName('rat')
    //.setDescription('Gives you random image of a rat!'),
    .setDescription('Bow to the Rat King'),
  async execute(interaction) {
    
    const ratKing = new AttachmentBuilder('./commands/rats/rat_king.gif');
      
    await interaction.reply({ files: [ratKing] });

  },
};

/*
const string = interaction.options.getString('input');
const boolean = interaction.options.getBoolean('bool');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('role');
const integer = interaction.options.getInteger('int');
const number = interaction.options.getNumber('num');
const mentionable = interaction.options.getMentionable('mentionable');
const attachment = interaction.options.getAttachment('attachment');
*/