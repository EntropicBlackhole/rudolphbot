const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Snowfight",
	description: "Starts a snowfight in the server! Throw snowballs!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction, client) {
		await interaction.reply('');
	},
};