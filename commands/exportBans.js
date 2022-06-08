const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { SlashCommandBuilder, Attachment } = require('discord.js');

const Excel = require('exceljs');

const { guildId, token } = require('../config.json');

const rest = new REST({ version: '9' }).setToken(token);

module.exports = {
	data: new SlashCommandBuilder().setName('exportbans').setDescription('Export bans from guild.'),
	async execute(interaction) {
		// Fetch Bans
		const results = [];
		const bans = await rest.get(Routes.guildBans(guildId));

		// Get information from Data
		bans.forEach((value) => {
			let row = [];
			row.push(`${value.user.username}#${value.user.discriminator}`);
			row.push(`${value.user.id}`);
			if (value.reason != null) row.push(`${value.reason}`);
			results.push(row);
		});

		// Create Excel sheet
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(interaction.guild.name);
		worksheet.columns = [
			{ header: 'Discord Tag', key: 'TAG', width: 25 },
			{ header: 'Discord Id', key: 'ID', width: 25 },
			{ header: 'Reason', key: 'REASON', width: 50 },
		];

		// Push information to Excel sheet
		for (const row of results) {
			worksheet.addRow(row);
		}

		// Write File
		await workbook.xlsx.writeFile('./data/data.xlsx');
		const attachment = new Attachment('./data/data.xlsx');

		await interaction.reply({
			content: 'Successfully compiled banned users into excel sheet.',
			files: [attachment],
			ephemeral: true,
		});
	},
};
