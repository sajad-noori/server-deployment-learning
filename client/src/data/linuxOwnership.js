export const linuxOwnershipLesson = {
  id: "linux-ownership",
  title: "Linux practice: file ownership",
  group: "linux",
  level: "Beginner",
  duration: "12 min",
  summary: "Understand file owners and groups, then safely change ownership.",
  objective: "Use ls -l and whoami to inspect a file and current account, then use chown to update a file's owner and group.",
  steps: [{
    title: "Inspect and change file ownership",
    body: "The application log file app.log is currently owned by root. Your deployment account is deploy. Inspect the file, check your current account, change the file owner and group to deploy, and verify the result.",
    command: "sudo chown deploy:deploy app.log",
    explain: "The chown command changes file ownership. In deploy:deploy, the first deploy is the new owner and the second is the group. sudo runs the command with elevated privileges when your account is authorized."
  }],
  quiz: "In sudo chown deploy:deploy app.log, what does the first deploy represent?",
  options: [
    "The file's new owner",
    "The file's new group",
    "The name of a command"
  ],
  answer: 0,
  why: "In owner:group syntax, the value before the colon is the new owner, and the value after it is the group."
};
