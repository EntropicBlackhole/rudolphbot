const countries = require("../misc/countries_info.json");
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fetch = require("node-fetch");
const functions = require('../bot/functions');
let url = "https://api.wheretheiss.at/v1/satellites/25544";
let coordsURL = "https://api.wheretheiss.at/v1/coordinates/";

module.exports = {
	name: "Santa Tracker",
	description: "Tracks Santa across the globe!",
	usage: "None",
	data: new SlashCommandBuilder()
		.setName('track-santa')
		.setDescription('Tracks Santa across the globe!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		let data = await fetch(url).then((res) => res.json());
		let { latitude, longitude, altitude, velocity, visibility, footprint } =
			data;

		let coordsData = await fetch(`${coordsURL}${latitude},${longitude}`).then(
			(res) => res.json()
		);
		let { country_code } = coordsData;

		let hoveringCountry = countries.find((n) => n.isoCode === country_code);
		country_code = `:flag_${country_code.toLowerCase()}:`
		if (hoveringCountry?.name == undefined) {
			hoveringCountry = {
				name: "Oceans!"
			}
			country_code = ':ocean:'
		}
		let embed = new EmbedBuilder()
			.setTitle("Santa's Current Location")
			.setDescription(
				`Santa is currently over: **${hoveringCountry?.name
				}** ${country_code}`
			)
			// .setThumbnail(client.user.displayAvatarURL())
			.addFields([
				{
					name: "Latitude:",
					value: `${latitude.toFixed(5)}°`,
					inline: true,
				},
				{
					name: "Longitude:",
					value: `${longitude.toFixed(5)}°`,
					inline: true,
				},
				{
					name: "Velocity:",
					value: `${velocity.toFixed(5)} km/h`,
					inline: true,
				},
				{
					name: "Altitude:",
					value: `${altitude.toFixed(5)} km`,
					inline: true,
				},
				{
					name: "Visibility:",
					value: `${visibility}`,
					inline: true,
				},
				{
					name: "Footprint:",
					value: `${footprint.toFixed(5)}`,
					inline: true,
				},
			])
			.setColor(functions.randomColor())
			.setTimestamp()
			.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
		interaction.followUp({
			embeds: [embed],
		});
	},
};