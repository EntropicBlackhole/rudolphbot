const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const functions = require('../bot/functions')
const fs = require('fs');
const { random } = require('random-memes');

module.exports = {
	name: "Throw",
	description: "Throws a snowball! A snowfight must have started though!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('throw')
		.setDescription('Throws a snowball! A snowfight must have started though!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const snowfights = JSON.parse(fs.readFileSync('./database/misc/snowfights.json'))
		if ([{}, undefined].includes(snowfights[interaction.guild.id])) return interaction.editReply('There has yet to be a snowfight in this server! Start one with `/snowfight`!');
		if (snowfights[interaction.guild.id].count > 24) {
			const gifts = JSON.parse(fs.readFileSync('./database/misc/gifts.json'))
			const sortable = Object.fromEntries(Object.entries(snowfights[interaction.guild.id].thrownSnowballs).sort(([, a], [, b]) => a - b));
			let description = '';
			for (player in sortable) description += `${client.guilds.cache.get(interaction.guild.id).members.cache.get(player).user.username}: ${sortable[player]}`
			const leaderboardEmbed = new EmbedBuilder()
				.setTitle('Snowfight leaderboard')
				.setDescription(description)
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			delete snowfights[interaction.guild.id];
			if (gifts[Object.keys(sortable)[0]] == undefined) {
				gifts[Object.keys(sortable)[0]] = 0;
				fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
			}
			let randomAmtOfGifts = Math.round(Math.random() * 5) + 1;
			gifts[Object.keys(sortable)[0]] += randomAmtOfGifts;
			fs.writeFileSync('./database/misc/snowfights.json', JSON.stringify(snowfights, null, 2));
			fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
			return interaction.editReply({ content: `Snowfight has ended! ${client.guilds.cache.get(interaction.guild.id).members.cache.get(Object.keys(sortable)[0]).user.username} gets \`${randomAmtOfGifts}\` gift${randomAmtOfGifts != 1 ? 's' : ''}`, embeds: [leaderboardEmbed] })
		}
		let allMembers = Array.from(await interaction.guild.members.fetch())
		let randomUser = allMembers[Math.floor(Math.random() * allMembers.length)];
		console.log(randomUser)
		snowfights[interaction.guild.id].thrownSnowballs[interaction.user.id] = (snowfights[interaction.guild.id].thrownSnowballs[interaction.user.id] == undefined ? 1 : snowfights[interaction.guild.id].thrownSnowballs[interaction.user.id] + 1)
		snowfights[interaction.guild.id].count += 1;
		fs.writeFileSync('./database/misc/snowfights.json', JSON.stringify(snowfights, null, 2));
		return interaction.editReply(`${interaction.user.username} has thrown a snowball at ${randomUser[1].user.username}! ${randomUser[1]} must throw one back!`)
	},
};