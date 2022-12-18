const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Throw",
	description: "Throws a snowball! A snowfight must have started though!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throws a snowball! A snowfight must have started though!'),
	async execute(interaction, client) {
		await interaction.reply('');
	},
};