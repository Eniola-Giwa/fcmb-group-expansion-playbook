(() => {
  const data = window.PLAYBOOK;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const page = document.body.dataset.page || "home";

  const NAV = [
    { id: "home", href: "index.html", label: "Why" },
    { id: "selection", href: "selection.html", label: "Selection Criteria" },
    { id: "stakeholders", href: "stakeholders.html", label: "Stakeholders" },
    { id: "diligence", href: "diligence.html", label: "Due Diligence" },
    { id: "integration", href: "integration.html", label: "Integration" },
    { id: "peers", href: "peers.html", label: "Peer Benchmark" }
  ];

  function mountShell() {
    const top = document.createElement("div");
    top.className = "topbar";
    top.innerHTML = `
      <span>FCMB Group · African Expansion Playbook</span>
      <a href="https://www.fcmb.com/" target="_blank" rel="noopener">fcmb.com</a>
    `;

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">FCMB</span>
          <span class="brand-text">
            <strong>Expansion Playbook</strong>
            <small>My Bank and I · Across Africa</small>
          </span>
        </a>
        <a class="btn primary small" href="https://www.fcmb.com/" target="_blank" rel="noopener">fcmb.com</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="primary-nav">
        <nav class="nav" aria-label="Primary">
          ${NAV.map(
            (n) =>
              `<a href="${n.href}" class="${n.id === page ? "is-active" : ""}">${n.label}</a>`
          ).join("")}
        </nav>
      </div>
    `;

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-accent"></div>
      <div class="footer-inner">
        <span>© FCMB Group Expansion Playbook · build 20260803h</span>
        <a href="https://github.com/Eniola-Giwa/fcmb-group-expansion-playbook" target="_blank" rel="noopener">GitHub</a>
      </div>
    `;

    document.body.prepend(header);
    document.body.prepend(top);
    document.body.appendChild(footer);

    const toggle = $(".nav-toggle");
    const nav = $(".primary-nav .nav");
    const setNav = (open) => {
      nav?.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle?.setAttribute("aria-expanded", String(open));
      toggle?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle?.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
    $$("a", nav).forEach((link) => link.addEventListener("click", () => setNav(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNav(false);
    });
  }

  function ownTabs(group) {
    return $$(":scope > .tabs > .tab", group);
  }

  function ownPanels(group) {
    return $$(".panel", group).filter((p) => p.closest("[data-tabs]") === group);
  }

  function bindTabs(group) {
    if (!group) return;
    ownTabs(group).forEach((tab) => {
      if (tab.dataset.bound === "1") return;
      tab.dataset.bound = "1";
      tab.addEventListener("click", () => {
        ownTabs(group).forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        ownPanels(group).forEach((p) => p.classList.remove("is-active"));
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        const panel = group.querySelector(`#${tab.dataset.target}`);
        panel?.classList.add("is-active");
      });
    });
  }

  function growthChart(growth) {
    if (!growth?.length) return "";
    const max = Math.max(...growth.map((g) => g.countries), 1);
    const chartH = 140;
    return `
      <div class="growth-chart" aria-label="Country count over time">
        <div class="growth-chart-head">
          <h4>Countries over time</h4>
        </div>
        <div class="growth-bars" style="height:${chartH}px">
          ${growth
            .map((g) => {
              const h = Math.max(6, Math.round((g.countries / max) * (chartH - 28)));
              return `
              <div class="growth-bar" title="${g.year}: ${g.countries} countries">
                <div class="growth-bar-col">
                  <span class="growth-val">${g.countries}</span>
                  <div class="growth-bar-fill" style="height:${h}px"></div>
                </div>
                <span class="growth-year-label">${g.year}</span>
              </div>`;
            })
            .join("")}
        </div>
      </div>`;
  }

  function timelineCards(timeline) {
    return `
      <ol class="growth-timeline">
        ${timeline
          .map(
            (t) => `
          <li class="growth-step">
            <div class="growth-step-rail" aria-hidden="true">
              <span class="growth-dot"></span>
            </div>
            <div class="growth-step-body">
              <div class="growth-step-top">
                <strong class="growth-year">${t.year}</strong>
                <span class="count-badge">${t.countries} countries</span>
                <span class="chip">${t.region}</span>
                <span class="chip soft">${t.entry}</span>
              </div>
              <p class="growth-event">${t.event}</p>
              <p class="growth-markets"><strong>Markets / deal:</strong> ${t.markets.join(" · ")}</p>
              <div class="advisor-grid">
                <div class="mini-card">
                  <h4>Financial / deal advisors</h4>
                  <p>${t.advisors.financial}</p>
                </div>
                <div class="mini-card">
                  <h4>Legal advisors</h4>
                  <p>${t.advisors.legal}</p>
                </div>
                <div class="mini-card">
                  <h4>Other counsel / notes</h4>
                  <p>${t.advisors.other}</p>
                </div>
                <div class="mini-card">
                  <h4>Vendors / platforms</h4>
                  <ul>${t.vendors.map((v) => `<li>${v}</li>`).join("")}</ul>
                </div>
              </div>
            </div>
          </li>`
          )
          .join("")}
      </ol>`;
  }

  function renderPeers() {
    const tablist = $("#peer-tabs");
    const panels = $("#peer-panels");
    if (!tablist || !panels) return;

    tablist.innerHTML = data.peers
      .map(
        (p, i) =>
          `<button class="tab${i === 0 ? " is-active" : ""}" role="tab" aria-selected="${
            i === 0
          }" data-target="peer-${p.id}"><em>${p.rank || i + 1}</em>${p.name}</button>`
      )
      .join("");

    panels.innerHTML = data.peers
      .map(
        (p, i) => `
      <div class="panel${i === 0 ? " is-active" : ""}" id="peer-${p.id}" role="tabpanel">
        <div class="panel-card peer-rich">
          <div class="peer-rich-head">
            <div>
              <h2><span class="rank-pill">#${p.rank || i + 1}</span> ${p.name}</h2>
              <p class="intro">${p.summary}</p>
              <div class="meta-row">
                <span class="chip">${p.home}</span>
                <span class="chip">${p.reach}</span>
                <span class="chip">${p.mode}</span>
              </div>
              <div class="callout first-region">
                <strong>First region</strong>
                ${p.firstRegion}
              </div>
            </div>
            <div class="mini-card">
              <h4>What to steal from their playbook</h4>
              <ul>${p.advice.map((a) => `<li>${a}</li>`).join("")}</ul>
            </div>
          </div>
          ${growthChart(p.growth)}
          <h3 class="timeline-title">Expansion timeline — countries, regions, advisors &amp; vendors</h3>
          ${timelineCards(p.timeline)}
          <p class="source-note">Country counts are approximate African banking footprints at period end, synthesised from annual reports, IMF/World Bank pan-African banking research, and deal announcements. Advisor names shown where publicly reported; otherwise noted as in-house / local counsel.</p>
        </div>
      </div>`
      )
      .join("");

    const lessonsBtn = document.createElement("button");
    lessonsBtn.className = "tab";
    lessonsBtn.dataset.target = "peer-lessons";
    lessonsBtn.setAttribute("role", "tab");
    lessonsBtn.setAttribute("aria-selected", "false");
    lessonsBtn.textContent = "Cross-cutting lessons";
    tablist.appendChild(lessonsBtn);

    const lessonsPanel = document.createElement("div");
    lessonsPanel.className = "panel";
    lessonsPanel.id = "peer-lessons";
    lessonsPanel.innerHTML = `
      <div class="panel-card">
        <h2>Cross-cutting lessons</h2>
        <p class="intro">Patterns across Africa’s top 20 banking groups — from pan-African networks to domestic giants.</p>
        <div class="grid-2">
          ${data.peerLessons
            .map((l) => `<div class="mini-card"><h4>${l.title}</h4><p>${l.body}</p></div>`)
            .join("")}
        </div>
      </div>`;
    panels.appendChild(lessonsPanel);

    bindTabs($("[data-tabs='peers']"));

    // Keep active peer tab visible on narrow screens
    const activePeerTab = $(".tab.is-active", tablist);
    activePeerTab?.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
    tablist.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      requestAnimationFrame(() => {
        tab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      });
    });
  }

  function decisionBlocks(decisions) {
    if (!decisions?.length) return "";
    return `
      <div class="decision-stack">
        ${decisions
          .map(
            (d, i) => `
          <article class="decision-card">
            <p class="decision-label">Decision ${i + 1}</p>
            <h4>${d.ask}</h4>
            <p class="do"><strong>Do this.</strong> ${d.do}</p>
            <p class="trap"><strong>Trap.</strong> ${d.trap}</p>
          </article>`
          )
          .join("")}
      </div>`;
  }

  function renderStakeholders() {
    const tablist = $("#stake-tabs");
    const panels = $("#stake-panels");
    if (!tablist || !panels) return;
    const keys = Object.keys(data.stakeholders);
    tablist.innerHTML = keys
      .map(
        (k, i) =>
          `<button class="tab${i === 0 ? " is-active" : ""}" role="tab" data-target="stake-${k}" aria-selected="${
            i === 0
          }">${data.stakeholders[k].title}</button>`
      )
      .join("");
    panels.innerHTML = keys
      .map((k, i) => {
        const s = data.stakeholders[k];
        return `
        <div class="panel${i === 0 ? " is-active" : ""}" id="stake-${k}" role="tabpanel">
          <div class="panel-card playbook-card">
            <p class="objective">${s.objective}</p>
            <h2>${s.title}</h2>
            <p class="prose">${s.intro}</p>
            ${decisionBlocks(s.decisions)}
            <h3 class="playbook-subhead">How to run this track</h3>
            <ol class="playbook-steps">${s.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
            <div class="callout"><strong>Bayport / FCMB application</strong>${s.bayport}</div>
          </div>
        </div>`;
      })
      .join("");
    bindTabs($("[data-tabs='stakeholders']"));
  }

  function renderSelection() {
    const filters = $("#panel-filters");
    const modeTabs = $("#mode-tabs");
    const modePanels = $("#mode-panels");
    const pathways = $("#panel-pathways");
    const sf = data.selectionFilters;

    if (filters && sf) {
      filters.innerHTML = `
        <p class="prose">${sf.intro}</p>
        <div class="level-stack">
          ${sf.levels
            .map(
              (l) => `
            <article class="level-card">
              <h3>${l.title}</h3>
              <p class="objective">${l.purpose}</p>
              <p class="prose">${l.guidance}</p>
              <p class="do"><strong>Decide.</strong> ${l.decide}</p>
              <p class="outputs"><strong>Leave with:</strong> ${l.outputs.join(" · ")}</p>
            </article>`
            )
            .join("")}
        </div>
        <div class="callout"><strong>Why Ghana cleared the cascade</strong>${sf.ghanaWhy}</div>`;
    }

    if (modeTabs && modePanels) {
      const modes = Object.keys(data.modes);
      modeTabs.innerHTML = modes
        .map(
          (k, i) =>
            `<button class="tab${i === 0 ? " is-active" : ""}" data-target="mode-${k}" role="tab" aria-selected="${
              i === 0
            }">${data.modes[k].title}</button>`
        )
        .join("");
      modePanels.innerHTML = modes
        .map((k, i) => {
          const m = data.modes[k];
          return `
          <div class="panel${i === 0 ? " is-active" : ""}" id="mode-${k}">
            <p class="prose"><strong>${m.thesis}</strong></p>
            <div class="narrative-grid">
              <article class="mini-card"><h4>When to choose it</h4><p>${m.whenNarrative}</p></article>
              <article class="mini-card"><h4>How to execute</h4><p>${m.howNarrative}</p></article>
              <article class="mini-card"><h4>What can go wrong</h4><p>${m.riskNarrative}</p></article>
            </div>
            <p class="do" style="margin-top:1rem"><strong>Decision rule.</strong> ${m.decide}</p>
            <div class="callout"><strong>FCMB default</strong>${m.fcmb}</div>
          </div>`;
        })
        .join("");
      bindTabs($("[data-tabs='modes']"));
    }

    if (pathways) {
      pathways.innerHTML = `
        <p class="prose">Pick the vehicle after the country and the acquire-vs-build choice are settled. Each path answers a different time-to-capability problem.</p>
        <div class="level-stack">
          ${data.pathways
            .map(
              (p) => `
            <article class="level-card">
              <h3>${p.title}</h3>
              <p class="do"><strong>When.</strong> ${p.when}</p>
              <p class="prose"><strong>Why it works.</strong> ${p.why}</p>
              <p class="prose"><strong>How to underwrite.</strong> ${p.how}</p>
              <p class="trap"><strong>Do not.</strong> ${p.dont}</p>
            </article>`
            )
            .join("")}
        </div>`;
    }

    bindTabs($("[data-tabs='selection']"));
  }

  function renderDiligence() {
    const dd = data.diligence;
    const bench = $("#panel-benchmarks");
    if (bench && dd?.benchmarks) {
      bench.innerHTML = `
        <p class="prose">${dd.benchmarks.intro}</p>
        <div class="level-stack">
          ${dd.benchmarks.items
            .map(
              (item) => `
            <article class="level-card compact">
              <h3>${item.title}</h3>
              <p class="prose">${item.body}</p>
            </article>`
            )
            .join("")}
        </div>`;
    }

    const mins = $("#panel-minimums");
    if (mins && dd?.minimums) {
      mins.innerHTML = `
        <p class="prose">${dd.minimums.intro}</p>
        <div class="level-stack">
          ${dd.minimums.items
            .map(
              (item) => `
            <article class="level-card compact">
              <h3>${item.title}</h3>
              <p class="prose">${item.body}</p>
            </article>`
            )
            .join("")}
        </div>`;
    }

    const streams = $("#panel-streams");
    if (streams && dd?.streams) {
      streams.innerHTML = `
        <div class="level-stack">
          ${dd.streams
            .map(
              (s) => `
            <article class="level-card">
              <h3>${s.name}</h3>
              <p class="prose"><strong>Why this stream exists.</strong> ${s.why}</p>
              <p class="do"><strong>Decision it feeds.</strong> ${s.decide}</p>
              <p class="outputs"><strong>Look for:</strong></p>
              <ul class="list">${s.lookFor.map((i) => `<li>${i}</li>`).join("")}</ul>
            </article>`
            )
            .join("")}
        </div>`;
    }

    const gateIntro = $("#gate-intro");
    if (gateIntro && dd?.gateIntro) gateIntro.textContent = dd.gateIntro;

    const gateList = $("#gate-list");
    const gateResult = $("#gate-result");
    if (gateList && gateResult) {
      const state = Object.fromEntries(data.gateItems.map((g) => [g.id, false]));

      function scoreGate() {
        const total = data.gateItems.reduce((n, g) => n + g.weight, 0);
        const got = data.gateItems.reduce((n, g) => n + (state[g.id] ? g.weight : 0), 0);
        const pct = Math.round((got / total) * 100);
        const hardOpen = data.gateItems.filter((g) => g.hard && !state[g.id]);
        let cls = "nogo";
        let status = "NO-GO";
        let note = "Hard-stop items remain open, or coverage is too thin. Do not commit capital.";
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
          <p>Coverage score: ${pct}% (${got}/${total} weighted checks)</p>`;
      }

      function paint() {
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
      paint();
      $("#gate-all")?.addEventListener("click", () => {
        data.gateItems.forEach((g) => (state[g.id] = true));
        paint();
      });
      $("#gate-reset")?.addEventListener("click", () => {
        data.gateItems.forEach((g) => (state[g.id] = false));
        paint();
      });
    }

    bindTabs($("[data-tabs='diligence']"));
  }

  function renderIntegration() {
    const levers = $("#panel-levers");
    if (levers) {
      levers.innerHTML = `
        <p class="prose">${data.integrationIntro || ""}</p>
        <h3 class="playbook-subhead">Connect into the FCMB ecosystem first</h3>
        <div class="level-stack">
          ${(data.ecosystemLayers || [])
            .map(
              (l) => `
            <article class="level-card">
              <h3>${l.title}</h3>
              <p class="prose">${l.body}</p>
              <p class="do"><strong>Decision rule.</strong> ${l.decide}</p>
            </article>`
            )
            .join("")}
        </div>
        <h3 class="playbook-subhead">Then pull the value levers</h3>
        <p class="prose">Once the subsidiary is visible and controllable inside Group, run these levers against the IC thesis — sequenced, funded, and owned.</p>
        <div class="level-stack">
          ${data.levers
            .map(
              (l) => `
            <article class="level-card compact">
              <h3>${l.title}</h3>
              <p class="prose">${l.body}</p>
              <p class="do"><strong>Decision rule.</strong> ${l.decide}</p>
            </article>`
            )
            .join("")}
        </div>`;
    }

    const phaseTabs = $("#phase-tabs");
    const phasePanels = $("#phase-panels");
    if (phaseTabs && phasePanels) {
      const keys = Object.keys(data.phases);
      phaseTabs.innerHTML = keys
        .map(
          (k, i) =>
            `<button class="tab${i === 0 ? " is-active" : ""}" data-target="phase-${k}" role="tab" aria-selected="${
              i === 0
            }">${k === "1" ? "Days 1–30" : k === "2" ? "Days 31–60" : "Days 61–100"}</button>`
        )
        .join("");
      phasePanels.innerHTML = keys
        .map((k, i) => {
          const p = data.phases[k];
          return `
          <div class="panel${i === 0 ? " is-active" : ""}" id="phase-${k}">
            <h3 style="margin:0 0 0.45rem;color:var(--fcmb-purple-deep)">${p.title}</h3>
            <p class="objective">${p.focus}</p>
            <p class="prose">${p.narrative}</p>
            <div class="level-stack" style="margin-top:1rem">
              ${p.items
                .map(
                  (item) => `
                <article class="level-card compact">
                  <h3>${item.action}</h3>
                  <p class="prose"><strong>Why now.</strong> ${item.why}</p>
                </article>`
                )
                .join("")}
            </div>
          </div>`;
        })
        .join("");
      bindTabs($("[data-tabs='phases']"));
    }

    const kpis = $("#panel-kpis");
    if (kpis) {
      kpis.innerHTML = `
        <p class="prose">Day-100 KPIs are early-warning instruments, not the full value-creation case. If these are red, do not celebrate product launches.</p>
        <div class="kpi-table">
          <div class="kpi-row header"><span>Area</span><span>Day-100 target</span><span>Owner</span><span>Cadence</span></div>
          ${data.kpis
            .map(
              (k) =>
                `<div class="kpi-row"><span title="${k.why || ""}">${k.area}</span><span>${k.target}</span><span>${k.owner}</span><span>${k.when}</span></div>`
            )
            .join("")}
        </div>
        <div class="level-stack" style="margin-top:1rem">
          ${data.kpis
            .map(
              (k) => `
            <article class="level-card compact">
              <h3>${k.area}</h3>
              <p class="prose"><strong>Target:</strong> ${k.target} · <strong>Owner:</strong> ${k.owner} · <strong>${k.when}</strong></p>
              <p class="do"><strong>Why it matters.</strong> ${k.why}</p>
            </article>`
            )
            .join("")}
        </div>`;
    }

    const horizon = $("#panel-horizon");
    if (horizon) {
      const steps = data.horizonSteps || [];
      horizon.innerHTML = `
        <p class="prose">${data.horizonNarrative || ""}</p>
        <ol class="horizon-list">
          ${steps
            .map((s) => `<li><strong>${s.when}</strong> — ${s.what}</li>`)
            .join("")}
        </ol>
        <div class="callout">
          <strong>Integration mandate</strong>
          The goal is not to decorate a standalone trophy asset. It is to make the acquired business a true node in the FCMB Group ecosystem — governed, funded, measured, and coached like one of ours — while remaining locally legitimate.
        </div>`;
    }

    bindTabs($("[data-tabs='integration']"));
  }

  mountShell();

  if (page === "peers") renderPeers();
  if (page === "stakeholders") renderStakeholders();
  if (page === "selection") renderSelection();
  if (page === "diligence") renderDiligence();
  if (page === "integration") renderIntegration();
})();
