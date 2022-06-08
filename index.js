const { Client, Collection } = require('discord.js');
const fs = require('fs');

const { token } = require('./config.json');

// Initialization
const client = new Client({
	intents: ['Guilds', 'GuildMembers'],
});

// Collections
client.commands = new Collection();

// Command Handler
for (const file of fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Event Handler
for (const file of fs.readdirSync('./events').filter((file) => file.endsWith('.js'))) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login
client.login(token);
