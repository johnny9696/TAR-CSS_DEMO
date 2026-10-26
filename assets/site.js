"use strict";
(() => {
  const paper = window.PG_CSS_PAPER || {};
  const text = value => typeof value === "string" ? value.trim() : "";
  const localAsset = value => {
    const path = text(value);
    return path && !path.startsWith("/") && !path.includes("..") && !/^[a-z][a-z\d+.-]*:/i.test(path)
      && !path.includes("\\") ? path : null;
  };
  function fill(id, value) {
    if (!text(value)) return;
    const element = document.getElementById(id);
    element.textContent = value;
    element.classList.remove("placeholder");
  }
  const title = text(paper.title);
  if (title) { fill("paper-title", title); document.title = `${title} · Audio Demo`; }
  fill("paper-authors", Array.isArray(paper.authors) ? paper.authors.map(text).filter(Boolean).join(" · ") : "");
  fill("paper-affiliations", Array.isArray(paper.affiliations) ? paper.affiliations.map(text).filter(Boolean).join(" · ") : "");
  if (text(paper.code?.url)) {
    try {
      const url = new URL(paper.code.url);
      if (url.protocol === "https:" && url.hostname === "github.com" && !url.username && !url.password) {
        const link = document.getElementById("code-link");
        link.href = url.href; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled"); link.removeAttribute("tabindex");
        link.setAttribute("aria-label", "GitHub에서 논문 코드 보기, 새 탭");
        document.getElementById("code-pending").hidden = true;
      }
    } catch (_) { /* Keep the explicit unavailable state until a valid URL is supplied. */ }
  }
  if (text(paper.abstract)) {
    const paragraphs = paper.abstract.split(/\n\s*\n/).filter(value => text(value));
    document.getElementById("abstract-copy").replaceChildren(...paragraphs.map(value => {
      const p = document.createElement("p"); p.textContent = value; return p;
    }));
  }
  const figure = paper.figure || {};
  if (localAsset(figure.src)) {
    const img = document.getElementById("paper-figure");
    img.alt = text(figure.alt) || "논문 대표 이미지";
    img.addEventListener("load", () => { img.hidden = false; document.getElementById("figure-placeholder").hidden = true; });
    img.addEventListener("error", () => { img.hidden = true; document.getElementById("figure-placeholder").hidden = false; });
    img.src = localAsset(figure.src);
  }
  fill("figure-caption", figure.caption);
  const results = paper.results || {};
  const models = Array.isArray(results.models) ? results.models : [];
  const metrics = Array.isArray(results.metrics) ? results.metrics : [];
  function resultTable(title, headers, rows, wide = false, options = {}) {
    const section = document.createElement("section"); section.className = "result-block";
    if (text(options.id)) section.id = options.id;
    const heading = document.createElement("h3"); heading.textContent = title; section.append(heading);
    if (text(options.note)) {
      const note = document.createElement("p"); note.className = "results-note";
      note.textContent = options.note; section.append(note);
    }
    const wrap = document.createElement("div"); wrap.className = "results-scroll";
    wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", `${title} 결과표, 작은 화면에서는 좌우 스크롤`);
    const table = document.createElement("table"); if (wide) table.className = "objective-table";
    const caption = document.createElement("caption"); caption.className = "visually-hidden"; caption.textContent = title;
    const head = document.createElement("thead"), tr = document.createElement("tr"), body = document.createElement("tbody");
    for (const label of [text(options.rowHeading) || "Model", ...headers]) { const th = document.createElement("th"); th.scope = "col"; th.textContent = label; tr.append(th); }
    head.append(tr);
    for (const [model, values] of rows) {
      const row = document.createElement("tr"), name = document.createElement("th"); name.scope = "row"; name.textContent = model; row.append(name);
      for (const value of values) {
        const cell = document.createElement("td");
        if (typeof value === "number" && Number.isFinite(value)) {
          cell.textContent = Number.isInteger(options.decimals) ? value.toFixed(options.decimals) : String(value);
        }
        else { cell.textContent = "—"; cell.className = "pending-value"; cell.setAttribute("aria-label", "결과 미입력"); }
        row.append(cell);
      }
      body.append(row);
    }
    table.append(caption, head, body); wrap.append(table); section.append(wrap); document.getElementById("result-tables").append(section);
  }
  const metricByKey = new Map(metrics.map(metric => [metric.key, metric]));
  for (const table of (Array.isArray(results.tables) ? results.tables : [])) {
    resultTable(text(table.title), table.metricKeys.map(key => metricByKey.get(key).label), table.rows,
      table.metricKeys.length > 5, { ...table, decimals: 4 });
  }
  resultTable("Listening evaluation", ["DailyTalk MOS ↑", "DailyTalk D-MOS ↑", "NCSSD MOS ↑", "NCSSD D-MOS ↑"], ["Original", ...models].map(model => {
    const row = results.listening?.rows?.[model] || {};
    return [model, [row.dailytalk_mos, row.dailytalk_dmos, row.ncssd_mos, row.ncssd_dmos]];
  }));
  for (const metric of [...metrics,
    { label: "MOS ↑", description: "음성 자체의 자연스러움·품질에 대한 청취 평가. 1–5점." },
    { label: "D-MOS ↑", description: "이전 대화와 현재 감정을 고려한 발화 적절성에 대한 청취 평가. 1–5점." },
  ]) {
    const name = document.createElement("dt"), definition = document.createElement("dd");
    name.textContent = metric.label; definition.textContent = metric.description;
    document.getElementById("metric-definitions").append(name, definition);
  }
  const sampleSets = [
    { key: "naturalness", label: "Naturalness", target: "naturalness-groups", contextual: false },
    { key: "dialogue", label: "Dialogue Appropriateness", target: "dialogue-groups", contextual: true },
  ];
  function appendPlayer(parent, src, id, label) {
    const source = localAsset(src);
    if (!source) {
      const pending = document.createElement("p"); pending.className = "sample-unavailable";
      pending.textContent = "음성 준비 중"; parent.append(pending); return;
    }
    const audio = document.createElement("audio"); audio.controls = true; audio.preload = "none";
    audio.id = id; audio.setAttribute("aria-label", label); audio.src = source; parent.append(audio);
    audio.addEventListener("error", () => {
      audio.hidden = true;
      const unavailable = document.createElement("p"); unavailable.className = "sample-unavailable";
      unavailable.textContent = "음성을 불러올 수 없습니다."; parent.append(unavailable);
    }, { once: true });
  }
  function appendContext(copy, sample, scope, label) {
    const context = document.createElement("div"); context.className = "sample-context";
    const heading = document.createElement("p"); heading.className = "context-label";
    heading.textContent = "Dialogue history"; context.append(heading);
    const history = Array.isArray(sample.history) ? sample.history : [];
    if (history.length) {
      const list = document.createElement("ol"); list.className = "dialogue-history";
      for (const [index, turn] of history.entries()) {
        const row = document.createElement("li"); row.className = "history-turn";
        const speaker = document.createElement("span"); speaker.className = "history-speaker";
        speaker.textContent = text(turn.speaker) || `Speaker ${index + 1}`;
        const script = document.createElement("p"); script.className = "history-text"; script.textContent = text(turn.text);
        row.append(speaker, script);
        if (text(turn.src)) {
          const player = document.createElement("div"); player.className = "history-audio";
          appendPlayer(player, turn.src, `${scope}-history-${index}`, `${label}, dialogue history ${index + 1}, ${speaker.textContent}`);
          row.append(player);
        }
        list.append(row);
      }
      context.append(list);
    } else {
      const empty = document.createElement("p"); empty.className = "sample-unavailable";
      empty.textContent = "이 샘플에는 이전 대화가 제공되지 않았습니다."; context.append(empty);
    }
    const current = document.createElement("p"); current.className = "sample-emotion";
    current.textContent = `Current speaker · ${text(sample.speaker) || "미입력"} / Emotion · ${text(sample.emotion) || "미입력"}`;
    context.append(current); copy.append(context);
  }
  for (const set of sampleSets) {
    const groups = Array.isArray(paper.samples?.[set.key]) ? paper.samples[set.key] : [];
    for (const [groupIndex, group] of groups.entries()) {
    const section = document.createElement("section"); section.className = "sample-group";
    const heading = document.createElement("h3"); heading.textContent = text(group.dataset) || `Sample group ${groupIndex + 1}`;
    section.append(heading);
    const items = Array.isArray(group.items) ? group.items : [];
    if (!items.length) {
      const empty = document.createElement("p"); empty.className = "sample-empty";
      empty.textContent = set.contextual
        ? "이전 대화·현재 감정·발화 대본과 모델별 음성 샘플을 추가할 영역입니다."
        : "단일 발화의 대본과 모델별 음성 샘플을 추가할 영역입니다.";
      section.append(empty);
    }
    for (const [sampleIndex, sample] of items.entries()) {
      const card = document.createElement("article"); card.className = "sample-card";
      const copy = document.createElement("div"); copy.className = "sample-text";
      const label = document.createElement("h4"); label.textContent = text(sample.label) || `Sample ${sampleIndex + 1}`;
      copy.append(label);
      const scope = `sample-${set.key}-${groupIndex}-${sampleIndex}`;
      const accessibleLabel = `${set.label}, ${heading.textContent}, ${label.textContent}`;
      if (set.contextual) appendContext(copy, sample, scope, accessibleLabel);
      const current = document.createElement("div"); current.className = "target-utterance";
      const scriptLabel = document.createElement("p"); scriptLabel.className = "context-label";
      scriptLabel.textContent = "Current utterance";
      const script = document.createElement("p"); script.textContent = text(sample.text);
      current.append(scriptLabel, script); copy.append(current);
      card.append(copy);
      const audioGrid = document.createElement("div"); audioGrid.className = "sample-audio";
      for (const [audioIndex, clip] of (Array.isArray(sample.audio) ? sample.audio : []).entries()) {
        const cell = document.createElement("div"); cell.className = "audio-cell";
        const name = document.createElement("label"); name.textContent = text(clip.model) || "Audio";
        const playerId = `${scope}-audio-${audioIndex}`;
        name.htmlFor = playerId;
        cell.append(name);
        appendPlayer(cell, clip.src, playerId, `${accessibleLabel}, ${name.textContent}`);
        audioGrid.append(cell);
      }
      card.append(audioGrid); section.append(card);
    }
      document.getElementById(set.target).append(section);
    }
  }
  // Sample browsing is not a listening-test response collection page.
  document.addEventListener("play", event => {
    if (event.target.tagName !== "AUDIO") return;
    document.querySelectorAll("audio").forEach(audio => { if (audio !== event.target) audio.pause(); });
  }, true);
  const samplesReady = sampleSets.every(set => Array.isArray(paper.samples?.[set.key])
    && paper.samples[set.key].some(group => group.items?.length));
  document.getElementById("draft-note").hidden = Boolean(title && text(paper.abstract) && paper.authors?.length && localAsset(figure.src) && samplesReady);
})();
