const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const queue = require('../musicQueue.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the YouTube video')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        if (!ytdl.validateURL(url)) return interaction.reply({ content: 'Please provide a valid YouTube video URL.', ephemeral: true });

        const serverQueue = queue.get(interaction.guildId);

        const songInfo = await ytdl.getInfo(url);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
            const queueContruct = {
                textChannel: interaction.channel,
                voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
                player: createAudioPlayer(),
            };

            queue.set(interaction.guildId, queueContruct);
            queueContruct.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                queueContruct.connection = connection;
                connection.subscribe(queueContruct.player);
                play(interaction.guildId, queueContruct.songs[0]);

                await interaction.reply({ content: `🎶 Now playing: **${song.title}**`, ephemeral: true });
            } catch (err) {
                console.error(err);
                queue.delete(interaction.guildId);
                return interaction.reply({ content: 'There was an error connecting to the voice channel.', ephemeral: true });
            }
        } else {
            serverQueue.songs.push(song);
            return interaction.reply({ content: `✅ **${song.title}** has been added to the queue!`, ephemeral: true });
        }
    },
};

function play(guildId, song) {
    const serverQueue = queue.get(guildId);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guildId);
        return;
    }

    const stream = ytdl(song.url, { filter: 'audioonly' }).on('error', console.error);;
    const resource = createAudioResource(stream);
    serverQueue.player.play(resource);
    serverQueue.player.on('error', console.error);


    serverQueue.player.on(AudioPlayerStatus.Idle, () => {
        serverQueue.songs.shift();
        play(guildId, serverQueue.songs[0]);
    });
    serverQueue.player.on('error', error => console.error(`Error: ${error.message}`));
}
