// @ts-nocheck
import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import "./git-visual.css";

const ORDER = {
  "git-basics": [
    { title: "The Git workflow", id: "workflow" },
    { title: "Stage your changes", id: "stage" },
    { title: "Create a commit", id: "commit" },
    { title: "Push to GitHub", id: "push" },
  ],
  "github-workflow": [
    { title: "Remote repositories", id: "remote" },
    { title: "Create a branch", id: "branch" },
    { title: "Push your branch", id: "push-branch" },
    { title: "Open a pull request", id: "pr" },
  ],
};

const SCENES = {
  workflow: {
    title: "The Git workflow",
    track: ["Your files", "Staging", "Local commit", "GitHub"],
    beats: [
      { at: 0, label: "Edit files", text: "You change files in the working directory. Git is watching, but it has not saved a snapshot yet.", status: "Only on your computer" },
      { at: 1, label: "Stage a selection", text: "git add moves the changes you choose into the staging area. That is a review step, not an upload.", command: "git add .", status: "Only on your computer" },
      { at: 2, label: "Commit locally", text: "git commit freezes the staged changes into a named snapshot. The snapshot stays in your local repository.", command: 'git commit -m "Add homepage"', status: "Saved locally, not on GitHub" },
      { at: 3, label: "Push to GitHub", text: "git push sends that commit to GitHub. Your computer and GitHub now hold the same snapshot.", command: "git push origin main", status: "On GitHub too" },
    ],
    View: Workflow,
  },
  stage: {
    title: "Stage your changes",
    track: ["See changes", "Choose files", "Staging area", "Still local"],
    beats: [
      { at: 0, label: "Three changed files", text: "Git sees everything you touched. Nothing is staged, so the next commit would be empty.", command: "git status", status: "Only on your computer" },
      { at: 1, label: "Leave the scratch file out", text: "You include app.js and styles.css. notes.txt is a scratch file, so it stays unstaged.", status: "Only on your computer" },
      { at: 2, label: "Only the checked files move", text: "git add copies just those two into the staging area. notes.txt is not part of the next snapshot.", command: "git add src/app.js src/styles.css", status: "Only on your computer" },
      { at: 3, label: "Staging is not GitHub", text: "Staged files are still on your machine. GitHub does not receive them until you commit and push.", status: "Not uploaded" },
    ],
    View: Stage,
  },
  commit: {
    title: "Create a commit",
    track: ["Staged files", "Message", "Snapshot", "Local history"],
    beats: [
      { at: 0, label: "Ready to record", text: "The staging area holds the files that belong in this snapshot. Older commits are already in history.", status: "Only on your computer" },
      { at: 1, label: "Say why", text: "The message records the purpose of the change. “Add homepage” is more useful than “update”.", command: 'git commit -m "Add homepage"', status: "Only on your computer" },
      { at: 2, label: "Seal the snapshot", text: "The commit packages the staged files and the message. After that, the staging area is empty.", status: "Saved locally, not on GitHub" },
      { at: 3, label: "Stacked on history", text: "The new commit points at the previous one. This history is still only in your local repository.", status: "GitHub does not have it yet" },
    ],
    View: Commit,
  },
  push: {
    title: "Push to GitHub",
    track: ["Ahead of GitHub", "Uploading", "Same commit", "In sync"],
    beats: [
      { at: 0, label: "One commit ahead", text: "Your main has “Add homepage”. GitHub’s origin/main stopped at the older commit.", status: "GitHub is behind" },
      { at: 1, label: "Send it up", text: "git push origin main uploads commits that the remote does not have yet.", command: "git push origin main", status: "Uploading" },
      { at: 2, label: "Remote caught up", text: "origin/main now points at the same commit as your main. The hashes match.", status: "GitHub matches you" },
      { at: 3, label: "Nothing left to send", text: "A later push is quiet when there is no new commit. GitHub already has this snapshot.", status: "In sync" },
    ],
    View: Push,
  },
  remote: {
    title: "Remote repositories",
    track: ["Two copies", "The name origin", "One URL", "Push and fetch"],
    beats: [
      { at: 0, label: "Two repositories", text: "One copy lives on your computer. GitHub holds a second copy. They are not the same folder.", status: "Separate copies" },
      { at: 1, label: "origin is a nickname", text: "origin is just the local name for the GitHub URL. You could pick another name. origin is the usual one.", status: "A name, not a place" },
      { at: 2, label: "Fetch and push share the URL", text: "git remote -v lists where downloads and uploads go. Both point at your GitHub repository.", command: "git remote -v", status: "origin → GitHub" },
      { at: 3, label: "Direction matters", text: "Push sends your commits up. Fetch brings down commits that someone else pushed.", status: "origin → GitHub" },
    ],
    View: Remote,
  },
  branch: {
    title: "Create a branch",
    track: ["HEAD on main", "New branch", "Commit there", "main stays"],
    beats: [
      { at: 0, label: "You are on main", text: "HEAD is the tip of main. A commit right now would move main forward.", status: "On main" },
      { at: 1, label: "Branch off the tip", text: "git switch -c feature/login creates a branch at this commit and moves HEAD onto it.", command: "git switch -c feature/login", status: "On feature/login" },
      { at: 2, label: "Work stays on the branch", text: "The login commit is added to feature/login only. main’s tip does not move.", status: "On feature/login" },
      { at: 3, label: "main is unchanged", text: "You can switch back to main and the login work will not be there until you merge it.", status: "main is safe" },
    ],
    View: Branch,
  },
  "push-branch": {
    title: "Push your branch",
    track: ["Only local", "Upload", "On GitHub", "Tracking"],
    beats: [
      { at: 0, label: "GitHub cannot see it", text: "feature/login exists on your computer. The GitHub copy of the repo still only has main.", status: "Branch is local" },
      { at: 1, label: "Publish the branch", text: "git push -u origin feature/login uploads the commits and the branch name.", command: "git push -u origin feature/login", status: "Uploading" },
      { at: 2, label: "A remote branch appears", text: "GitHub now has origin/feature/login pointing at the same commit.", status: "On GitHub" },
      { at: 3, label: "Upstream is linked", text: "The -u flag remembers that link. Next time you can run git push without naming the remote.", status: "Tracking origin/feature/login" },
    ],
    View: PushBranch,
  },
  pr: {
    title: "Open a pull request",
    track: ["Propose", "Read the diff", "Review", "Merge"],
    beats: [
      { at: 0, label: "A proposal, not a merge", text: "A pull request asks to merge feature/login into main. Opening it does not change main yet.", status: "Not merged" },
      { at: 1, label: "Reviewers see the diff", text: "The pull request shows lines added and removed. People review the change, not your whole disk.", status: "Not merged" },
      { at: 2, label: "Checks and approval", text: "A teammate approves. Automated checks can be required before the merge button is used.", status: "Approved, not merged" },
      { at: 3, label: "Merge into main", text: "Merging adds the feature commits onto main. The login work is now on the main line.", status: "Merged into main" },
    ],
    View: PullRequest,
  },
};

export function hasGitVisual(lessonId) {
  return Object.prototype.hasOwnProperty.call(ORDER, lessonId);
}

function resolve(lessonId, stepTitle, stepIndex) {
  const list = ORDER[lessonId];
  if (!list) return null;
  const byTitle = list.find((item) => item.title === stepTitle);
  const picked = byTitle || list[stepIndex] || null;
  if (!picked) return null;
  const scene = SCENES[picked.id];
  if (!scene) return null;
  return scene;
}

export function GitVisual({ lessonId, stepTitle, stepIndex = 0 }) {
  const scene = resolve(lessonId, stepTitle, stepIndex);
  if (!scene) return null;
  return <Player key={lessonId + ":" + (stepTitle || stepIndex)} scene={scene} />;
}

function Player({ scene }) {
  const last = scene.beats.length - 1;
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduce(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing || reduce) return undefined;
    if (beat >= last) {
      setPlaying(false);
      return undefined;
    }
    const id = setTimeout(() => setBeat((value) => Math.min(last, value + 1)), 2600);
    return () => clearTimeout(id);
  }, [playing, beat, reduce, last]);

  const current = scene.beats[beat];
  const View = scene.View;

  function stepBy(dir) {
    setPlaying(false);
    setBeat((value) => Math.max(0, Math.min(last, value + dir)));
  }

  return (
    <section className="gv" aria-label={"Animation: " + scene.title}>
      <div className="gv-bar">
        <span className="gv-kicker">See it move</span>
        <span className="gv-count">
          {beat + 1} / {scene.beats.length}
        </span>
      </div>
      <div className="gv-track" aria-hidden="true">
        {scene.track.map((label, index) => {
          const cls = index === current.at ? " is-on" : index < current.at ? " is-done" : "";
          return (
            <span className={"gv-stop" + cls} key={label}>
              <i>{index + 1}</i>
              {label}
            </span>
          );
        })}
      </div>
      <div className="gv-stage">
        <View beat={beat} />
      </div>
      <p className="gv-caption" aria-live="polite">
        <strong>{current.label}</strong>
        <span>{current.text}</span>
        {current.command ? <code className="gv-cmd">$ {current.command}</code> : null}
      </p>
      <div className="gv-controls">
        <button type="button" onClick={() => stepBy(-1)} disabled={beat === 0} aria-label="Previous beat">
          Back
        </button>
        <button type="button" className="is-play" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={() => stepBy(1)} disabled={beat === last} aria-label="Next beat">
          Next
        </button>
        <button
          type="button"
          onClick={() => {
            setBeat(0);
            setPlaying(true);
          }}
        >
          <RotateCcw size={14} />
          Replay
        </button>
        <div className="gv-dots">
          {scene.beats.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={index === beat ? "on" : ""}
              aria-label={item.label}
              onClick={() => {
                setPlaying(false);
                setBeat(index);
              }}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
      <p className="gv-fine">Picture only. This does not change a real repository. Status: {current.status}.</p>
    </section>
  );
}

function Lane({ title, hint, hot, children, idle }) {
  return (
    <div className={"gv-lane" + (hot ? " is-hot" : "")}>
      <div className="gv-lane-h">
        <span>{title}</span>
        <small>{hint}</small>
      </div>
      {children || <span className="gv-empty">{idle || "empty"}</span>}
    </div>
  );
}

function Arrow({ hot, label }) {
  return <div className={"gv-arrow" + (hot ? " is-hot" : "")}>{hot ? label : "→"}</div>;
}

function FileChip({ name, tag, note }) {
  return (
    <div className={"gv-file gv-arrive" + (note ? " is-note" : "")}>
      <span className="gv-file-tab" />
      <span>{name}</span>
      {tag ? <em>{tag}</em> : null}
    </div>
  );
}

function CommitCard({ hash, message }) {
  return (
    <div className="gv-commit gv-arrive">
      <span className="gv-hash">{hash}</span>
      <strong>{message}</strong>
    </div>
  );
}

function Workflow({ beat }) {
  return (
    <div className="gv-flow">
      <Lane title="Working directory" hint="your editor" hot={beat === 0} idle="changes moved on">
        {beat === 0 ? (
          <>
            <FileChip name="index.html" tag="edited" />
            <FileChip name="styles.css" tag="edited" />
          </>
        ) : null}
      </Lane>
      <Arrow hot={beat === 1} label="git add" />
      <Lane title="Staging area" hint="chosen changes" hot={beat === 1} idle={beat > 1 ? "sealed into a commit" : "nothing staged"}>
        {beat === 1 ? (
          <>
            <FileChip name="index.html" tag="staged" />
            <FileChip name="styles.css" tag="staged" />
          </>
        ) : null}
      </Lane>
      <Arrow hot={beat === 2} label="git commit" />
      <Lane title="Local repository" hint="commits" hot={beat === 2} idle="no new commit">
        {beat >= 2 ? <CommitCard hash="a1c4e9" message="Add homepage" /> : null}
        {beat >= 2 ? <span className="gv-empty">parent c0ffee</span> : null}
      </Lane>
      <Arrow hot={beat === 3} label="git push" />
      <Lane title="GitHub" hint="origin/main" hot={beat === 3} idle="still has the old commit">
        {beat >= 3 ? <CommitCard hash="a1c4e9" message="Add homepage" /> : null}
      </Lane>
    </div>
  );
}

function Stage({ beat }) {
  const chosen = beat >= 1;
  const moved = beat >= 2;
  return (
    <div className="gv-split">
      <div className={"gv-col" + (beat < 2 ? " is-hot" : "")}>
        <h3>
          Changes <small>git status</small>
        </h3>
        <div className="gv-file">
          <span className={"gv-check" + (chosen ? " on" : "")}>{chosen ? "✓" : ""}</span>
          <span>src/app.js</span>
          {moved ? <em>staged</em> : <em>modified</em>}
        </div>
        <div className="gv-file">
          <span className={"gv-check" + (chosen ? " on" : "")}>{chosen ? "✓" : ""}</span>
          <span>src/styles.css</span>
          {moved ? <em>staged</em> : <em>modified</em>}
        </div>
        <div className="gv-file is-note">
          <span className="gv-check" />
          <span>notes.txt</span>
          <em>left out</em>
        </div>
      </div>
      <div className={"gv-col" + (beat >= 2 ? " is-hot" : "")}>
        <h3>
          Next commit <small>{beat >= 3 ? "still not on GitHub" : "staging area"}</small>
        </h3>
        {moved ? (
          <>
            <FileChip name="src/app.js" tag="included" />
            <FileChip name="src/styles.css" tag="included" />
          </>
        ) : (
          <span className="gv-empty">Tick a file and it lands here. Unticked files stay out.</span>
        )}
        {beat >= 3 ? <span className="gv-badge no">no upload yet</span> : null}
      </div>
    </div>
  );
}

function Commit({ beat }) {
  return (
    <div className="gv-commit-scene gv-split" data-beat={beat}>
      <div className={"gv-col" + (beat < 2 ? " is-hot" : "")}>
        <h3>
          Staging <small>{beat >= 2 ? "empty after commit" : "files in this snapshot"}</small>
        </h3>
        {beat < 2 ? (
          <>
            <FileChip name="index.html" />
            <FileChip name="styles.css" />
          </>
        ) : (
          <span className="gv-empty">Those files are inside the commit now.</span>
        )}
        <div className="gv-msg">
          <span className="gv-type">Add homepage</span>
        </div>
      </div>
      <div className={"gv-col" + (beat >= 2 ? " is-hot" : "")}>
        <h3>
          Local main <small>newest on top</small>
        </h3>
        <div className="gv-history">
          {beat >= 2 ? (
            <div className="gv-hitem is-new">
              <i className="rail" />
              <p>
                <span className="gv-hash">a1c4e9</span> Add homepage
                <small>just created · local only</small>
              </p>
            </div>
          ) : null}
          <div className="gv-hitem">
            <i className="rail" />
            <p>
              <span className="gv-hash">c0ffee</span> Initial commit
              <small>already in history</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Push({ beat }) {
  const remoteHasIt = beat >= 2;
  return (
    <div className="gv-push" data-beat={beat}>
      <div className={"gv-col" + (beat === 0 ? " is-hot" : "")}>
        <h3>
          Your computer <small>main</small>
        </h3>
        <CommitCard hash="a1c4e9" message="Add homepage" />
        <CommitCard hash="c0ffee" message="Initial commit" />
        {beat === 0 ? <span className="gv-badge wait">1 commit ahead</span> : null}
      </div>
      <div className="gv-bridge" aria-hidden="true">
        <div className="line" />
        <div className="gv-packet">a1c4e9</div>
      </div>
      <div className={"gv-col" + (remoteHasIt ? " is-hot" : "")}>
        <h3>
          GitHub <small>origin/main</small>
        </h3>
        {remoteHasIt ? <CommitCard hash="a1c4e9" message="Add homepage" /> : <span className="gv-empty">waiting for a1c4e9</span>}
        <CommitCard hash="c0ffee" message="Initial commit" />
        {remoteHasIt ? <span className="gv-badge ok">{beat === 3 ? "in sync" : "caught up"}</span> : <span className="gv-badge wait">behind</span>}
      </div>
    </div>
  );
}

function Remote({ beat }) {
  return (
    <div className="gv-remote" data-beat={beat}>
      <div className="gv-remote-row">
        <div className={"gv-card" + (beat === 0 ? " is-hot" : "")}>
          <h3>
            Your computer <small>local repo</small>
          </h3>
          <CommitCard hash="a1c4e9" message="Add homepage" />
          {beat >= 3 ? (
            <div className="gv-dirs">
              <div className="gv-dir is-on">
                <strong>push</strong>commits go up
              </div>
              <div className="gv-dir">
                <strong>fetch</strong>commits come down
              </div>
            </div>
          ) : null}
        </div>
        <div className="gv-link-h" />
        <div className={"gv-card" + (beat >= 1 ? " is-hot" : "")}>
          <h3>
            GitHub <small>{beat >= 1 ? "nickname: origin" : "the other copy"}</small>
          </h3>
          {beat === 0 ? <span className="gv-empty">Not inside your project folder.</span> : <CommitCard hash="a1c4e9" message="Add homepage" />}
          {beat >= 2 ? (
            <>
              <div className="gv-url">
                <b>fetch</b>https://github.com/you/app.git
              </div>
              <div className="gv-url">
                <b>push</b>https://github.com/you/app.git
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Branch({ beat }) {
  return (
    <div className="gv-branches">
      <div className="gv-bline">
        <span className="gv-blabel">feature/login</span>
        {beat >= 1 ? <span className="gv-bnode">e91a10</span> : <span className="gv-empty">not created</span>}
        {beat >= 2 ? (
          <span className="gv-bnode is-hot">
            d00a11<small>Add login</small>
          </span>
        ) : null}
        {beat >= 1 && beat < 3 ? <span className="gv-head">HEAD</span> : null}
        {beat >= 3 ? <span className="gv-head">HEAD</span> : null}
      </div>
      <div className={"gv-join" + (beat >= 1 ? " is-on" : "")} aria-hidden="true" />
      <div className="gv-bline">
        <span className="gv-blabel">main</span>
        <span className="gv-bnode">c0ffee</span>
        <span className="gv-bnode">b4d3e2</span>
        <span className={"gv-bnode" + (beat === 0 ? " is-hot" : "")}>e91a10</span>
        {beat === 0 ? <span className="gv-head">HEAD</span> : null}
        {beat >= 3 ? <span className="gv-safe">unchanged</span> : null}
      </div>
    </div>
  );
}

function PushBranch({ beat }) {
  const onRemote = beat >= 2;
  return (
    <div className="gv-split">
      <div className={"gv-col" + (beat < 2 ? " is-hot" : "")}>
        <h3>
          Your computer <small>local branches</small>
        </h3>
        <div className="gv-file">
          <span>main</span>
          <em>e91a10</em>
        </div>
        <div className="gv-file">
          <span>feature/login</span>
          <em>d00a11</em>
        </div>
        {beat >= 3 ? <span className="gv-badge ok">tracks origin/feature/login</span> : null}
      </div>
      <div className={"gv-col" + (onRemote ? " is-hot" : "")}>
        <h3>
          GitHub <small>remote branches</small>
        </h3>
        <div className="gv-file">
          <span>main</span>
          <em>e91a10</em>
        </div>
        {onRemote ? (
          <div className="gv-file gv-arrive">
            <span>feature/login</span>
            <em>d00a11</em>
          </div>
        ) : (
          <span className="gv-empty">feature/login is missing here</span>
        )}
        {beat === 3 ? <span className="gv-badge ok">upstream set with -u</span> : null}
      </div>
    </div>
  );
}

function PullRequest({ beat }) {
  const merged = beat >= 3;
  return (
    <div className="gv-pr">
      <div className="gv-pr-top">
        <div className={"gv-card" + (beat === 0 ? " is-hot" : "")}>
          <h3>
            feature/login <small>compare</small>
          </h3>
          <CommitCard hash="d00a11" message="Add login" />
          <span className="gv-empty">wants to join main</span>
        </div>
        <div className={"gv-card" + (merged ? " is-hot" : "")}>
          <h3>
            main <small>{merged ? "merged" : "base"}</small>
          </h3>
          {merged ? <CommitCard hash="d00a11" message="Add login" /> : <span className="gv-empty">does not have the login commit yet</span>}
          <CommitCard hash="e91a10" message="Previous tip" />
        </div>
      </div>
      {beat >= 1 && beat < 3 ? (
        <div className="gv-card is-hot">
          <h3>
            Pull request <small>feature/login → main</small>
          </h3>
          <div className="gv-diff">
            <div>src/login.js</div>
            <div className="add">+ export function Login()</div>
            <div className="add">{"+ return <form>Sign in</form>"}</div>
          </div>
          {beat >= 2 ? (
            <div className="gv-review">
              <span>
                <span className="gv-dotperson">S</span>Sam approved
              </span>
              <span className="gv-badge ok">checks passed</span>
            </div>
          ) : (
            <div className="gv-review">
              <span className="gv-empty">waiting for review</span>
            </div>
          )}
        </div>
      ) : null}
      {merged ? <span className="gv-badge ok">Merged. main now includes Add login.</span> : null}
    </div>
  );
}
