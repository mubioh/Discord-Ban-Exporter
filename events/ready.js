const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const { guildId, token } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const commands = Array.from(client.commands.values()).map((m) => m.data);

		const rest = new REST({ version: '9' }).setToken(token);

		await rest
			.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands })
			.catch(console.error);

		console.log(`Ready! Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
