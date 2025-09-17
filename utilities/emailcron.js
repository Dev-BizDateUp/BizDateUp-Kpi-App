const cron = require('node-cron');
const { sendReminderEmails } = require('./emailService');

cron.schedule('0 9 25,26,27 * *', () => {
  console.log('Starting the monthly badge reminder job...');
  sendReminderEmails();
}, {
  timezone: "Asia/Kolkata" 
});