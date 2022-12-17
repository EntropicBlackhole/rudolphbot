const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "",
	description: "",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('')
		.setDescription(''),
	async execute(interaction, client) {
		await interaction.reply('');
	},
};