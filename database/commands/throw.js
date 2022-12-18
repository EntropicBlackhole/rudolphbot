const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "Throw",
	description: "Throws a snowball! A snowfight must have started though!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throws a snowball! A snowfight must have started though!'),
	async execute(interaction, client) {
		interaction.deferReply();
		const snowfights = JSON.parse(fs.readFileSync('./database/misc/snowfights.json'))
		if ([{}, undefined].includes(snowfights[interaction.guild.id])) return interaction.reply('There has yet to be a snowfight in this server! Start one with `/snowfight`!');
		let allMembers = await message.guild.members.fetch()
		console.log(allMembers)
	},
};