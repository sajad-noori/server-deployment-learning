export const linuxFileOperationsLesson = {
  id: "linux-file-operations",
  title: "Linux practice: create folders and files",
  group: "linux",
  level: "Beginner",
  duration: "12 min",
  summary: "Use mkdir and touch to create a log folder and file.",
  objective: "Create a directory, move into it, create a file, and verify the result.",
  steps: [
    {
      title: "Create a logs folder and file",
      body: "You are inside /home/deploy/my-app. Create a directory named logs, enter it, create deploy.log, and list its contents to verify the file exists.",
      command: "mkdir logs",
      explain: "mkdir creates a directory. touch creates an empty file. cd changes directories, and ls lists their contents."
    }
  ],
  quiz: "Which command creates a new directory?",
  options: ["touch", "mkdir", "cat"],
  answer: 1,
  why: "mkdir creates directories. touch creates files, while cat displays file contents."
};
