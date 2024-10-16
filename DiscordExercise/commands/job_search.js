const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { API_KEY } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('job_search')
    .setDescription('Search for jobs based on a keyword and location')
    .addStringOption(option =>
      option.setName('keyword')
        .setDescription('The job title or skill (e.g., "software engineer")')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('location')
        .setDescription('City or region to search in')
        .setRequired(true)),
  
  async execute(interaction) {
    const keyword = interaction.options.getString('keyword');
    const location = interaction.options.getString('location');

    // Make API request to RapidAPI Jobs API
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

     // Check if the response contains jobs array
     const jobs = response.data?.jobs || []; // Use optional chaining to safely access the jobs array

     if (jobs.length === 0) {
       await interaction.reply(`No jobs found for **${keyword}** in **${location}**.`);
       return;
     }

     // Format the job results for Discord message
     let jobInfo = `Here are some jobs for **${keyword}** in **${location}**:\n\n`;
     jobs.slice(0, 5).forEach((job, index) => { // Display up to 5 jobs
       jobInfo += `**${index + 1}. ${job.title}**\n`;
       jobInfo += `**Company**: ${job.company}\n`;
       jobInfo += `**Location**: ${job.location}\n`;
       jobInfo += `**Date Posted**: ${job.datePosted}\n`;
       jobInfo += `**Employment Type**: ${job.employmentType}\n`;
       jobInfo += `**URL**: [Apply Here](${job.jobProviders[0]?.url})\n\n`; 
     });

     await interaction.reply(jobInfo);
   } catch (error) {
     // Log the error for debugging purposes
     console.error('Error fetching jobs:', error.response ? error.response.data : error.message);
     await interaction.reply('Sorry, I could not retrieve jobs at the moment.');
   }
 },
};