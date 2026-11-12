export const linuxProcessesLesson = {
  id: "linux-processes",
  title: "Linux practice: manage application processes",
  group: "linux",
  level: "Beginner",
  duration: "15 min",
  summary: "Find a running application, verify its identity, stop it safely, and confirm it has exited.",
  objective: "Use ps and pgrep to inspect a process, confirm its PID and owner, send SIGTERM with kill, and verify that it has stopped.",
  steps: [{
    title: "Inspect and stop the application process",
    body: "In the previous levels, you prepared the my-app project, made its deployment script executable, and assigned app.log to the deploy account. Now the application is running as that same deploy user. Inspect the process list, find node server.js, verify its PID and owner before acting, request a graceful stop, and check that it is no longer running.",
    command: "ps aux",
    explain: "A process is a running instance of a program. ps aux shows a snapshot of processes, pgrep finds a process by its command, and kill PID sends SIGTERM by default. SIGTERM asks the program to exit cleanly; do not use kill -9 as your first choice."
  }],
  quiz: "What does the command kill 2481 do by default?",
  options: [
    "Immediately deletes the server.js file",
    "Sends SIGTERM to process 2481 and asks it to exit gracefully",
    "Restarts process 2481 automatically"
  ],
  answer: 1,
  why: "Without an explicit signal, kill sends SIGTERM. It requests a clean shutdown and gives the process an opportunity to finish safely."
};
