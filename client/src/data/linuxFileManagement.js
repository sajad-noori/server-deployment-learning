export const linuxFileManagementLesson = {
  id: "linux-file-management",
  title: "Linux practice: manage files",
  group: "linux",
  level: "Beginner",
  duration: "12 min",
  summary: "Practise copying, renaming, and removing files safely.",
  objective: "Use cp, mv, and rm to manage temporary project files and verify the result.",
  steps: [{
    title: "Copy, rename, and remove files",
    body: "You are inside /home/deploy/my-app. Work with a temporary draft file: create it, make a copy, rename the copy, remove the original, and verify that the final file remains.",
    command: "cp draft.txt draft-copy.txt",
    explain: "cp makes a copy of a file. mv can move or rename a file. rm removes a file. Always check the file name and location before using rm."
  }],
  quiz: "Which command makes a separate copy of a file?",
  options: ["mv", "rm", "cp"],
  answer: 2,
  why: "cp copies a file. mv moves or renames it, while rm removes it."
};
