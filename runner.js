const scripts = process.argv.slice(2);

if(scripts.length === 0) {
  console.log({
    message:`Please pass as argument one or more comma separated Chrome DevTool replays of your user journeys.
    For example: node runner.js example.com/more-info.js cloud.google.com/home-to-cloud-run.js`,
    severity: "WARNING",
  });
  process.exit(1);
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
    Use the same number of tasks as user journeys.
    Number of journeys configured as arguments: ${scripts.length}.
    Index of the current task: ${taskIndexs}`,
    severity: "ERROR",
  });
  process.exit(1);
}

if(!scripts[taskIndex].match(/.*\.js$/)) {
  console.error({
    message: `Invalid path to user journey ${scripts[taskIndex]}.
    User journey must be passed as a JavaScript file relative to the "journeys/" folder.
    Example: "example.com/more-info.js`,
    severity: "ERROR",
  });
  process.exit(1);
}

console.log(`User journey ${taskIndex} running: ${scripts[taskIndex]}`);

require(`./journeys/${scripts[taskIndex]}`);

console.log(`User journey ${taskIndex} completed: ${scripts[taskIndex]}`);



