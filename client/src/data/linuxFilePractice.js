export const linuxFilePracticeLesson = {
  id: "linux-file-inspection",
  title: "Linux practice: read project files",
  group: "linux",
  level: "Beginner",
  duration: "10 min",
  summary: "Build on folder navigation by reading README.md and package.json.",
  objective: "Use the cat command to inspect the contents of two project files.",
  steps: [{
    title: "Read project files",
    body: "You are inside /home/deploy/my-app, the folder you found in the previous practice. Use cat README.md to read the project instructions, then cat package.json to inspect the app configuration.",
    command: "cat README.md",
    explain: "cat displays the contents of a file in the terminal. README.md explains the project, while package.json contains Node.js project metadata and scripts."
  }],
  quiz: "Which command displays the contents of a text file?",
  options: ["cd", "cat", "pwd"],
  answer: 1,
  why: "cat prints a file's contents. cd changes folders, and pwd prints your current location."
};
