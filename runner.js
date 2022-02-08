const fs = require('fs');
const journeyFolder = './journeys';

const scripts = fs.readdirSync(journeyFolder);

if(scripts.length === 0) {
  console.log({
    message:`Please pass as argument one or more comma separated Chrome DevTool replays of your user journeys.
    For example: node runner.js example.com/more-info.js cloud.google.com/home-to-cloud-run.js`,
    severity: "WARNING",
  });
  process.exit(1);
} else {
  console.log(`Found ${scripts.length} user journeys in folder "journeys"`);
}

let taskIndex = 0;

// If this container is running as a Cloud Run job execution
if(process.env.CLOUD_RUN_JOB || process.env.CR_JOB) {
  if(process.env.CLOUD_RUN_TASK_INDEX) {
    taskIndex = parseInt(process.env.CLOUD_RUN_TASK_INDEX, 10);
  } else if (process.env.TASK_INDEX) {
    taskIndex = parseInt(process.env.TASK_INDEX, 10);
  }
}

if(taskIndex > scripts.length) {
  console.error({
    message: `The job has been configured with too many tasks and not enough user journeys. 
    We recommend using the same number of tasks as user journeys.
    Number of journeys found: ${scripts.length}.
    Index of the current task: ${taskIndexs}.
    This process will now exit.`,
    severity: "WARNING",
  });
  process.exit(1);
}

console.log(`User journey ${taskIndex} running: ${scripts[taskIndex]}`);
require(`./journeys/${scripts[taskIndex]}`);
console.log(`User journey ${taskIndex} completed: ${scripts[taskIndex]}`);
