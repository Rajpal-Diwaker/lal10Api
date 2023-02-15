import * as cron from 'node-cron'

cron.schedule('* * * * *', () => {
  console.log('running a task every two hours between 8 a.m. and 5:58 p.m.');
});