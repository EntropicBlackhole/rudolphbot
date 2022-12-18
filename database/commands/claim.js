const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Claim",
	description: "Claim your gifts!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claim your gifts from Santa!'),
	async execute(interaction, client) {
		await interaction.reply('');
	},
};