const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Use this command to request server entry')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for joining the server')
                .setRequired(true)),
    async execute(interaction) {
        const reason = interaction.options.getString('reason');
        const member = interaction.member;

        // Check if user already has a role
        if (member.roles.cache.size > 1) {
            return interaction.reply({ content: 'You are already verified.', ephemeral: true });
        }

        // Get the moderator channel
        const modChannel = interaction.guild.channels.cache.find(channel => channel.name === 'new-member-verification');
        if (!modChannel) {
            return interaction.reply({ content: 'Application channel not found. Please contact the server admins (HCE or Esteem)', ephemeral: true });
        }

        if (!reason) {
            return interaction.reply({ content: 'Reason not provided.', ephemeral: true });
        }

        // Create an embed with the user information
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('New Verification Request')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Username', value: `${member.user.tag}`, inline: true },
                { name: 'Joined Server', value: `${moment(member.joinedAt).format('LLLL')}`, inline: true },
                { name: 'Reason for Joining', value: reason, inline: false },
                { name: 'Time of Request', value: `${moment().format('LLLL')}`, inline: false },
            );

        // Create buttons for the moderators
        const approveButton = new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success);

        const denyButton = new ButtonBuilder()
            .setCustomId('deny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger);

        const denyWithReasonButton = new ButtonBuilder()
            .setCustomId('deny_with_reason')
            .setLabel('Deny with Reason')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(approveButton, denyButton, denyWithReasonButton);

        // Send the embed and buttons to the moderator channel
        await modChannel.send({ embeds: [embed], components: [row] });

        // Acknowledge the user's request
        await interaction.reply({ content: 'Your request has been sent to the moderators.', ephemeral: false });
    },
};
