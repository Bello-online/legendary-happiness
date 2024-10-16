const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { API_KEY } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get_salary_range')
    .setDescription('Retrieve the salary range for a job title in a specific country')
    .addStringOption(option =>
      option.setName('job_title')
        .setDescription('The job title (e.g., "developer")')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('country_code')
        .setDescription('The country code (e.g., "US", "CH")')
        .setRequired(true)),
  
  async execute(interaction) {
    const jobTitle = interaction.options.getString('job_title');
    const countryCode = interaction.options.getString('country_code');

    try {
      const response = await axios.get('https://jobs-api14.p.rapidapi.com/salary/getSalaryRange', {
        params: {
          jobTitle: jobTitle,
          countryCode: countryCode,
        },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'jobs-api14.p.rapidapi.com',
        },
      });

      const salaryData = response.data;

      if (!salaryData || salaryData.hasError) {
        await interaction.reply(`Could not find salary data for **${jobTitle}** in **${countryCode}**.`);
        return;
      }

      let salaryInfo = `Salary range for **${jobTitle}** in **${countryCode}**:\n`;
      salaryInfo += `**Currency**: ${salaryData.currency}\n\n`;

      const timeframes = ['hourlySalary', 'dailySalary', 'weeklySalary', 'monthlySalary', 'yearlySalary'];
      timeframes.forEach((timeframe) => {
        if (salaryData[timeframe]) {
          salaryInfo += `**${timeframe.replace('Salary', '')}**: Min: ${salaryData[timeframe].min.toFixed(2)}, Median: ${salaryData[timeframe].median.toFixed(2)}, Max: ${salaryData[timeframe].max.toFixed(2)}\n`;
        }
      });

      await interaction.reply(salaryInfo);
    } catch (error) {
      console.error('Error fetching salary range:', error.response ? error.response.data : error.message);
      await interaction.reply('Sorry, I could not retrieve salary data at the moment.');
    }
  },
};
