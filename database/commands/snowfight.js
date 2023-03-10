const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: "Snowfight",
	description: "Starts a snowfight in the server! Throw snowballs!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('snowfight')
		.setDescription('Starts a snowfight in the server! Throw snowballs!'),
	async execute(interaction) {
		await interaction.deferReply();
		const snowfights = JSON.parse(fs.readFileSync('./database/misc/snowfights.json'))
		if (![{}, undefined].includes(snowfights[interaction.guild.id])) return interaction.editReply('There\'s already a snowfight going on! Throw snowballs with `/throw`!')
		let newSnowfight = {
			thrownSnowballs: {},
			count: 0
		}
		snowfights[interaction.guild.id] = newSnowfight
		fs.writeFileSync('./database/misc/snowfights.json', JSON.stringify(snowfights, null, 2))
		return interaction.editReply('A snowfight has broken out! Throw snowballs at everyone with `/throw`, the person who throws the most wins!')
	},
};