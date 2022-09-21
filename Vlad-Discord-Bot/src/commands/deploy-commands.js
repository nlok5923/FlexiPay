require('dotenv').config()
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
	new SlashCommandBuilder().setName('start-monitoring').setDescription('Bot will start monitoring voice channel !!'),
	new SlashCommandBuilder().setName('stop-monitoring').setDescription('Bot will stop monitoring voice channel !!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORDJS_BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENTID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);