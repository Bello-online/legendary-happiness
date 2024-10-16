const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { API_KEY } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top_companies')
    .setDescription('List top companies hiring for a specific job title in a location')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('The job title or skill (e.g., "developer")')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('City, country, or other location')
        .setRequired(true)),
  
  async execute(interaction) {
    const keyword = interaction.options.getString('keyword');
    const location = interaction.options.getString('location');

    try {
      const response = await axios.get('https://jobs-api14.p.rapidapi.com/list', {
        params: {
          query: keyword,
          location: location,
        },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com',
        },
      });

      const jobs = response.data?.jobs || [];

      if (jobs.length === 0) {
        await interaction.reply(`No companies found hiring for **${keyword}** in **${location}**.`);
        return;
      }

      // Aggregate the companies
      const companyCounts = {};
      jobs.forEach(job => {
        const company = job.company;
        if (company) {
          companyCounts[company] = (companyCounts[company] || 0) + 1;
        }
      });

      // Sort companies by the number of job listings
      const sortedCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]);

      // Format the top companies for Discord message
      let companyInfo = `Top companies hiring for **${keyword}** in **${location}**:\n\n`;
      sortedCompanies.slice(0, 5).forEach(([company, count], index) => {
        companyInfo += `**${index + 1}. ${company}**: ${count} job listing(s)\n`;
      });

      await interaction.reply(companyInfo);
    } catch (error) {
      console.error('Error fetching top companies:', error.response ? error.response.data : error.message);
      await interaction.reply('Sorry, I could not retrieve top companies at the moment.');
    }
  },
};