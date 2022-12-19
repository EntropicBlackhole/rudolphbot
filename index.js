const fs = require('node:fs'); //fs constant to read/write files
const path = require('node:path'); //path handler
const { Client, Events, GatewayIntentBits, Routes, REST, Collection, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
// ^ are all the things im importing from discord.js
const config = require("./database/bot/config.json"); //The config file, here I keep the token and the ID of the bot
const functions = require("./database/bot/functions");
const talkedRecently = new Set(); //This is for cooldowns if youre doing message based commands instead of / commands
const cookieWords = ['xmas', 'cookie', '25', 'elves', 'red', 'green', 'milk', 'claus']
//Setting up the client with the required intents:
const client = new Client({ //The Client class is different to the client variable, everything here is case sense
	intents: [ //Intents array
		GatewayIntentBits.Guilds, //To see what guilds I'm in
		GatewayIntentBits.GuildMessages, //To see the messages in a guild
		GatewayIntentBits.GuildMembers, //To see guild members (different from users)
		GatewayIntentBits.MessageContent, //Able to see the message content
	]
});
client.login(config.token)
//Here, with the client, we login using the bot token
//You might be wondering why I'm converting the client id to base 64

//Long story short, part of the bot token is the bots id but in base 64, and when uploading your code online
//To github or to your repository, discord resets your token because it found it online
//To avoid this, I just separate the token and config.token contains the second half of it
//config.clientID contains the bots id, and is passing it to base 64, puts it next to the other half of
//The token and bam, you have the full token
//What a mouthful to login

//How do i do strikethrough in js comments
//Well apparently this is not allowed so I'll just use gitignore 
//instead like a normal person and then pass the token through 
//a usb to my home server. Like a normal. Person


const commands = []; //commands array
const commandsPath = path.join(__dirname, './database/commands'); //path to the commands folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //filter out non .js files
client.commands = new Collection(); //not sure what this is but it's a discord collection, don't mind it

for (const file of commandFiles) { //For loop, looping through the files of commandFiles which is in line 33
	const filePath = path.join(commandsPath, file); //just basically does database/commands/command.js
	//Just that in some other OS's the separator is different like a \ or a -, this solves that automatically
	const command = require(filePath); //Imports the command
	commands.push(command.data.toJSON()); //adds the command data to the commands array from line 31
	client.commands.set(command.data.name, command); //sets the command as one of the bots commands, first step is done
}

//Don't ask what rest is you'll cry at the knowledge of it
const rest = new REST({ version: '10' }).setToken(config.token);
//Just puts the commands into the bot, second part done
rest.put(Routes.applicationCommands(config.clientID), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

//Once the bot is online, say that its online
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => { //executing commands
	if (interaction.isChatInputCommand()) { //If it's a slash command
		const command = interaction.client.commands.get(interaction.commandName); //Basically grab the command
		if (!command) return;
		try {
			await command.execute(interaction, client); //And try to execute it
		} catch (error) { 
			//If theres an error, don't kill the process, catch it and console.error it
			console.error(error);
			const row = new ActionRowBuilder() 
			//Make an actionrow, basically a row of components which 
			//could be buttons, menus, etc, basically the fancy new stuff discord has came out with 
				.addComponents(
					new ButtonBuilder()//Make a button onto the actionrow
						.setCustomId('show-error') //Set its customId as show-error
						.setLabel('Show error log') //Set its label as Show Error Log
						.setStyle(ButtonStyle.Danger), //It's style as a red danger button
				);
			if (interaction.deferred == false) { //you don't need to learn about this right now
				await interaction.deferReply(); //nor this
			}
			//Then reply with this, showing the button, this is what shows with the red button
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true, components: [row] });

			client.on('interactionCreate', async i => { //Then listen for the button press
				if (!i.isButton()) return; //Is it A button? If so
				if (i.customId == 'show-error') { //Is its custom ID show-error? If so
					await interaction.followUp({ content: '```' + error + '```', ephemeral: true });
					//respond with what the error was
				}
			});
		}
	}
	//almost there don't die on me
	else if (interaction.isAutocomplete()) { 
		//Theres an option for autocomplete when creating a stringOption
		//For slash commands, this is where we execute it
		const command = interaction.client.commands.get(interaction.commandName); //Get the command again

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try { //Try to run the automcomplete inside the command
			await command.autocomplete(interaction);
		} catch (error) { //If an error happens, don't kill the process, catch the error, console.error it
			console.error(error);
		}
	}
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	const catchers = JSON.parse(fs.readFileSync('./database/misc/cookie_catchers.json'))
	if (catchers[message.guild.id] == undefined)
		catchers[message.guild.id] = {
			count: 0,
			hasStarted: false,
			caught: {}
		}
	if (catchers[message.guild.id].caught[message.author.id] == undefined) catchers[message.guild.id].caught[message.author.id] = 0;
	if (catchers[message.guild.id].hasStarted) return

	catchers[message.guild.id].count += 1;
	fs.writeFileSync('./database/misc/cookie_catchers.json', JSON.stringify(catchers, null, 2));
	if (catchers[message.guild.id].count > 49) {
		catchers[message.guild.id].hasStarted = true;
		fs.writeFileSync('./database/misc/cookie_catchers.json', JSON.stringify(catchers, null, 2));

		let randomWord = cookieWords[Math.floor(Math.random() * cookieWords.length)];
		await message.channel.send(`A Cookie Catch has started! Send the word: \`${randomWord}\` anywhere in this server! The person who sends the most wins some gifts! Y'all have 1 minute!`)
		const filter = m => m.content.toLowerCase().includes(randomWord.toLowerCase());
		const collector = message.channel.createMessageCollector({ filter, time: 60000 });

		collector.on('collect', m => {
			catchers[message.guild.id].caught[m.author.id] = (catchers[message.guild.id].caught[m.author.id] == undefined) ? 1 : catchers[message.guild.id].caught[m.author.id] + 1
			fs.writeFileSync('./database/misc/cookie_catchers.json', JSON.stringify(catchers, null, 2));
		});
		
		collector.on('end', async collected => {
			const gifts = JSON.parse(fs.readFileSync('./database/misc/gifts.json'))
			const sortable = Object.fromEntries(Object.entries(catchers[message.guild.id].caught).sort(([, a], [, b]) => a - b));
			let description = '';
			for (player in sortable) description += `${client.guilds.cache.get(message.guild.id).members.cache.get(player).user.username}: ${sortable[player]}`
			const leaderboardEmbed = new EmbedBuilder()
				.setTitle('Cookie Catch leaderboard')
				.setDescription(description)
				.setColor(functions.randomColor())
				.setTimestamp()
				.setFooter({ text: "Please report any bugs! Thanks! ^^", iconURL: client.user.avatarURL() });
			delete catchers[message.guild.id];
			if (gifts[Object.keys(sortable)[0]] == undefined) {
				gifts[Object.keys(sortable)[0]] = 0;
				fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
			}
			let randomAmtOfGifts = Math.round(Math.random() * 5) + 1;
			gifts[Object.keys(sortable)[0]] += randomAmtOfGifts;
			fs.writeFileSync('./database/misc/cookie_catchers.json', JSON.stringify(catchers, null, 2));
			fs.writeFileSync('./database/misc/gifts.json', JSON.stringify(gifts, null, 2));
			await message.channel.send({ content: `Cookie Catch has ended! ${client.guilds.cache.get(message.guild.id).members.cache.get(Object.keys(sortable)[0]).user.username} wins and gets \`${randomAmtOfGifts}\` gift${randomAmtOfGifts != 1 ? 's' : ''}`, embeds: [leaderboardEmbed] })
		})
	}
}); //This will listen for any messages from the server
//done

//Santa tracker
//Gifts
//Snowball fights
//Cookie Catcher