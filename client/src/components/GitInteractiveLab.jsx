import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, Code2, Copy, ExternalLink, GitBranch, GraduationCap, LayoutDashboard, LockKeyhole, Menu, Search, Server, ShieldCheck, Terminal, TrendingUp, X, Zap } from "lucide-react";
import { useState } from "react";

export function GitInteractiveLab({lessonId}){
 const mode=lessonId==="git-conflicts"?"conflicts":lessonId==="github-workflow"?"workflow":"basics";
 const isWorkflow=mode==="workflow",isConflict=mode==="conflicts";
 const storageKey="deploylab-git-lab-"+lessonId;
 const saved=(()=>{try{return JSON.parse(localStorage.getItem(storageKey)||"null")}catch{return null}})();
 const initial=(key,fallback)=>saved?.[key]??fallback;
 const scenarios=[
  {starter:"function getAccess(user) {\n  return user.role === \"admin\";\n}\n\nconsole.log(getAccess(user));\n",mine:'  return user.role === "admin";',theirs:'  return user.isActive;',accepted:["  return user.role === \"admin\";","  return user.isActive;"]},
  {starter:"function buildMessage(user) {\n  return \"Welcome, \" + user.name;\n}\n\nconsole.log(buildMessage(user));\n",mine:'  return "Welcome, " + user.name;',theirs:'  return "Welcome back, " + user.name;',accepted:['  return "Welcome, " + user.name + " — welcome back!";','  return "Welcome, " + user.name + " (returning member)";']}
 ];
 const [round,setRound]=useState(()=>initial("round",0));
 const scenario=scenarios[round];
 const baseCode=isConflict?scenario.starter:isWorkflow?'function login(email, password) {\n  // TODO: validate the user\n  return { email, authenticated: true };\n}\n':'function greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Developer"));\n';
 const [code,setCode]=useState(()=>initial("code",baseCode));
 const [fileState,setFileState]=useState(()=>initial("fileState","clean"));
 const [command,setCommand]=useState(()=>initial("command",""));
 const [output,setOutput]=useState(()=>initial("output",isConflict?"You are on feature/summary. Your commit is ready; main has moved ahead because Sara merged a change.":"Your working tree is clean. Edit app.js to begin the exercise."));
 const [branchCreated,setBranchCreated]=useState(()=>initial("branchCreated",isConflict));
 const [currentBranch,setCurrentBranch]=useState(()=>initial("currentBranch",isConflict?"feature/summary":"main"));
 const [prOpen,setPrOpen]=useState(()=>initial("prOpen",false));
 const [approved,setApproved]=useState(()=>initial("approved",false));
 const [merged,setMerged]=useState(()=>initial("merged",false));
 const [localMainBehind,setLocalMainBehind]=useState(()=>initial("localMainBehind",false));
 const [pulled,setPulled]=useState(()=>initial("pulled",false));
 const [branchDeleted,setBranchDeleted]=useState(()=>initial("branchDeleted",false));
 const [statusChecked,setStatusChecked]=useState(()=>initial("statusChecked",false));
 const [logChecked,setLogChecked]=useState(()=>initial("logChecked",false));
 const [unmergedStatusChecked,setUnmergedStatusChecked]=useState(()=>initial("unmergedStatusChecked",false));
 const [conflictActive,setConflictActive]=useState(()=>initial("conflictActive",false));
 const [conflictResolved,setConflictResolved]=useState(()=>initial("conflictResolved",false));
 const [mergeCommitted,setMergeCommitted]=useState(()=>initial("mergeCommitted",false));
 const [pushed,setPushed]=useState(()=>initial("pushed",false));
 const [mainMoved,setMainMoved]=useState(()=>initial("mainMoved",isConflict));
 const [history,setHistory]=useState(()=>initial("history",[]));
 const [commits,setCommits]=useState(()=>initial("commits",isConflict?[{id:"7fa31c2",message:"Add feature summary",branch:"feature/summary"}]:[]));
 const [lastCommit,setLastCommit]=useState(()=>initial("lastCommit",""));
 const [showAnswer,setShowAnswer]=useState(()=>initial("showAnswer",false));
 const [tab,setTab]=useState(()=>initial("tab",0));
 const [abortUsed,setAbortUsed]=useState(()=>initial("abortUsed",false));
 const [saraApproved,setSaraApproved]=useState(()=>initial("saraApproved",false));
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({round,code,fileState,command,output,branchCreated,currentBranch,prOpen,approved,merged,localMainBehind,pulled,branchDeleted,statusChecked,logChecked,unmergedStatusChecked,conflictActive,conflictResolved,mergeCommitted,pushed,mainMoved,history,commits,lastCommit,showAnswer,tab,abortUsed,saraApproved}));}catch(error){console.warn("Could not save Git lab progress",error)}},[storageKey,round,code,fileState,command,output,branchCreated,currentBranch,prOpen,approved,merged,localMainBehind,pulled,branchDeleted,statusChecked,logChecked,unmergedStatusChecked,conflictActive,conflictResolved,mergeCommitted,pushed,mainMoved,history,commits,lastCommit,showAnswer,tab,abortUsed,saraApproved]);
 const markers=["<<<<<<< HEAD","=======",">>>>>>> origin/main"];
 const markerText=markers.some(m=>code.includes(m)) || /<{3,}|={3,}|>{3,}/.test(code);
 const hasMine=code.includes(scenario.mine);
 const hasTheirs=code.includes(scenario.theirs);
 const validResolution= !markerText && code.split("\n").some(line=>scenario.accepted.includes(line));
 const checkResolution=()=>{
  if(markerText){const remaining=markers.filter(m=>code.includes(m));const fragments=code.split("\n").filter(line=>/<{3,}|={3,}|>{3,}/.test(line));return "There are still conflict-marker lines in app.js: "+(remaining.length?remaining.join(", "):fragments.join(" | "))+". In the code editor above, delete the three marker lines (<<<<<<< HEAD, =======, and >>>>>>> origin/main). Keep only the final code you want. Easiest: click Keep my version, Keep Sara's version, or Use the combined version; those buttons remove the markers for you."; }
  if(!code.includes("function "+(round===0?"getAccess":"buildMessage"))||!code.includes("console.log("))return "Keep the sample function and its console.log call. Edit only the conflicted return line.";
  if(!validResolution)return round===0?"The marker lines are gone, but the final return line is not one of the two accepted answers. Click Keep my version (HEAD) or Keep Sara's version to insert a correct line automatically.":"The marker lines are gone, but the final return line must keep the user's name and Sara's returning-member idea. Click Use the combined version to insert the accepted answer automatically.";
  return "";
 };
 const makeConflict=()=>scenario.starter.replace(scenario.mine,"<<<<<<< HEAD\n"+scenario.mine+"\n=======\n"+scenario.theirs+"\n>>>>>>> origin/main");
 const resolvedCode=(line)=>scenario.starter.replace(scenario.mine,line);
 const runCommand=(raw)=>{
  const cmd=raw.trim(),lower=cmd.toLowerCase();if(!cmd)return;
  let message="";
  if(lower==="git status"||lower==="git status -sb"){
   if(isConflict){setStatusChecked(true);if(conflictActive)setUnmergedStatusChecked(true);message=conflictActive?(conflictResolved?"On branch feature/summary\nAll conflicts fixed but you are still merging.\nChanges to be committed: app.js":"On branch feature/summary\nYou have unmerged paths.\n  both modified: app.js\nfix conflicts and run git add app.js"):merged&&currentBranch==="main"&&localMainBehind?"On branch main\nYour branch is behind 'origin/main' by 1 commit.\n(use git pull origin main to update your local branch)": "On branch "+currentBranch+"\nYour branch and 'origin/main' have diverged.\nnothing to commit, working tree clean";}
   else{if(isWorkflow)setStatusChecked(true);message="On branch "+currentBranch+"\n"+(fileState==="clean"?"nothing to commit, working tree clean":fileState==="modified"?"Changes not staged for commit:\n  modified: app.js":fileState==="staged"?"Changes to be committed:\n  modified: app.js":"Your branch has local changes.");}
  }else if(lower==="git log --oneline"||lower==="git log --oneline --graph --all"){
   if(isConflict){setLogChecked(true);message="* 7fa31c2 (HEAD -> feature/summary) Add feature summary\n| * 91b8e20 (origin/main, main) Sara updates welcome message\n|/\n* 4d2c9a1 Base application";}
   else message=commits.length?commits.map(c=>c.id+" "+c.message+" ("+c.branch+")").join("\n"):"No commits yet.";
  }else if(lower==="git status --short"){
   if(isConflict&&conflictActive)setUnmergedStatusChecked(true);
   message=conflictActive
    ? conflictResolved
      ? fileState==="staged"?"M  app.js\nAll conflicts fixed; the merge is still in progress.":" M app.js\nConflict markers are resolved, but app.js is not staged yet."
      : "UU app.js\nThe file has an unresolved merge conflict."
    : "Working tree clean.";
  }else if((lower==="git pull origin main"||lower==="git merge origin/main")&&isConflict){
   if(merged&&currentBranch==="main"){setPulled(true);setLocalMainBehind(false);message="✓ Local main now includes the resolved merge from origin/main.";}
   else if(merged){message="Switch to main first with git switch main, then pull origin/main.";}
   else if(currentBranch!=="feature/summary")message="You are on "+currentBranch+". Switch to feature/summary before pulling main into your feature branch.";
   else if(!mainMoved)message="Already up to date.";
   else if(conflictActive)message="A merge is already in progress. Resolve app.js, stage it, then commit—or run git merge --abort.";
   else{setConflictActive(true);setConflictResolved(false);setFileState("conflicted");setCode(makeConflict());message="Auto-merging app.js\nCONFLICT (content): Merge conflict in app.js\nAutomatic merge failed; fix conflicts and then commit the result."; }
  }else if(lower==="git pull origin main"&&isWorkflow){
   if(currentBranch!=="main")message="Switch to main first with git switch main.";else if(!merged)message="There is no merged pull request to pull yet.";else{setPulled(true);setLocalMainBehind(false);message="✓ Fast-forwarded local main. Your local main now includes the merged feature from origin/main."; }
  }else if(lower==="git switch -c feature/login"&&isWorkflow){
   if(branchCreated)message="The feature branch already exists. Use git switch feature/login.";else{setBranchCreated(true);setCurrentBranch("feature/login");message="✓ Switched to a new branch feature/login. main remains unchanged."; }
  }else if(lower==="git switch feature/login"&&isWorkflow){
   if(branchCreated){setCurrentBranch("feature/login");message="Switched to branch feature/login."; }else message="Branch not found. Create it with git switch -c feature/login.";
  }else if(lower==="git merge --abort"){
   if(isConflict&&conflictActive&&!mergeCommitted){setConflictActive(false);setConflictResolved(false);setFileState("clean");setCode(scenario.starter);setAbortUsed(true);message="Merge aborted. Git returned feature/summary to the state before the pull. Your existing feature commit is safe.";}
   else message="There is no merge in progress to abort.";
  }else if(lower==="git diff"){
   message=conflictActive&&fileState!=="staged"?code:"No unstaged changes.";
  }else if(lower==="git diff --staged"){
   message=conflictActive&&conflictResolved&&fileState==="staged"?"diff -- app.js (staged conflict resolution)\n"+code:"No staged changes.";
  }else if(lower==="git add app.js"||lower==="git add ."){
   if(isConflict&&conflictActive){const issue=checkResolution();if(issue)message="✕ Cannot stage this resolution yet.\n"+issue;else{setConflictResolved(true);setFileState("staged");message="✓ All conflict markers are gone and the final result is valid. app.js is staged as resolved."}}
   else if(fileState==="modified"){setFileState("staged");message="✓ app.js staged."}
   else message="No modified file to stage. Edit app.js first.";
  }else if(lower.startsWith("git commit")){
   const match=cmd.match(/-m\s+["'](.+?)["']\s*$/)||cmd.match(/-m\s+(.+)$/);
   if(!match)message='Add a message: git commit -m "Resolve merge conflict"';
   else if(isConflict&&conflictActive){
    if(!conflictResolved||markerText){message="✕ The lab blocks this commit while conflict markers remain or the resolution has not been staged.\nReal Git can create a commit containing marker text; this simulation blocks it because the resulting code would be broken.";}
    else{setMergeCommitted(true);setConflictActive(false);setFileState("committed");setLastCommit(match[1]);setCommits(items=>[{id:"c81d4a2",message:match[1],branch:currentBranch},...items]);message="✓ Merge commit created: c81d4a2\nThe conflict resolution is now recorded in your feature branch.";}
   }else if(fileState==="staged"){setFileState("committed");setLastCommit(match[1]);setCommits(items=>[{id:"a1b2c3d",message:match[1],branch:currentBranch},...items]);message="✓ Commit created locally."}
   else message="Nothing staged to commit. Run git add app.js first.";
  }else if(lower==="git push"||lower==="git push origin feature/summary"||lower==="git push -u origin feature/summary"||lower==="git push origin feature/login"||lower==="git push -u origin feature/login"){
   if(isConflict){
    if(conflictActive&&!mergeCommitted)message="✕ Push rejected: unmerged paths remain. Resolve app.js, stage it, and create the merge commit before pushing.";
    else if(mergeCommitted){setPushed(true);setFileState("pushed");message="✓ Pushed feature/summary to origin. The merge commit is now on GitHub, so the pull request can be merged.";}
    else message="No new commits to push.";
   }else if(isWorkflow&&currentBranch==="main")message="✕ Push rejected: main is protected. Use a feature branch and pull request.";
   else if(fileState==="committed"){setFileState("pushed");message="✓ Push successful. Your commit is on origin/"+currentBranch+"."}
   else message="There is no new local commit to push.";
  }else if(lower==="open pr"&&isWorkflow){setPrOpen(fileState==="pushed");message=fileState==="pushed"?"✓ Pull request opened: feature/login → main.":"Push your feature branch first.";}
  else if(lower==="open pr"&&isConflict){
   if(!mainMoved)message="Publish your feature branch and make sure main has moved ahead before opening this pull request.";
   else if(prOpen)message="Pull request #"+(round===0?2:3)+" is already open. Pull main into your branch to reproduce the conflict locally.";
   else{setPrOpen(true);message="✓ Pull request #"+(round===0?2:3)+" opened: feature/summary → main. GitHub reports that this branch has conflicts with main."; }
  }
  else if(lower==="approve pr"&&(isWorkflow||isConflict)){
   if(isConflict&&(!pushed||!conflictResolved))message="Resolve the conflict and push the branch before approval.";
   else if(prOpen){setApproved(true);message="✓ Review approved. The pull request is ready to merge.";}
   else message="Open a pull request first.";
  }else if(lower==="merge pr"&&(isWorkflow||isConflict)){
   if(!prOpen)message="Open a pull request first.";
   else if(isConflict&&!pushed)message="Push the resolved merge commit before merging this pull request.";
   else if(approved||saraApproved){setMerged(true);setLocalMainBehind(true);message="✓ Pull request merged into GitHub main. Switch to main and pull to update your local copy.";}
   else message="The pull request needs approval before it can be merged.";
  }else if(lower==="git switch main"&&(isWorkflow||isConflict)){
   if(!merged)message="Switch back to main after the pull request has been merged.";
   else{setCurrentBranch("main");message="Switched to branch main. Run git pull origin main to update it.";}
  }else if(lower==="git pull origin main"&&isWorkflow&&currentBranch==="main"&&merged){setPulled(true);setLocalMainBehind(false);message="✓ Local main now includes the merged change.";}
  else if(lower==="git branch"){message="* "+currentBranch+(isConflict?"\n  main\n  feature/summary": "\n  main\n  feature/login");}
  else if(lower==="clear"){message="Terminal cleared.";}
  else message="Command not recognized. Try git status, git log --oneline --graph --all, git pull origin main, git merge --abort, git add app.js, git commit, or git push.";
  setHistory(items=>[...items.slice(-7),"$ "+cmd]);setOutput(message);setCommand("");
 };
 const reset=()=>{
  localStorage.removeItem(storageKey);
  setRound(0);setCode(isConflict?scenarios[0].starter:baseCode);setFileState("clean");setCommand("");setOutput(isConflict?"You are on feature/summary. Your commit is ready; main has moved ahead because Sara merged a change.":"Your working tree is clean. Edit app.js to begin the exercise.");
  setBranchCreated(isConflict);setCurrentBranch(isConflict?"feature/summary":"main");setPrOpen(false);setApproved(false);setMerged(false);setLocalMainBehind(false);setPulled(false);setBranchDeleted(false);setStatusChecked(false);setLogChecked(false);setUnmergedStatusChecked(false);setConflictActive(false);setConflictResolved(false);setMergeCommitted(false);setPushed(false);setMainMoved(isConflict);setAbortUsed(false);setShowAnswer(false);setHistory([]);setCommits(isConflict?[{id:"7fa31c2",message:"Add feature summary",branch:"feature/summary"}]:[]);setLastCommit("");
 };
 const nextRound=()=>{setRound(1);setCode(scenarios[1].starter);setFileState("clean");setBranchCreated(true);setCurrentBranch("feature/summary");setConflictActive(false);setConflictResolved(false);setMergeCommitted(false);setPushed(false);setApproved(false);setMerged(false);setLocalMainBehind(false);setPulled(false);setMainMoved(true);setPrOpen(false);setStatusChecked(false);setLogChecked(false);setUnmergedStatusChecked(false);setAbortUsed(false);setSaraApproved(false);setLastCommit("");setOutput("Round 2: a new feature branch is ready and main has moved ahead again. Open the pull request, then pull main into feature/summary to reveal the conflict.");setHistory([]);setCommits([{id:"d2a8f10",message:"Add welcome message",branch:"feature/summary"}]);setShowAnswer(false);};
 const stages=isConflict?[["01","Diverged","main moved ahead",mainMoved],["02","Conflicted","same line changed",conflictActive],["03","Resolved","final code chosen",conflictResolved],["04","Committed","merge commit saved",mergeCommitted],["05","Pushed","resolution on GitHub",pushed],["06","Merged","pull request merged",merged]]:isWorkflow?[["01","Feature branch","Isolated work",branchCreated],["02","Local commit","Saved snapshot",fileState==="committed"||fileState==="pushed"],["03","Remote branch","Published",fileState==="pushed"],["04","Pull request","Reviewed",approved||merged],["05","GitHub main","Merged",merged],["06","Local main","Pulled",pulled]]:[["01","Working folder","Modified file",fileState==="modified"],["02","Staging area","Selected changes",fileState==="staged"],["03","Local commit","Saved snapshot",fileState==="committed"||fileState==="pushed"],["04","GitHub remote","Uploaded commit",fileState==="pushed"]];
 const activeStage=isConflict?(merged?5:pushed?4:mergeCommitted?3:conflictResolved?2:conflictActive?1:0):isWorkflow?(pulled?5:merged?4:approved?3:fileState==="pushed"?2:fileState==="committed"?1:0):({clean:0,modified:0,staged:1,committed:2,pushed:3})[fileState];
 const mission=isConflict?[["Check status and inspect the log",statusChecked&&logChecked],["Open the pull request and notice conflicts",prOpen],["Pull latest main into your branch",conflictActive||conflictResolved||mergeCommitted||pushed||merged],["Inspect unmerged status",unmergedStatusChecked],["Resolve the conflict in app.js: remove all marker lines",(conflictActive&&!checkResolution())||conflictResolved||mergeCommitted||pushed||merged],["Stage the resolved file",conflictResolved],["Create the merge commit",mergeCommitted],["Push the branch",pushed],["Approve and merge the pull request",merged],["Switch to main and pull",pulled],["Optional: abort a merge safely",abortUsed]]:isWorkflow?[["Check status on main",statusChecked],["Create a feature branch",branchCreated],["Edit app.js",fileState!=="clean"],["Stage and commit",fileState==="committed"||fileState==="pushed"],["Push with upstream",fileState==="pushed"],["Open pull request",prOpen],["Approve review",approved],["Merge pull request",merged],["Switch to main and pull",pulled]]:[["Edit app.js",fileState!=="clean"],["Stage the change",["staged","committed","pushed"].includes(fileState)],["Create a local commit",["committed","pushed"].includes(fileState)],["Push to GitHub",fileState==="pushed"]];
 const answer=isConflict
  ? (!statusChecked
    ? {title:"Check the branch status",command:"git status",explanation:"See that your feature branch has diverged from main."}
    : !logChecked
      ? {title:"Inspect the commit graph",command:"git log --oneline --graph --all",explanation:"Sara's main commit and your feature commit are on different lines."}
      : !prOpen
        ? {title:"Open the pull request",command:"open pr",explanation:"Open feature/summary → main. GitHub detects that main has changed the same line."}
        : !conflictActive&&!mergeCommitted
          ? {title:"Pull latest main into your feature branch",command:"git pull origin main",explanation:"Git combines the histories and pauses when it finds the same line changed twice. This creates an unresolved merge conflict in app.js."}
          : conflictActive&&!unmergedStatusChecked
            ? {title:"Inspect unmerged status",command:"git status --short",explanation:"Look for the line UU app.js. The first U means the index has an unresolved conflict, and the second U means the working-tree version is also unmerged. This confirms both branches modified the same file. Run this command before editing the conflict."}
            : checkResolution()
              ? {title:"Resolve the conflict in the code editor",code:round===0?resolvedCode(scenario.accepted[0]):resolvedCode('  return "Welcome, " + user.name + " — welcome back!";'),explanation:"Do this in the app.js code editor above—not in the terminal. The code shown below is the COMPLETE final file. Click “Apply this solution to app.js” and the lab will replace the conflicted file for you. The three marker lines will be removed automatically. Then run git add app.js in the terminal. You do not need to type the code yourself."}
          : !conflictResolved
            ? {title:"Stage the resolution",command:"git add app.js",explanation:"Your edited file passes the resolution check. Stage app.js before committing."}
            : !mergeCommitted
              ? {title:"Commit the merge",command:'git commit -m "Resolve merge conflict"',explanation:"The resolved file is staged. Create the merge commit to record your decision."}
              : !pushed
                ? {title:"Push the resolved branch",command:"git push origin feature/summary",explanation:"Publish the merge commit so GitHub can re-check the pull request."}
                : !merged
                  ? !approved
                    ? {title:"Approve the pull request",command:"approve pr",explanation:"First approve the pull request. This records the review but does NOT merge it yet. After this command succeeds, Show answer will guide you to the separate merge step."}
                    : {title:"Merge the approved pull request",command:"merge pr",explanation:"The review is now approved. Run merge pr as a separate command to merge the feature into GitHub main. The mission is complete only after the merge succeeds."}
                  : !pulled
                    ? {title:"Update local main",command:currentBranch==="main"?"git pull origin main":"git switch main",explanation:"Switch to main and pull the merged result."}
                    : {title:"Mission complete",explanation:"The conflict is resolved, pushed, merged, and present on local main."})
  : isWorkflow
    ? (!statusChecked
      ? {title:"Check your starting point",command:"git status",explanation:"Confirm you are on main and the working tree is clean before starting."}
      : !branchCreated
        ? {title:"Create your feature branch",command:"git switch -c feature/login",explanation:"A branch gives you a separate workspace without changing main."}
        : fileState==="clean"
          ? {title:"Edit the sample code",code:'function login(email, password) {\n  return { email, authenticated: Boolean(email && password) };\n}\n',explanation:"Add a simple email and password validation check."}
          : fileState==="modified"
            ? {title:"Stage your change",command:"git add app.js",explanation:"Stage app.js so it can be included in your next commit."}
            : fileState==="staged"
              ? {title:"Create a local commit",command:'git commit -m "Add login validation"',explanation:"Save your staged change in your local Git history."}
              : fileState==="committed"
                ? {title:"Publish the feature branch",command:"git push -u origin feature/login",explanation:"Push the branch and set upstream tracking."}
                : !prOpen
                  ? {title:"Open a pull request",command:"open pr",explanation:"Ask teammates to review your branch before it is merged into main."}
                  : !approved
                    ? {title:"Review and approve",command:"approve pr",explanation:"Inspect the diff in the reviewer panel, then approve the proposed change."}
                    : !merged
                      ? {title:"Merge the approved change",command:"merge pr",explanation:"The merge updates GitHub main. It does not update your local main yet."}
                      : !pulled
                        ? {title:"Update your local main",command:currentBranch==="main"?"git pull origin main":"git switch main",explanation:"Switch to main and pull the merge from GitHub."}
                        : {title:"Mission complete",explanation:"Your reviewed change is merged on GitHub and your local main is up to date."})
    : (fileState==="clean"
      ? {title:"Edit the sample code",explanation:"Change the greeting text or the name in the editor above.",code:'function greet(name) {\n  return "Welcome, " + name + "!";\n}\n\nconsole.log(greet("Developer"));\n'}
      : fileState==="modified"
        ? {title:"Stage your change",command:"git add app.js",explanation:"Add the edited file to Git's staging area."}
        : fileState==="staged"
          ? {title:"Create a local commit",command:'git commit -m "Update greeting"',explanation:"Save the staged change as a local snapshot."}
          : fileState==="committed"
            ? {title:"Push to GitHub",command:"git push origin main",explanation:"Send your local commit to the remote repository."}
            : {title:"Mission complete",explanation:"Your commit has been pushed to GitHub."});
 const applyAnswer=()=>{if(answer.command){setCommand(answer.command);setOutput("The command is ready in the terminal. Click Run command to execute it.");}else if(answer.code){setCode(answer.code);setConflictResolved(false);setFileState("modified");setOutput("✓ The complete conflict-free solution has been placed in app.js. The conflict markers are removed. Next, run: git add app.js");}};
 const tabs=[["Why conflicts happen","Two branches changed the same line. Git cannot guess which meaning the team wants."],["Read the markers","<<<<<<< HEAD begins your version. ======= separates the versions. >>>>>>> origin/main begins Sara's incoming version."],["Choose the result","Round 1 accepts either side. Round 2 requires both the original name and Sara's returning-member idea."],["Finish the merge","Remove all markers, stage, commit, push, then approve and merge the pull request."],["Avoid conflicts","Pull often, keep pull requests small, and coordinate when touching the same files. Use git merge --abort to safely back out before committing."]];
 return <section className="git-lab">
  <div className="git-lab-heading"><div><span className="playground-kicker">🎮 HANDS-ON GIT WORKSHOP</span><h2>{isConflict?"Resolve merge conflicts":isWorkflow?"Build a feature and merge it":"Make a code change and send it to GitHub"}</h2><p>{isConflict?"Sara merged a change into main while you worked on your feature branch. Both of you edited the same line. Your job is to decide what the final code should be.":isWorkflow?"Create a feature branch, commit your code, publish it, then review and merge the pull request.":"Edit the sample code and use Git commands to move the file through the workflow."}</p></div><span className="git-lab-tag">{isConflict?"SAFE CONFLICT PRACTICE":"YOU CONTROL THE COMMANDS"}</span></div>
  {isConflict&&<><div className="git-conflict-story"><strong>📖 The story</strong><p>While you worked on your feature branch, Sara merged her own change into <code>main</code>. Both of you edited the same line. Nobody did anything wrong—Git needs your help to combine the work.</p><small>Starting point: <code>feature/summary</code> · Your commit is already made · <code>main</code> has moved ahead</small></div><div className="git-conflict-tabs">{tabs.map((t,i)=><button type="button" key={t[0]} className={tab===i?"active":""} onClick={()=>setTab(i)}>{i+1}. {t[0]}</button>)}</div><div className="git-conflict-tab-detail"><strong>{tabs[tab][0]}</strong><p>{tabs[tab][1]}</p>{tab===0&&<div className="git-conflict-branch-diagram"><span>main · Sara <b>●────●</b></span><span>feature · You <b>●────●</b></span><small>Both branches changed the same line after their shared base.</small></div>}</div><div className="git-conflict-anatomy"><strong>Conflict anatomy</strong><div><span className="marker-mine">{"<<<<<<< HEAD · your version"}</span><span className="marker-divider">{"======= · separator"}</span><span className="marker-theirs">{">>>>>>> origin/main · Sara's version"}</span></div></div></>}
  <div className="git-lab-editor">
   <div className="git-lab-editor-head"><span><Code2 size={15}/> app.js <i className={fileState==="clean"?"":"git-file-dirty"}/></span><small>{isConflict?(conflictActive?(conflictResolved?"Resolved · staged":"Conflict · edit both sides carefully"):"Starter file · 6 lines"):fileState==="clean"?"Saved version":fileState==="modified"?"Modified · not staged":fileState==="staged"?"Staged for commit":fileState==="committed"?"Committed locally":"Pushed to GitHub"}</small></div>
   {isConflict&&conflictActive&&<div className="git-conflict-legend"><span className="marker-mine">Your version (HEAD)</span><span className="marker-divider">Divider (=======)</span><span className="marker-theirs">Sara's version (origin/main)</span></div>}
   <div className="git-conflict-editor-wrap">{isConflict&&conflictActive&&<pre className="git-conflict-highlight" aria-hidden="true">{code.split("\n").map((line,i)=><span key={i} className={line.startsWith("<<<<<<<")?"marker-mine":line==="======="?"marker-divider":line.startsWith(">>>>>>>")?"marker-theirs":line===scenario.mine?"marker-mine":line===scenario.theirs?"marker-theirs":""}>{line||" "}</span>)}</pre>}<textarea aria-label="Edit app.js code" spellCheck="false" value={code} onChange={e=>{setCode(e.target.value);if(isConflict){setConflictResolved(false);setFileState("modified");setOutput("File edited. Check that every conflict marker is removed and the final code follows this round's rule.");}else{setFileState("modified");setPrOpen(false);setApproved(false);setMerged(false);setOutput("File changed in your working directory. Try git status or git diff.");}}}/></div>
   <div className="git-lab-editor-foot"><span>{isConflict?"Edit the conflicted file directly. Remove every marker.":"Edit the code to create a working-tree change."}</span><button type="button" onClick={()=>{setCode(isConflict?scenario.starter:baseCode);setFileState("clean");setConflictResolved(false);setOutput("Starter code restored.");}}>Restore starter code</button></div>
  </div>
  {isConflict&&conflictActive&&<div className="git-conflict-help"><strong>How to solve this step</strong><span>Do not type these marker symbols into the terminal. They are temporary labels inside app.js. Choose one button below; it replaces the whole file with a clean version and removes all three marker lines automatically.</span><div><button type="button" onClick={()=>{setCode(resolvedCode(scenario.mine));setConflictResolved(false);setFileState("modified");setOutput("✓ Your HEAD version is selected. The conflict markers are removed. Next run git add app.js.");}}>Keep my version (HEAD)</button><button type="button" onClick={()=>{setCode(resolvedCode(scenario.theirs));setConflictResolved(false);setFileState("modified");setOutput("✓ Sara's version is selected. The conflict markers are removed. Next run git add app.js.");}}>Keep Sara's version</button><button type="button" onClick={()=>{setCode(round===0?resolvedCode(scenario.mine):resolvedCode('  return "Welcome, " + user.name + " — welcome back!";'));setConflictResolved(false);setFileState("modified");setOutput("✓ A valid conflict-free solution is selected. The conflict markers are removed. Next run git add app.js.");}}>Use the combined version</button></div><small>{round===0?"Round 1: either version is accepted. Choose either of the first two buttons.":"Round 2: choose the combined version so the greeting keeps the name and adds the returning-member message."}</small></div>}
  <div className="git-lab-mission"><div className="git-lab-mission-head"><div><strong>{isConflict?"Your conflict-resolution mission":isWorkflow?"Your GitHub mission":"Your Git mission"}</strong><small>Use the terminal below. The lab checks your resolution before staging and committing.</small></div><div className="git-lab-mission-actions"><span>{mission.filter(x=>x[1]).length}/{mission.length} complete</span><button type="button" onClick={()=>setShowAnswer(v=>!v)}>{showAnswer?"Hide answer":"Show answer"}</button></div></div><div className="git-lab-mission-list">{mission.map((item,i)=><div className={item[1]?"complete":""} key={item[0]}><span>{item[1]?"✓":i+1}</span>{item[0]}</div>)}</div></div>
  {showAnswer&&<div className="git-lab-answer"><div><span className="git-lab-answer-kicker">STEP-BY-STEP SOLUTION</span><strong>{answer.title}</strong><p>{answer.explanation}</p>{answer.command&&<div className="git-lab-answer-command"><code>{answer.command}</code><button type="button" onClick={applyAnswer}>Use this command</button></div>}{answer.code&&<><p><strong>This is the complete final content of app.js:</strong> copy it into the editor by clicking the button. You do not need to edit individual marker lines.</p><pre>{answer.code}</pre><button type="button" onClick={applyAnswer}>Apply this solution to app.js</button></>}</div></div>}
  {isWorkflow&&prOpen&&<div className="git-review-panel"><div className="git-review-head"><strong>Pull request #1 · Add login validation</strong><span>{merged?"Merged":approved?"Approved":"Open · awaiting review"}</span></div><p><code>feature/login</code> wants to merge into <code>main</code></p><div className="git-review-diff"><div><span>app.js · Files changed</span><small>+1 −1</small></div><pre>- return { "{ email, authenticated: true }" };
+ return { "{ email, authenticated: Boolean(email && password) }" };</pre></div><label className="git-review-comment">Reviewer comment<textarea defaultValue="Looks good. The change is clear and ready to merge." disabled={approved||merged}/></label><div className="git-review-actions"><small>Review the proposed change before approving.</small><button type="button" disabled={approved||merged} onClick={()=>{setApproved(true);setOutput("✓ Review approved. Run merge pr to finish.");}}>✓ Approve pull request</button></div></div>}
  {isConflict&&prOpen&&<div className="git-review-panel"><div className="git-review-head"><strong>Pull request #{round===0?2:3} · {round===0?"Update feature summary":"Update welcome message"}</strong><span>{merged?"Merged":pushed?"No conflicts · ready for review":"⚠ Has conflicts"}</span></div><p><code>feature/summary</code> wants to merge into <code>main</code></p>{!pushed?<div className="git-conflict-banner">This branch has conflicts that must be resolved before GitHub can merge it.</div>:<div className="git-conflict-mergeable">✓ This branch has no conflicts with the base branch.</div>}<div className="git-review-actions"><small>{pushed?"Review the resolved diff, approve, then merge.":"Resolve locally and push the merge commit to update this pull request."}</small><button type="button" disabled={!pushed||approved||merged} onClick={()=>{setApproved(true);setOutput("✓ Review approved. Run merge pr to finish.");}}>✓ Approve pull request</button></div></div>}
  <div className="git-lab-flow" aria-label="Git workflow progress">{stages.map((s,i)=><div className={"git-lab-stage "+(i===activeStage?"is-current":s[3]?"is-done":"")} key={s[0]+s[1]}><div className="git-lab-stage-icon">{s[3]?"✓":s[0]}</div><strong>{s[1]}</strong><small>{s[2]}</small></div>)}</div>
  <div className="git-lab-terminal"><div className="git-lab-terminal-title"><span><Terminal size={15}/> Git command line</span><small>SIMULATED REPOSITORY · {currentBranch}</small></div><form onSubmit={e=>{e.preventDefault();runCommand(command);}} className="git-lab-command-form"><span>$</span><input value={command} onChange={e=>setCommand(e.target.value)} placeholder="Type a Git command..." aria-label="Git command"/><button type="submit" disabled={!command.trim()}>Run command <ArrowRight size={14}/></button></form><pre className="git-lab-output" aria-live="polite">{output}</pre>{history.length>0&&<div className="git-lab-history">{history.map((item,i)=><span key={i}>{item}</span>)}</div>}</div>
  <div className="git-lab-shortcuts"><div><strong>Command toolbox</strong><small>Select a command to load it into the terminal, then run it.</small></div><div className="git-lab-shortcut-list">{(isConflict?["git status","git log --oneline --graph --all","open pr","git pull origin main","git status --short","git diff","git diff --staged","git merge --abort","git add app.js",'git commit -m "Resolve merge conflict"',"git push origin feature/summary","approve pr","merge pr","git switch main","git pull origin main"]:isWorkflow?["git status","git switch -c feature/login","git add app.js",'git commit -m "Add login"',"git push -u origin feature/login","open pr","approve pr","merge pr","git switch main","git pull origin main"]:["git status","git diff","git add app.js","git diff --staged",'git commit -m "Add greeting"',"git log --oneline","git push origin main"]).map(cmd=><button type="button" key={cmd} onClick={()=>setCommand(cmd)}>{cmd}</button>)}</div></div>
  <div className="git-lab-commit-card"><div><strong>Local commit history</strong><small>{commits.length?commits.length+" commit(s) in this session":"No commits yet."}</small></div><div className="git-lab-commit-entry">{commits.map(c=><div key={c.id+c.message}><code>{c.id}</code><span>{c.message}</span><small>{c.branch}</small></div>)}</div></div>
  <div className={"git-lab-explain "+(isConflict?conflictResolved?"success":"":fileState==="pushed"||merged?"success":"")}><strong>{isConflict?(merged?"🎉 Conflict resolved and pull request merged":pushed?"✓ GitHub now sees a mergeable pull request":conflictResolved?"✓ The final file is resolved":conflictActive?"⚠ Resolve the conflict markers":"🌿 Your branches have diverged"):isWorkflow?(merged?"🎉 Feature merged on GitHub":approved?"✓ Pull request approved":prOpen?"🔎 Pull request is open":"Start by creating a branch"):(fileState==="pushed"?"☁️ Your code is on GitHub":"💻 Your working directory")}</strong><p>{isConflict?(conflictActive?(checkResolution()||"The final file is ready. Stage it, commit the merge, and push the branch."):"Sara's commit is on main while your feature commit is on feature/summary. Pull main into your branch to let Git identify overlapping edits."):isWorkflow?"A feature branch keeps work separate until it has been reviewed and merged.":"Git records snapshots locally before you push them to GitHub."}</p></div>
  {isConflict&&round===0&&pulled&&<div className="git-conflict-round-next"><strong>Round 1 complete.</strong><span>Now try Round 2: both changes matter, so combine them in one final line.</span><button type="button" onClick={nextRound}>Start Round 2 <ArrowRight size={14}/></button></div>}
  <div className="git-lab-footer"><span>Practice simulation only · No real files or GitHub repository are changed.</span><button type="button" onClick={reset}>↺ Reset exercise</button></div>
 </section>;
}
