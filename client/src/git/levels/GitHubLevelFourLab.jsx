import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Code2, Terminal } from "lucide-react";

const starter = `const profile = {
  name: "Alex",
  title: "Developer",
};

console.log(profile);
`;
const solutionOne = `const profile = {
  name: "Alex",
  title: "Frontend Developer",
};

console.log(profile);
`;
const solutionTwo = `const profile = {
  name: "Alex",
  title: "Frontend Developer",
  focus: "React and Node.js",
};

console.log(profile);
`;
const steps = [
 ["Check the repository","git status","Confirm you are starting on main with a clean working tree."],
 ["Create a feature branch","git switch -c feature/profile-card","Create an isolated branch for the profile-card change."],
 ["Update the profile title","Edit app.js","Change the title to Frontend Developer, then save the file."],
 ["Stage the first change","git add app.js","Stage the file after checking the edit."],
 ["Commit the feature","git commit -m \"Add profile card\"","Create a clear commit for the feature."],
 ["Publish your branch","git push -u origin feature/profile-card","Publish the branch and set its upstream."],
 ["Open a pull request","open pr","Create a pull request from feature/profile-card into main."],
 ["Address review feedback","Edit app.js","The reviewer asks you to add a focus field with the value React and Node.js."],
 ["Stage the review update","git add app.js","Stage the follow-up change."],
 ["Commit the review update","git commit -m \"Address review feedback\"","Save the requested improvement in a second commit."],
 ["Push the update","git push","Update the existing pull request with your new commit."],
 ["Approve and merge","approve pr, then merge pr","Approve the updated pull request, then merge it into GitHub main."],
 ["Update local main","git switch main, then git pull origin main","Bring the merged change into your local main branch."],
 ["Delete the finished branch","git branch -d feature/profile-card","Clean up the local feature branch after merging."],
];

export function GitHubLevelFourLab({onComplete}){
 const key="deploylab-github-level-four";
 const saved=(()=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch{return null}})();
 const init=(name,fallback)=>saved?.[name]??fallback;
 const [code,setCode]=useState(()=>init("code",starter));
 const [branch,setBranch]=useState(()=>init("branch","main"));
 const [branchCreated,setBranchCreated]=useState(()=>init("branchCreated",false));
 const [statusChecked,setStatusChecked]=useState(()=>init("statusChecked",false));
 const [fileStaged,setFileStaged]=useState(()=>init("fileStaged",false));
 const [commitOne,setCommitOne]=useState(()=>init("commitOne",false));
 const [pushed,setPushed]=useState(()=>init("pushed",false));
 const [prOpen,setPrOpen]=useState(()=>init("prOpen",false));
 const [reviewReady,setReviewReady]=useState(()=>init("reviewReady",false));
 const [fileStagedTwo,setFileStagedTwo]=useState(()=>init("fileStagedTwo",false));
 const [commitTwo,setCommitTwo]=useState(()=>init("commitTwo",false));
 const [pushTwo,setPushTwo]=useState(()=>init("pushTwo",false));
 const [approved,setApproved]=useState(()=>init("approved",false));
 const [merged,setMerged]=useState(()=>init("merged",false));
 const [pulled,setPulled]=useState(()=>init("pulled",false));
 const [deleted,setDeleted]=useState(()=>init("deleted",false));
 const [command,setCommand]=useState("");
 const [output,setOutput]=useState("Welcome to the GitHub team challenge. Start with git status.");
 const [history,setHistory]=useState([]);
 const [showAnswer,setShowAnswer]=useState(false);
 const [codeTouched,setCodeTouched]=useState(()=>init("codeTouched",false));

 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify({code,branch,branchCreated,statusChecked,fileStaged,commitOne,pushed,prOpen,reviewReady,fileStagedTwo,commitTwo,pushTwo,approved,merged,pulled,deleted,codeTouched}))}catch{}},[code,branch,branchCreated,statusChecked,fileStaged,commitOne,pushed,prOpen,reviewReady,fileStagedTwo,commitTwo,pushTwo,approved,merged,pulled,deleted,codeTouched]);

 const profileReady=code.includes('title: "Frontend Developer"');
 const feedbackReady=profileReady&&code.includes('focus: "React and Node.js"');
 const done=[statusChecked,branchCreated,profileReady,fileStaged,commitOne,pushed,prOpen,feedbackReady&&reviewReady,fileStagedTwo,commitTwo,pushTwo,approved&&merged,pulled,deleted];
 const next=done.findIndex(x=>!x);
 const allDone=done.every(Boolean);
 const progress=done.filter(Boolean).length;
 const answer=useMemo(()=>{
  if(!statusChecked)return {title:steps[0][0],command:"git status",why:"Check the current branch and confirm the working tree is clean."};
  if(!branchCreated)return {title:steps[1][0],command:"git switch -c feature/profile-card",why:"Create and switch to a separate feature branch. Do not work directly on main."};
  if(!profileReady)return {title:steps[2][0],code:solutionOne,why:"In the app.js editor, change only the title value to Frontend Developer. Apply the suggested file if you want help."};
  if(!fileStaged)return {title:steps[3][0],command:"git add app.js",why:"Stage the updated profile file."};
  if(!commitOne)return {title:steps[4][0],command:'git commit -m "Add profile card"',why:"Commit the staged first version with a message that describes the change."};
  if(!pushed)return {title:steps[5][0],command:"git push -u origin feature/profile-card",why:"The -u option publishes the branch and sets its upstream tracking branch."};
  if(!prOpen)return {title:steps[6][0],command:"open pr",why:"Open a pull request from feature/profile-card into main."};
  if(!feedbackReady)return {title:steps[7][0],code:solutionTwo,why:"The reviewer asks for one extra field. Keep the title and add focus: React and Node.js."};
  if(!fileStagedTwo)return {title:steps[8][0],command:"git add app.js",why:"Stage the review update separately."};
  if(!commitTwo)return {title:steps[9][0],command:'git commit -m "Address review feedback"',why:"Save the requested change in a second commit."};
  if(!pushTwo)return {title:steps[10][0],command:"git push",why:"Push the new commit to the same remote feature branch. This updates the existing pull request."};
  if(!approved)return {title:"Approve the pull request",command:"approve pr",why:"The reviewer has checked the updated change. Approve it before merging."};
  if(!merged)return {title:"Merge the pull request",command:"merge pr",why:"Merge the approved pull request into GitHub main."};
  if(!pulled)return {title:steps[12][0],command:branch==="main"?"git pull origin main":"git switch main",why:"Switch to main first, then pull the merged commit from GitHub."};
  if(!deleted)return {title:steps[13][0],command:"git branch -d feature/profile-card",why:"The feature is merged and local main is updated, so the local feature branch can be deleted."};
  return {title:"Challenge complete",why:"You handled a feature branch, two commits, review feedback, a pull request, merge, local sync, and branch cleanup."};
 },[statusChecked,branchCreated,profileReady,fileStaged,commitOne,pushed,prOpen,feedbackReady,fileStagedTwo,commitTwo,pushTwo,approved,merged,pulled,deleted,branch]);

 function run(raw=command){
  const cmd=raw.trim(),c=cmd.toLowerCase();if(!c)return;
  let msg="Command not recognized. Use the command toolbox or Show answer for a hint.";
  if(c==="git status"){
   setStatusChecked(true);
   msg="On branch "+branch+"\n"+(deleted?"nothing to commit, working tree clean":fileStaged||fileStagedTwo?"Changes to be committed:\n  modified: app.js":codeTouched?"Changes not staged for commit:\n  modified: app.js":"nothing to commit, working tree clean");
  }else if(c==="git switch -c feature/profile-card"){
   if(branchCreated)msg="The branch already exists. You are already using feature/profile-card.";
   else if(branch!=="main")msg="Switch to main before creating the feature branch.";
   else{setBranchCreated(true);setBranch("feature/profile-card");msg="Switched to a new branch 'feature/profile-card'.";}
  }else if(c==="git add app.js"){
   if(!branchCreated)msg="Create the feature branch first.";
   else if(!profileReady)msg='The requested title is missing. Edit app.js and set title to "Frontend Developer" before staging.';
   else if(prOpen&&!feedbackReady)msg="The reviewer requested the focus field. Add it before staging this second change.";
   else if(prOpen&&!fileStagedTwo){setFileStagedTwo(true);msg="✓ Review update staged. Create the second commit.";}
   else if(!prOpen&&!fileStaged){setFileStaged(true);msg="✓ app.js staged. Ready for the first commit.";}
   else msg="No unstaged changes to add.";
  }else if(c.startsWith("git commit")){
   const message=cmd.match(/-m\s+["'](.+?)["']\s*$/)||cmd.match(/-m\s+(.+)$/);
   if(!message)msg='Add a message, for example: git commit -m "Add profile card"';
   else if(!fileStaged&&!fileStagedTwo)msg="Nothing staged. Run git add app.js first.";
   else if(fileStaged&&!commitOne){setCommitOne(true);msg="✓ Commit created: a31c9d2 Add profile card";}
   else if(fileStagedTwo&&!commitTwo){setCommitTwo(true);msg="✓ Commit created: b72e4f1 Address review feedback";}
   else msg="There is nothing new staged to commit.";
  }else if(c==="git push -u origin feature/profile-card"||c==="git push"){
   if(!commitOne)msg="Create the first commit before pushing.";
   else if(!pushed&&c!=="git push -u origin feature/profile-card")msg="Use -u on the first push to publish the branch and set upstream tracking: git push -u origin feature/profile-card.";
   else if(!pushed){setPushed(true);msg="✓ Branch published to origin/feature/profile-card. Upstream tracking is set.";}
   else if(!commitTwo)msg="No new commit to push yet. Address the review feedback, stage, and commit first.";
   else if(!pushTwo){setPushTwo(true);msg="✓ New commit pushed. Pull request #12 now includes your review update.";}
   else msg="Everything is up to date.";
  }else if(c==="open pr"){
   if(!pushed)msg="Push feature/profile-card first.";
   else if(prOpen)msg="Pull request #12 is already open.";
   else{setPrOpen(true);msg="✓ Pull request #12 opened: feature/profile-card → main. A reviewer has requested one small improvement.";}
  }else if(c==="approve pr"){
   if(!prOpen||!pushTwo)msg="The review update must be pushed before the pull request can be approved.";
   else{setApproved(true);msg="✓ Pull request approved. It is ready to merge.";}
  }else if(c==="merge pr"){
   if(!approved)msg="The pull request needs approval before it can be merged.";
   else{setMerged(true);msg="✓ Pull request #12 merged into GitHub main.";}
  }else if(c==="git switch main"){
   if(!merged)msg="Merge the pull request before switching back to main.";
   else{setBranch("main");msg="Switched to branch 'main'. Run git pull origin main next.";}
  }else if(c==="git pull origin main"){
   if(!merged||branch!=="main")msg="Switch to main after the pull request is merged, then pull.";
   else{setPulled(true);msg="✓ Fast-forwarded. Your local main now includes the merged profile-card change.";}
  }else if(c==="git branch -d feature/profile-card"){
   if(!pulled)msg="Update local main first. Then delete the merged feature branch.";
   else{setDeleted(true);setBranchCreated(false);msg="Deleted branch feature/profile-card (was b72e4f1). Your main branch is safe.";}
  }else if(c==="git branch"){
   msg="* "+branch+"\n"+(deleted?"":branch==="main"?"  feature/profile-card":"  main");
  }else if(c==="clear"){msg="Terminal cleared.";}
  setOutput(msg);setHistory(v=>[...v.slice(-7),"$ "+cmd]);setCommand("");
 }
 function reset(){
  localStorage.removeItem(key);setCode(starter);setBranch("main");setBranchCreated(false);setStatusChecked(false);setFileStaged(false);setCommitOne(false);setPushed(false);setPrOpen(false);setReviewReady(false);setFileStagedTwo(false);setCommitTwo(false);setPushTwo(false);setApproved(false);setMerged(false);setPulled(false);setDeleted(false);setCodeTouched(false);setCommand("");setOutput("Welcome to the GitHub team challenge. Start with git status.");setHistory([]);setShowAnswer(false);
 }
 const runAnswer=()=>{if(answer.command){setCommand(answer.command);setOutput("Command loaded. Click Run command to execute it.");}else if(answer.code){setCode(answer.code);setCodeTouched(true);setReviewReady(prOpen);setOutput("✓ Suggested app.js content applied. Continue with git add app.js.");}};

 return <section className="git-lab git-lab-clean">
  <div className="git-lab-heading"><div><span className="playground-kicker">LEVEL 04 · PRACTICE ONLY</span><h2>GitHub team challenge</h2><p>Build a profile card, publish it on a feature branch, respond to review feedback, and merge the pull request.</p></div><span className="git-lab-tag">INTERMEDIATE</span></div>
  <div className="git-clean-grid" style={{display:"grid",gridTemplateColumns:"minmax(0,1.4fr) minmax(220px,.8fr)",gap:18,padding:20}}>
   <div style={{display:"grid",gap:14,minWidth:0}}>
    <div className="git-lab-editor">
     <div className="git-lab-editor-head"><span><Code2 size={15}/> app.js</span><small>{feedbackReady?"Review feedback added":profileReady?"Title updated":"Starter file"}</small></div>
     <textarea aria-label="Edit app.js" spellCheck="false" value={code} onChange={e=>{const nextCode=e.target.value;setCode(nextCode);setCodeTouched(true);setReviewReady(prOpen&&nextCode.includes('focus: "React and Node.js"'));setFileStaged(false);setFileStagedTwo(false);setOutput("File changed. Stage it with git add app.js when ready.");}}/>
     <div className="git-lab-editor-foot"><span>{prOpen?'Reviewer request: add focus: "React and Node.js".':'Change title to Frontend Developer.'}</span><button type="button" onClick={()=>{setCode(starter);setCodeTouched(false);setReviewReady(false);setFileStaged(false);setFileStagedTwo(false);}}>Restore starter</button></div>
     {prOpen&&<div className="git-conflict-help"><strong>Review feedback</strong><span>Please add a focus field so visitors can see the technologies this developer works with.</span><small>{feedbackReady?'The requested field is present in app.js.':'Add focus: "React and Node.js" inside the profile object.'}</small></div>}
    </div>
    <div className="git-lab-terminal">
     <div className="git-lab-terminal-title"><span><Terminal size={15}/> Git command line</span><small>SIMULATED · {branch}</small></div>
     <form onSubmit={e=>{e.preventDefault();run();}} className="git-lab-command-form"><span>$</span><input value={command} onChange={e=>setCommand(e.target.value)} placeholder="Enter a Git command..." aria-label="Git command"/><button type="submit" disabled={!command.trim()}>Run <ArrowRight size={14}/></button></form>
     <pre className="git-lab-output" aria-live="polite">{output}</pre>{history.length>0&&<div className="git-lab-history">{history.map((item,i)=><span key={i}>{item}</span>)}</div>}
    </div>
   </div>
   <aside className="git-clean-checklist" style={{border:"1px solid #2b3b4d",borderRadius:12,padding:16,background:"#111b29",alignSelf:"start"}}>
    <h3>YOUR MISSION CHECKLIST</h3><p>{progress} of {steps.length} tasks completed</p>
    <div className="git-clean-task-list">{steps.map((item,i)=><div className={"git-clean-task "+(done[i]?"done":"")} key={item[0]}><span>{done[i]?"✓":""}</span><span>{item[0]}{!done[i]&&i>0&&!done[i-1]?<small>Complete the previous task first</small>:null}</span></div>)}</div>
    <div className="git-clean-files"><strong>YOUR WORKSPACE</strong><div>📄 app.js</div><div>🌿 Current branch: {branch}</div>{prOpen&&<div>↗ Pull request: {merged?"Merged":approved?"Approved":"Open"}</div>}</div>
    {allDone&&<button type="button" className="complete-btn marked" onClick={onComplete}><CheckCircle2 size={16}/> Mark level complete</button>}
   </aside>
  </div>
  {showAnswer&&<div className="git-lab-answer"><strong>{answer.title}</strong><p>{answer.why}</p>{answer.command&&<div><code>{answer.command}</code><button type="button" onClick={runAnswer}>Use command</button></div>}{answer.code&&<><pre>{answer.code}</pre><button type="button" onClick={runAnswer}>Apply code to app.js</button></>}</div>}
  <div className="git-lab-footer"><span>Practice simulation only · No real files or GitHub repository are changed.</span><div><button type="button" onClick={()=>setShowAnswer(v=>!v)}>{showAnswer?"Hide answer":"Show answer"}</button><button type="button" onClick={reset}>↺ Reset challenge</button></div></div>
 </section>;
}
