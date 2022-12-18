const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const functions = require('../bot/functions')
const fs = require('fs');
module.exports = {
	name: "Claim",
	description: "Claim your gifts!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claim your gifts from Santa!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const gifts = JSON.parse(fs.readFileSync('./database/misc/gifts.json'))
		if (gifts[interaction.user.id] == undefined) {
			gifts[interaction.user.id] = 0;
			fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
		}
		if (gifts[interaction.user.id] == 0) return interaction.editReply('You don\'t have any gifts to claim, win a snowfight or win a cookie catch to get gifts to claim!')
		let response = await fetch("https://random-memes-api.vercel.app/getmeme");
		let memeObject = await response.json();
		let meme = {
			image: memeObject.image,
			category: memeObject.category,
			caption: memeObject.caption,
			id: memeObject.id
		}
		const memeEmbed = new EmbedBuilder()
			.setTitle(meme.caption)
			.setImage(meme.image)
			.setColor(functions.randomColor())
			.setTimestamp()
			.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });

		if (meme.category != '') memeEmbed.setDescription(meme.category)
		gifts[interaction.user.id] -= 1;
		fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
		return interaction.editReply({ content: `You have: \`${gifts[interaction.user.id]}\` gift${gifts[interaction.user.id] != 1 ? 's': ''} remaining!`, embeds: [memeEmbed] })
	},
};