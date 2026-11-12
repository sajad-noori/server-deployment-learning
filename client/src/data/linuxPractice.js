export const linuxPracticeLesson = {
  id: "linux-basics",
  title: "Linux basics: navigate a server",
  group: "linux",
  level: "Beginner",
  duration: "15 min",
  summary: "Use basic Linux commands to find and inspect an application folder.",
  objective: "Use pwd, ls, and cd to locate a project directory and inspect its contents.",
  steps: [{
    title: "Find your application folder",
    body: "You are logged in to a Linux server as the deploy user. Use the simulated terminal above to check your current location, list the folders, enter my-app, and inspect the project files. Complete the four checklist items in order.",
    command: "pwd",
    explain: "pwd prints your current working directory, ls lists its contents, and cd changes your current directory."
  }],
  quiz: "Which command changes your current directory?",
  options: ["pwd", "cd", "ls"],
  answer: 1,
  why: "cd means change directory. pwd prints the current location, while ls lists files and folders."
};
