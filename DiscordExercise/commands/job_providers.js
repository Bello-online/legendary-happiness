const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { API_KEY } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('job_providers')
    .setDescription('List job providers for a specific job based on a keyword and location')
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
        await interaction.reply(`No jobs found for **${keyword}** in **${location}**.`);
        return;
      }

      // Use the first job from the results to list providers
      const job = jobs[0];
      let providerInfo = `Job providers for **${job.title}** in **${location}**:\n\n`;

      job.jobProviders.forEach((provider, index) => {
        providerInfo += `**${index + 1}. ${provider.jobProvider}**: [Apply Here](${provider.url})\n`;
      });

      await interaction.reply(providerInfo);
    } catch (error) {
      console.error('Error fetching job providers:', error.response ? error.response.data : error.message);
      await interaction.reply('Sorry, I could not retrieve job providers at the moment.');
    }
  },
};
