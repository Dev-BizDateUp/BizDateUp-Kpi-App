const cron = require('node-cron');
const { sendReminderEmails } = require('./emailService');

// Schedule the task to run at 9:00 AM on the 25th, 26th, and 27th of every month.
cron.schedule('0 9 25,26,27 * *', () => {
  console.log('Starting the monthly badge reminder job...');
  sendReminderEmails();
}, {
  timezone: "Asia/Kolkata" 
});