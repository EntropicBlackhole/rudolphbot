const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Santa Tracker",
	description: "Tracks Santa across the globe!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction, client) {
		await interaction.reply('');
	},
};