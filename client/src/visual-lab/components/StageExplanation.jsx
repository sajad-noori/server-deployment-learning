export function StageExplanation({ stage, index }) {
  return <article className="visual-stage-detail" aria-live="polite">
    <div className="visual-stage-copy">
      <span className="visual-stage-kicker">WHAT HAPPENS AT STEP {String(index + 1).padStart(2, "0")}</span>
      <h3>{stage.name}</h3><p>{stage.detail}</p>
      <div className="visual-concept"><span><strong>Why this matters</strong>{stage.concept}</span></div>
      <div className="visual-example"><span>REAL-WORLD EXAMPLE</span><code>{stage.example}</code></div>
    </div>
  </article>;
}
