const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { API_KEY } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remote_jobs')
    .setDescription('List remote jobs based on a keyword and location')
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
          remoteOnly: true, // Only remote jobs
        },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com',
        },
      });

      const jobs = response.data?.jobs || [];

      if (jobs.length === 0) {
        await interaction.reply(`No remote jobs found for **${keyword}** in **${location}**.`);
        return;
      }

      let jobInfo = `Here are some remote jobs for **${keyword}** in **${location}**:\n\n`;
      jobs.slice(0, 5).forEach((job, index) => { // Display up to 3 jobs
        jobInfo += `**${index + 1}. ${job.title}**\n`;
        jobInfo += `**Company**: ${job.company}\n`;
        jobInfo += `**Location**: ${job.location}\n`;
        jobInfo += `**Date Posted**: ${job.datePosted}\n`;
        jobInfo += `**URL**: [Apply Here](${job.jobProviders[0]?.url})\n\n`;
      });

      await interaction.reply(jobInfo);
    } catch (error) {
      console.error('Error fetching remote jobs:', error.response ? error.response.data : error.message);
      await interaction.reply('Sorry, I could not retrieve remote jobs at the moment.');
    }
  },
};
