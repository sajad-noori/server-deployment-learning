export const linuxPermissionsLesson = {
  id: "linux-permissions",
  title: "Linux practice: file permissions",
  group: "linux",
  level: "Beginner",
  duration: "12 min",
  summary: "Inspect file permissions and make a deployment script executable.",
  objective: "Use ls -l to inspect permissions, chmod +x to add execute permission, and verify the result before running a script.",
  steps: [{
    title: "Inspect and change file permissions",
    body: "A file can exist but still not be allowed to run as a program. In this mission, deploy.sh starts without execute permission. Inspect its permission string, add execute permission, verify the change, and then run the script.",
    command: "chmod +x deploy.sh",
    explain: "ls -l displays file permissions. chmod changes them. The +x option adds execute permission while keeping the existing read and write permissions."
  }],
  quiz: "What does chmod +x deploy.sh do?",
  options: [
    "Deletes deploy.sh",
    "Adds execute permission to deploy.sh",
    "Moves deploy.sh to another folder"
  ],
  answer: 1,
  why: "chmod changes permissions, and +x adds permission to execute the file."
};
