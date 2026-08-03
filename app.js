(() => {
  const data = window.PLAYBOOK;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const page = document.body.dataset.page || "home";

  const NAV = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "peers", href: "peers.html", label: "Peer Benchmark" },
    { id: "stakeholders", href: "stakeholders.html", label: "Stakeholders" },
    { id: "selection", href: "selection.html", label: "Selection" },
    { id: "diligence", href: "diligence.html", label: "Diligence" },
    { id: "integration", href: "integration.html", label: "Integration" }
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
        <span>© FCMB Group Expansion Playbook · build 20260803c</span>
        <a href="https://github.com/Eniola-Giwa/fcmb-group-expansion-playbook" target="_blank" rel="noopener">GitHub</a>
      </div>
    `;

    document.body.prepend(header);
    document.body.prepend(top);
    document.body.appendChild(footer);

    const toggle = $(".nav-toggle");
    const nav = $(".primary-nav .nav");
    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
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
    const max = Math.max(...growth.map((g) => g.countries));
    return `
      <div class="growth-chart" aria-label="Country count over time">
        <div class="growth-chart-head">
          <h4>Countries over time</h4>
          <span>Hover / tap a bar for the count</span>
        </div>
        <div class="growth-bars">
          ${growth
            .map((g) => {
              const h = Math.max(8, Math.round((g.countries / max) * 100));
              return `
              <div class="growth-bar" style="--h:${h}%" title="${g.year}: ${g.countries} countries">
                <i style="height:${h}%"></i>
                <em>${g.countries}</em>
                <span>${g.year}</span>
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
          }" data-target="peer-${p.id}">${p.name}</button>`
      )
      .join("");

    panels.innerHTML = data.peers
      .map(
        (p, i) => `
      <div class="panel${i === 0 ? " is-active" : ""}" id="peer-${p.id}" role="tabpanel">
        <div class="panel-card peer-rich">
          <div class="peer-rich-head">
            <div>
              <h2>${p.name}</h2>
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
        <p class="intro">Patterns across the seven banks that expanded Africa the hardest.</p>
        <div class="grid-2">
          ${data.peerLessons
            .map((l) => `<div class="mini-card"><h4>${l.title}</h4><p>${l.body}</p></div>`)
            .join("")}
        </div>
      </div>`;
    panels.appendChild(lessonsPanel);

    bindTabs($("[data-tabs='peers']"));
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
          <div class="panel-card">
            <h2>${s.title}</h2>
            <p class="intro">${s.intro}</p>
            <ul class="list">${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
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

    if (filters) {
      filters.innerHTML = `
        <div class="three-col">
          <div class="mini-card">
            <h4>Level I — Macro & market</h4>
            <p>GDP scale, financial depth, political stability, FX convertibility, language fit, peer bank presence.</p>
            <ul><li>Top 20 longlist</li><li>Exclude sanction / extreme FX risk</li><li>Prefer familiar legal systems</li></ul>
          </div>
          <div class="mini-card">
            <h4>Level II — Capability fit</h4>
            <p>Match market structure to FCMB strengths: SME, digital banking, corridors, UK–Africa remittances.</p>
            <ul><li>Banking concentration & SME gap</li><li>Digital readiness</li><li>Payroll / consumer TAM</li></ul>
          </div>
          <div class="mini-card">
            <h4>Level III — Entry realism</h4>
            <p>Regulatory openness, foreign ownership, license upgrade path, willing sellers, time-to-market.</p>
            <ul><li>Central bank openness</li><li>Local partner rules</li><li>Acquire vs build feasibility</li></ul>
          </div>
        </div>
        <div class="callout" style="margin-top:1rem">
          <strong>Source</strong>
          Country screen approach drawn from FCMB’s Africa shortlist work with KPMG and the Ghana / Bayport entry case.
        </div>`;
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
            <div class="three-col">
              <div class="mini-card"><h4>When to use</h4><ul>${m.when.map((x) => `<li>${x}</li>`).join("")}</ul></div>
              <div class="mini-card"><h4>How to execute</h4><ul>${m.how.map((x) => `<li>${x}</li>`).join("")}</ul></div>
              <div class="mini-card"><h4>Watch-outs</h4><ul>${m.risks.map((x) => `<li>${x}</li>`).join("")}</ul></div>
            </div>
            <div class="callout"><strong>FCMB default</strong>${m.fcmb}</div>
          </div>`;
        })
        .join("");
      bindTabs($("[data-tabs='modes']"));
    }

    if (pathways) {
      pathways.innerHTML = `
        <div class="three-col">
          <div class="mini-card">
            <h4>Acquire a mid-tier bank</h4>
            <p>Fastest full banking ops. Deposit base, branches, FX. Best when valuation is fair and the book is clean.</p>
          </div>
          <div class="mini-card">
            <h4>Acquire a large MFB / S&amp;L</h4>
            <p>Lower entry price, strong retail/payroll base. Plan a 12–24 month license upgrade for full bank capabilities.</p>
          </div>
          <div class="mini-card">
            <h4>Greenfield license</h4>
            <p>Full design control. Multi-year capital and distribution build. Use when no franchise meets quality gates.</p>
          </div>
        </div>`;
    }

    bindTabs($("[data-tabs='selection']"));
  }

  function renderDiligence() {
    const streams = $("#panel-streams");
    if (streams) {
      streams.innerHTML = `
        <div class="grid-3">
          ${data.ddStreams
            .map(
              (s) => `
            <div class="mini-card">
              <h4>${s.name}</h4>
              <ul>${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>
            </div>`
            )
            .join("")}
        </div>`;
    }

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
        <div class="stat-row">
          <div class="stat"><strong>2.5×</strong><span>Loan book</span></div>
          <div class="stat"><strong>2.0×</strong><span>Customers</span></div>
          <div class="stat"><strong>50%</strong><span>Lower CTS</span></div>
          <div class="stat"><strong>&gt;20%</strong><span>Target ROE</span></div>
          <div class="stat"><strong>&lt;5%</strong><span>Norm. CoR</span></div>
        </div>
        <div class="grid-3">
          ${data.levers
            .map((l) => `<div class="mini-card"><h4>${l.title}</h4><p>${l.body}</p></div>`)
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
            <h3 style="margin:0 0 0.6rem;color:var(--fcmb-purple-deep)">${p.title}</h3>
            <ul class="list">${p.items.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>`;
        })
        .join("");
      bindTabs($("[data-tabs='phases']"));
    }

    const kpis = $("#panel-kpis");
    if (kpis) {
      kpis.innerHTML = `
        <div class="kpi-table">
          <div class="kpi-row header"><span>Area</span><span>Day-100 target</span><span>Owner</span><span>Cadence</span></div>
          ${data.kpis
            .map(
              (k) =>
                `<div class="kpi-row"><span>${k.area}</span><span>${k.target}</span><span>${k.owner}</span><span>${k.when}</span></div>`
            )
            .join("")}
        </div>`;
    }

    const horizon = $("#panel-horizon");
    if (horizon) {
      horizon.innerHTML = `
        <ol class="horizon-list">
          <li><strong>2026</strong> — Invest and strengthen: capital, controls, people</li>
          <li><strong>2027</strong> — Digital platform live</li>
          <li><strong>2028</strong> — Multi-product scale (2.5+ products per customer)</li>
          <li><strong>2030</strong> — Regional significance</li>
          <li><strong>Beyond 2035</strong> — Permanent franchise, measured in decades</li>
        </ol>
        <div class="callout">
          <strong>Transformation mandate</strong>
          Not a turnaround theatre — a reinvention into a technology-enabled, diversified retail platform (Bayport Transformation Blueprint).
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
