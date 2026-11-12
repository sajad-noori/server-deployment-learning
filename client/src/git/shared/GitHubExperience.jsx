import { useMemo, useState } from "react";
import { GitBranch, GitCommit, GitPullRequest, ShieldCheck, Sparkles, Trophy, Users, Zap } from "lucide-react";

export function GitHubExperience({
  mode, currentBranch, fileState, branchCreated, prOpen, approved, merged, pulled,
  conflictActive, conflictResolved, mergeCommitted, pushed, mission
}) {
  const [view, setView] = useState("story");
  const completed = mission.filter((item) => item[1]).length;
  const total = mission.length;
  const xp = completed * 25;
  const rank = xp >= 500 ? "GitHub pro" : xp >= 250 ? "Team contributor" : xp >= 100 ? "Rising developer" : "New collaborator";
  const workflow = mode === "workflow";
  const conflict = mode === "conflicts";
  const events = useMemo(() => {
    if (conflict) return [
      ["Sara", "merged a homepage update into main", true],
      ["You", "saved your feature work on feature/summary", true],
      ["Git", "detected overlapping edits", conflictActive || conflictResolved || mergeCommitted || pushed || merged],
      ["You", "resolved the conflict and recorded the merge", conflictResolved || mergeCommitted || pushed || merged],
      ["GitHub", "received your updated branch", pushed || merged],
      ["Team", "merged the reviewed pull request", merged],
    ];
    if (workflow) return [
      ["You", "created an isolated feature branch", branchCreated],
      ["You", "saved a local commit", fileState === "committed" || fileState === "pushed" || prOpen || merged],
      ["GitHub", "received your feature branch", fileState === "pushed" || prOpen || merged],
      ["Reviewer", "approved the pull request", approved || merged],
      ["Team", "merged the feature into main", merged],
      ["You", "updated your local main branch", pulled],
    ];
    return [
      ["You", "edited app.js in your working folder", fileState !== "clean"],
      ["Git", "added the change to the staging area", ["staged", "committed", "pushed"].includes(fileState)],
      ["You", "created a local commit", ["committed", "pushed"].includes(fileState)],
      ["GitHub", "received your commit", fileState === "pushed"],
    ];
  }, [conflict, workflow, branchCreated, fileState, prOpen, approved, merged, pulled, conflictActive, conflictResolved, mergeCommitted, pushed]);

  const status = conflict
    ? merged ? "Pull request merged" : pushed ? "Ready for final review" : conflictResolved ? "Conflict resolved locally" : conflictActive ? "Merge conflict needs you" : "Two branches have diverged"
    : workflow
      ? pulled ? "Local and remote are in sync" : merged ? "Merged on GitHub · local main is behind" : approved ? "Approved · ready to merge" : prOpen ? "Pull request open" : "Feature mission in progress"
      : fileState === "pushed" ? "Published to GitHub" : fileState === "committed" ? "Saved locally" : fileState === "staged" ? "Changes staged" : fileState === "modified" ? "Working tree changed" : "Repository ready";

  const nodes = conflict
    ? [{name:"main",detail:"Sara's update",done:true},{name:"feature/summary",detail:"Your feature",done:true}]
    : workflow
      ? [{name:"main",detail:"Protected branch",done:true},{name:"feature/login",detail:"Your feature branch",done:branchCreated}]
      : [{name:"main",detail:"Your current branch",done:true}];

  return <section className="gh-experience">
    <div className="gh-experience-top">
      <div className="gh-experience-intro">
        <span className="gh-eyebrow"><Sparkles size={13}/> YOUR TEAM WORKSPACE</span>
        <h3>A real-world GitHub mission</h3>
        <p>Watch your repository and teammates react as you complete each task.</p>
      </div>
      <div className="gh-xp-card"><span><Zap size={14}/> EXPERIENCE</span><strong>{xp} XP</strong><small>{rank}</small></div>
    </div>
    <div className="gh-tabs" role="tablist" aria-label="Team workspace views">
      <button type="button" role="tab" aria-selected={view === "story"} className={view === "story" ? "active" : ""} onClick={() => setView("story")}><Users size={14}/> Team story</button>
      <button type="button" role="tab" aria-selected={view === "repo"} className={view === "repo" ? "active" : ""} onClick={() => setView("repo")}><GitBranch size={14}/> Repository map</button>
      <button type="button" role="tab" aria-selected={view === "awards"} className={view === "awards" ? "active" : ""} onClick={() => setView("awards")}><Trophy size={14}/> Achievements</button>
    </div>
    {view === "story" && <div className="gh-story-view">
      <div className="gh-teammates">
        <div className="gh-person"><span className="gh-avatar you">Y</span><div><strong>You</strong><small>Developer · {currentBranch}</small></div><i className="online-dot"/></div>
        <div className="gh-person"><span className="gh-avatar sara">S</span><div><strong>Sara</strong><small>Teammate · main</small></div><i className="online-dot"/></div>
        <div className="gh-person"><span className="gh-avatar bot">G</span><div><strong>GitHub</strong><small>Repository assistant</small></div><i className="online-dot"/></div>
      </div>
      <div className="gh-live-status"><span className="gh-pulse"/><div><small>LIVE WORKSPACE STATUS</small><strong>{status}</strong></div></div>
      <div className="gh-activity"><div className="gh-activity-heading"><strong>Team activity</strong><small>Updates as you make progress</small></div>
        {events.map(([actor,action,done],index)=><div className={"gh-event "+(done?"done":"pending")} key={actor+action}><span className="gh-event-marker">{done?"✓":"·"}</span><div><strong>{actor}</strong><span>{action}</span></div><small>{done?"Done":index===events.findIndex((event)=>!event[2])?"Next":"Waiting"}</small></div>)}
      </div>
    </div>}
    {view === "repo" && <div className="gh-repo-view">
      <div className="gh-repo-header"><div><small>REPOSITORY</small><strong>acme / web-app</strong></div><span className="gh-private-pill"><ShieldCheck size={12}/> Protected main</span></div>
      <div className="gh-branch-map">
        {nodes.map((node,index)=><div className="gh-branch-row" key={node.name}><span className={"gh-branch-dot "+(node.done?"done":"")}/><div><strong>{node.name}</strong><small>{node.detail}</small></div><span className="gh-branch-label">{node.name === currentBranch ? "CURRENT" : node.done ? "ACTIVE" : "NOT CREATED"}</span></div>)}
        <div className="gh-branch-connector"><GitCommit size={14}/><span>{merged ? "Pull request merged into main" : pushed ? "Commit published to origin" : conflictActive ? "Merge paused · conflict found" : "Your next action moves this graph"}</span></div>
      </div>
      <div className="gh-pr-preview"><div><GitPullRequest size={17}/><strong>Pull request</strong><span className={merged?"merged":prOpen?"open":"draft"}>{merged?"Merged":prOpen?"Open":"Not opened yet"}</span></div><p>{conflict ? "feature/summary → main" : "feature/login → main"}</p><small>{approved ? "Review approved" : prOpen ? "Waiting for a review" : "Publish your branch to start a review"}</small></div>
    </div>}
    {view === "awards" && <div className="gh-awards-view">
      <div className="gh-award-feature"><span><Trophy size={23}/></span><div><small>CURRENT RANK</small><strong>{rank}</strong><p>{xp} experience points earned. Complete mission tasks to unlock the next rank.</p></div></div>
      <div className="gh-award-grid">
        <div className={branchCreated || !workflow && !conflict ? "unlocked" : ""}><GitBranch size={18}/><strong>Branch builder</strong><small>{branchCreated || !workflow && !conflict ? "Unlocked" : "Create a feature branch"}</small></div>
        <div className={prOpen || conflict && prOpen ? "unlocked" : ""}><GitPullRequest size={18}/><strong>Review ready</strong><small>{prOpen ? "Unlocked" : "Open a pull request"}</small></div>
        <div className={merged ? "unlocked" : ""}><Trophy size={18}/><strong>Ship it</strong><small>{merged ? "Unlocked" : "Merge a pull request"}</small></div>
      </div>
      <div className="gh-progress"><div><strong>Mission progress</strong><span>{completed}/{total}</span></div><i><b style={{width: (total ? completed / total * 100 : 0) + "%"}}/></i></div>
    </div>}
  </section>;
}
