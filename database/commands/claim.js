const { SlashCommandBuilder } = require('discord.js');
const memes = require('random-memes')
module.exports = {
	name: "Claim",
	description: "Claim your gifts!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claim your gifts from Santa!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		let meme = await memes.random()
		const memeEmbed = new EmbedBuilder()
			.setTitle(meme.caption)
			.setDescription(meme.category)
			.setImage(meme.image)
			.setColor(functions.randomColor())
			.setTimestamp()
			.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
		return interaction.editReply({ embeds: [memeEmbed] })
	},
};