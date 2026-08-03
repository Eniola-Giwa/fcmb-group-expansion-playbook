(() => {
  const data = window.PLAYBOOK;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* Mobile nav */
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  /* Peers */
  const peerList = $("#peer-list");
  const peerDetail = $("#peer-detail");
  const lessons = $("#peer-lessons");

  function renderPeer(peer) {
    peerDetail.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    peerDetail.offsetHeight;
    peerDetail.style.animation = "";
    peerDetail.innerHTML = `
      <h3>${peer.name}</h3>
      <p>${peer.summary}</p>
      <div class="peer-meta">
        <span class="chip">${peer.home}</span>
        <span class="chip">${peer.reach}</span>
        <span class="chip">${peer.mode}</span>
      </div>
      <ul class="timeline">
        ${peer.timeline
          .map(
            (t) => `<li><span class="year">${t.year}</span><span>${t.event}</span></li>`
          )
          .join("")}
      </ul>
      <div class="advice">
        <h4>What to steal from their playbook</h4>
        <ul>${peer.advice.map((a) => `<li>${a}</li>`).join("")}</ul>
      </div>
    `;
  }

  data.peers.forEach((peer, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `peer-btn${i === 0 ? " is-active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.innerHTML = `<strong>${peer.name}</strong><span>${peer.reach}</span>`;
    btn.addEventListener("click", () => {
      $$(".peer-btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      renderPeer(peer);
    });
    peerList.appendChild(btn);
  });
  renderPeer(data.peers[0]);

  lessons.innerHTML = data.peerLessons
    .map((l) => `<article><h4>${l.title}</h4><p>${l.body}</p></article>`)
    .join("");

  /* Stakeholders */
  const stakePanel = $("#stake-panel");
  function renderStake(key) {
    const s = data.stakeholders[key];
    stakePanel.innerHTML = `
      <h3>${s.title}</h3>
      <p>${s.intro}</p>
      <ul class="check-list static">
        ${s.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
      <div class="callout"><strong>Bayport / FCMB application</strong>${s.bayport}</div>
    `;
  }
  $$(".stake-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".stake-tab").forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderStake(tab.dataset.stake);
    });
  });
  renderStake("regulators");

  /* Greenfield / brownfield */
  const modePanel = $("#mode-panel");
  function renderMode(key) {
    const m = data.modes[key];
    modePanel.innerHTML = `
      <h3>${m.title}</h3>
      <div class="mode-cols">
        <div>
          <h4>When to use</h4>
          <ul>${m.when.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
        <div>
          <h4>How to execute</h4>
          <ul>${m.how.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
        <div>
          <h4>Watch-outs</h4>
          <ul>${m.risks.map((x) => `<li>${x}</li>`).join("")}</ul>
        </div>
      </div>
      <div class="callout"><strong>FCMB default</strong>${m.fcmb}</div>
    `;
  }
  $$(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".mode-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderMode(btn.dataset.mode);
    });
  });
  renderMode("brownfield");

  /* DD streams */
  $("#dd-streams").innerHTML = data.ddStreams
    .map(
      (s) => `
      <article>
        <h4>${s.name}</h4>
        <ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  /* Go / No-Go gate */
  const gateList = $("#gate-list");
  const gateResult = $("#gate-result");
  const state = Object.fromEntries(data.gateItems.map((g) => [g.id, false]));

  function scoreGate() {
    const total = data.gateItems.reduce((n, g) => n + g.weight, 0);
    const got = data.gateItems.reduce((n, g) => n + (state[g.id] ? g.weight : 0), 0);
    const pct = Math.round((got / total) * 100);
    const hardOpen = data.gateItems.filter((g) => g.hard && !state[g.id]);
    let cls = "nogo";
    let status = "NO-GO";
    let note =
      "Hard-stop items remain open, or coverage is too thin. Do not commit capital.";
    if (hardOpen.length === 0 && pct >= 85) {
      cls = "go";
      status = "GO";
      note = "Hard stops cleared and coverage is strong. Proceed to IC with conditions tracked.";
    } else if (hardOpen.length === 0 && pct >= 65) {
      cls = "hold";
      status = "CONDITIONAL HOLD";
      note = "No hard stops, but close the remaining gaps or price them before signing.";
    } else if (hardOpen.length && pct >= 50) {
      cls = "hold";
      status = "HOLD";
      note = `Clear ${hardOpen.length} hard-stop item(s) before any binding offer.`;
    }
    gateResult.className = `gate-result ${cls}`;
    gateResult.innerHTML = `
      <p class="status">${status}</p>
      <p>${note}</p>
      <div class="progress" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <p>Coverage score: ${pct}% (${got}/${total} weighted checks)</p>
    `;
  }

  function renderGate() {
    gateList.innerHTML = data.gateItems
      .map(
        (g) => `
      <label class="gate-item">
        <input type="checkbox" data-id="${g.id}" ${state[g.id] ? "checked" : ""} />
        <span class="label">${g.label}</span>
        <span class="tag ${g.hard ? "hard" : ""}">${g.hard ? "Hard stop" : "Soft"}</span>
      </label>`
      )
      .join("");
    $$("input[type=checkbox]", gateList).forEach((input) => {
      input.addEventListener("change", () => {
        state[input.dataset.id] = input.checked;
        scoreGate();
      });
    });
    scoreGate();
  }
  renderGate();

  $("#gate-all")?.addEventListener("click", () => {
    data.gateItems.forEach((g) => (state[g.id] = true));
    renderGate();
  });
  $("#gate-reset")?.addEventListener("click", () => {
    data.gateItems.forEach((g) => (state[g.id] = false));
    renderGate();
  });

  /* Levers */
  $("#levers").innerHTML = data.levers
    .map((l) => `<article><h4>${l.title}</h4><p>${l.body}</p></article>`)
    .join("");

  /* Phases */
  const phasePanel = $("#phase-panel");
  function renderPhase(key) {
    const p = data.phases[key];
    phasePanel.innerHTML = `
      <h3>${p.title}</h3>
      <ul>${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    `;
  }
  $$(".phase-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".phase-tab").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      renderPhase(tab.dataset.phase);
    });
  });
  renderPhase("1");

  /* KPIs */
  $("#kpi-table").innerHTML = `
    <div class="kpi-row header"><span>Area</span><span>Day-100 target</span><span>Owner</span><span>Cadence</span></div>
    ${data.kpis
      .map(
        (k) =>
          `<div class="kpi-row"><span>${k.area}</span><span>${k.target}</span><span>${k.owner}</span><span>${k.when}</span></div>`
      )
      .join("")}
  `;
})();
