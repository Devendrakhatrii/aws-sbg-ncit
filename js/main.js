/* AWS SBG NCIT: renders the page from window.SBG (js/data.js). */
(function () {
  "use strict";

  const D = window.SBG || { site: {}, socials: [], events: [], members: [] };
  const $ = (s, r = document) => r.querySelector(s);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^(https?:|mailto:|#|assets\/|\.?\/)/i.test(String(u || "")) ? u : "");
  const mail = (e) => (e && e.user && e.domain ? `mailto:${e.user}@${e.domain}` : "");

  const ICONS = {
    facebook: "fa-brands fa-facebook-f", instagram: "fa-brands fa-instagram", linkedin: "fa-brands fa-linkedin-in",
    discord: "fa-brands fa-discord", youtube: "fa-brands fa-youtube", github: "fa-brands fa-github",
    x: "fa-brands fa-x-twitter", twitter: "fa-brands fa-x-twitter", meetup: "fa-brands fa-meetup",
    whatsapp: "fa-brands fa-whatsapp", tiktok: "fa-brands fa-tiktok",
  };
  const icon = (p) => ICONS[String(p).toLowerCase()] || "fa-solid fa-link";

  /* ---------- Site text ---------- */
  const s = D.site || {};
  document.querySelectorAll("[data-site]").forEach((el) => {
    const key = el.dataset.site;
    if (key === "tagline" && s.tagline) {
      el.innerHTML = esc(s.tagline).replace(/,\s*/, ",<br />");
    } else if (s[key]) {
      el.textContent = s[key];
    }
  });
  document.querySelectorAll("[data-join]").forEach((a) => {
    if (safeUrl(s.joinUrl)) { a.href = s.joinUrl; a.target = "_blank"; a.rel = "noopener"; }
  });
  const groupEmail = $("#groupEmail");
  // Build the mailto on first interaction so the address never appears in the static HTML.
  if (groupEmail) {
    const arm = () => { const m = mail(s.email); if (m) groupEmail.href = m; };
    ["mouseenter", "focus", "touchstart"].forEach((ev) => groupEmail.addEventListener(ev, arm, { once: true, passive: true }));
  }
  const mapLink = $("#mapLink");
  if (mapLink && safeUrl(s.mapUrl)) mapLink.href = s.mapUrl;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Hero box grid ---------- */
  const grid = $("#heroGrid");
  function buildGrid() {
    grid.querySelectorAll(".cellbox").forEach((c) => c.remove());
    const cs = getComputedStyle(grid);
    const cols = parseInt(cs.getPropertyValue("--cols"), 10) || 20;
    const rows = parseInt(cs.getPropertyValue("--rows"), 10) || 9;
    let used = 0;
    [...grid.children].forEach((el) => {
      const st = getComputedStyle(el);
      const w = (parseInt(st.gridColumnEnd, 10) || 0) - (parseInt(st.gridColumnStart, 10) || 0);
      const h = (parseInt(st.gridRowEnd, 10) || 0) - (parseInt(st.gridRowStart, 10) || 0);
      if (w > 0 && h > 0) used += w * h;
    });
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows - used; i++) {
      const c = document.createElement("div");
      c.className = "cellbox";
      c.setAttribute("aria-hidden", "true");
      frag.appendChild(c);
    }
    grid.appendChild(frag);
  }
  buildGrid();
  window.matchMedia("(max-width: 860px)").addEventListener("change", buildGrid);

  // Occasionally light up a random empty cell, like the cover art.
  if (!reduceMotion) {
    setInterval(() => {
      const cells = grid.querySelectorAll(".cellbox");
      if (!cells.length || document.hidden) return;
      const c = cells[Math.floor(Math.random() * cells.length)];
      c.classList.add("on");
      setTimeout(() => c.classList.remove("on"), 2200);
    }, 900);
  }

  /* ---------- Hover trail on every box grid ----------
     data-hovergrid="64"  → fixed 64px cells
     data-hovergrid="10x5" → 10 columns × 5 rows that scale with the element */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let lastKey = "";
    document.addEventListener("pointermove", (ev) => {
      const el = ev.target.closest && ev.target.closest("[data-hovergrid]");
      if (!el) { lastKey = ""; return; }
      const r = el.getBoundingClientRect();
      const spec = el.dataset.hovergrid;
      let cw, ch;
      if (spec.includes("x")) {
        const [c, rws] = spec.split("x").map(Number);
        cw = r.width / c; ch = r.height / rws;
      } else {
        cw = ch = Number(spec);
      }
      const col = Math.floor((ev.clientX - r.left - el.clientLeft) / cw);
      const row = Math.floor((ev.clientY - r.top - el.clientTop) / ch);
      // Clip partial edge cells (last row/column) to the element's inner box.
      const w = Math.min(cw, el.clientWidth - col * cw);
      const h = Math.min(ch, el.clientHeight - row * ch);
      if (col < 0 || row < 0 || w <= 0 || h <= 0) return;
      const key = spec + ":" + col + ":" + row + ":" + Math.round(r.top + window.scrollY);
      if (key === lastKey) return;
      lastKey = key;
      const sq = document.createElement("span");
      sq.className = "gridhover";
      sq.style.cssText = `left:${col * cw}px;top:${row * ch}px;width:${w}px;height:${h}px`;
      el.appendChild(sq);
      sq.addEventListener("animationend", () => sq.remove());
      setTimeout(() => sq.remove(), 1500); // safety if animations are disabled
    }, { passive: true });
  }

  /* ---------- Events ---------- */
  const now = new Date();
  const events = (D.events || [])
    .map((e) => ({ ...e, _d: new Date(e.date) }))
    .filter((e) => !isNaN(e._d));
  const upcoming = events.filter((e) => e._d >= now).sort((a, b) => a._d - b._d);
  const past = events.filter((e) => e._d < now).sort((a, b) => b._d - a._d);

  const fmtDay = (d) => d.toLocaleDateString(undefined, { day: "2-digit" });
  const fmtMon = (d) => d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
  const fmtFull = (d) =>
    d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

  // Deterministic pseudo-random squares per title, so the placeholder art is stable.
  function patternSquares(seed) {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32);
    let out = "";
    for (let i = 0; i < 4; i++) {
      const big = rnd() < 0.35;               // 2x2 or 1x1 cell on a 10x5 grid
      const x = 3 + Math.floor(rnd() * (big ? 6 : 7));
      const y = Math.floor(rnd() * (big ? 4 : 5));
      out += `<span class="sq" style="left:${x * 10}%;top:${y * 20}%;width:${big ? 20 : 10}%;height:${big ? 40 : 20}%"></span>`;
    }
    return out;
  }

  function eventCard(e, isPast) {
    const img = safeUrl(e.image);
    const media = img
      ? `<div class="event__media"><img src="${esc(img)}" alt="" loading="lazy" /></div>`
      : `<div class="event__media event__media--pattern" data-hovergrid="10x5" aria-hidden="true">${patternSquares(e.title)}</div>`;
    const actions = [];
    if (!isPast && safeUrl(e.registerUrl))
      actions.push(`<a class="btn btn--primary btn--sm" href="${esc(e.registerUrl)}" target="_blank" rel="noopener">Register <i class="fa-solid fa-arrow-right"></i></a>`);
    if (isPast && safeUrl(e.recapUrl))
      actions.push(`<a class="btn btn--ghost btn--sm" href="${esc(e.recapUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-images"></i> Recap</a>`);
    if (isPast && safeUrl(e.slidesUrl))
      actions.push(`<a class="btn btn--ghost btn--sm" href="${esc(e.slidesUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-lines"></i> Slides</a>`);
    if (safeUrl(e.meetupUrl))
      actions.push(`<a class="btn btn--ghost btn--sm" href="${esc(e.meetupUrl)}" target="_blank" rel="noopener"><i class="fa-brands fa-meetup"></i> ${isPast ? "View on Meetup" : "RSVP on Meetup"}</a>`);
    return `
      <article class="event reveal" data-type="${esc(e.type)}">
        ${media}
        <div class="event__strip">
          <div class="event__date"><strong>${fmtDay(e._d)}</strong><span>${esc(fmtMon(e._d))}</span></div>
          <span class="tag">${esc(e.type || "Event")}</span>
        </div>
        <div class="event__body">
          <h3>${esc(e.title)}</h3>
          <div class="meta">
            <span><i class="fa-regular fa-clock"></i>${esc(fmtFull(e._d))}</span>
            ${e.venue ? `<span><i class="fa-solid fa-location-dot"></i>${esc(e.venue)}</span>` : ""}
            ${e.attendees ? `<span><i class="fa-solid fa-user-check"></i>${esc(e.attendees)} ${isPast ? "RSVPs" : "going"}</span>` : ""}
          </div>
          <p>${esc(e.description)}</p>
          ${actions.length ? `<div class="event__actions">${actions.join("")}</div>` : ""}
        </div>
      </article>`;
  }

  $("#upcomingList").innerHTML = upcoming.length
    ? upcoming.map((e) => eventCard(e, false)).join("")
    : suggestPanel();

  /* Empty state: "Suggest an event" form that opens a pre-filled Gmail draft. */
  function suggestPanel() {
    return `
      <div class="suggest cell">
        <div class="suggest__intro">
          <span class="suggest__badge"><i class="fa-regular fa-calendar"></i> Nothing scheduled yet</span>
          <h3>Suggest our next event</h3>
          <p>No upcoming events right now, so tell us what you'd like to learn or build. Workshop topics, speakers, hackathon ideas: we read every suggestion.</p>
          <p class="suggest__follow">Or follow us on social media to hear about the next event first.</p>
        </div>
        <form class="suggest__form" id="suggestForm" novalidate>
          <label><span>Event idea <em aria-hidden="true">*</em></span>
            <input name="topic" required maxlength="120" placeholder="e.g. Intro to Amazon Bedrock" />
          </label>
          <label>Format
            <select name="format">
              <option>Workshop</option><option>Talk</option><option>Hackathon</option>
              <option>Study Jam</option><option>Meetup</option><option>Other</option>
            </select>
          </label>
          <label class="suggest__wide">Details
            <textarea name="details" rows="3" maxlength="1000" placeholder="What should it cover? Who could speak?"></textarea>
          </label>
          <label>Your name
            <input name="name" maxlength="80" placeholder="Optional" />
          </label>
          <label>Program / batch
            <input name="program" maxlength="80" placeholder="Optional" />
          </label>
          <div class="suggest__actions suggest__wide">
            <button class="btn btn--primary" type="submit"><i class="fa-brands fa-google"></i> Send via Gmail</button>
            <a class="suggest__alt" href="#" id="suggestMailto">Use my email app instead</a>
          </div>
          <p class="suggest__error suggest__wide" id="suggestError" role="alert" hidden>Please add an event idea first.</p>
        </form>
      </div>`;
  }

  const suggestForm = $("#suggestForm");
  if (suggestForm) {
    const to = s.email && s.email.user ? `${s.email.user}@${s.email.domain}` : "";
    const compose = () => {
      const f = new FormData(suggestForm);
      const topic = String(f.get("topic") || "").trim();
      const subject = `Event suggestion: ${topic}`;
      const body = [
        `Event idea: ${topic}`,
        `Format: ${f.get("format")}`,
        "",
        "Details:",
        String(f.get("details") || "").trim() || "-",
        "",
        `Suggested by: ${String(f.get("name") || "").trim() || "-"}`,
        `Program / batch: ${String(f.get("program") || "").trim() || "-"}`,
      ].join("\n");
      return { topic, subject, body };
    };
    const valid = (topic) => {
      $("#suggestError").hidden = !!topic;
      if (!topic) suggestForm.topic.focus();
      return !!topic;
    };
    suggestForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const { topic, subject, body } = compose();
      if (!valid(topic)) return;
      const url = "https://mail.google.com/mail/?view=cm&fs=1" +
        `&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url, "_blank", "noopener");
    });
    $("#suggestMailto").addEventListener("click", (ev) => {
      ev.preventDefault();
      const { topic, subject, body } = compose();
      if (!valid(topic)) return;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Countdown to the next event
  const cd = $("#countdown");
  if (upcoming.length) {
    const next = upcoming[0];
    cd.hidden = false;
    cd.innerHTML = `
      <div class="countdown__label">Next up: <b>${esc(next.title)}</b></div>
      <div class="countdown__clock" role="timer" aria-live="off">
        <div><strong data-u="d">0</strong><span>days</span></div>
        <div><strong data-u="h">0</strong><span>hrs</span></div>
        <div><strong data-u="m">0</strong><span>min</span></div>
        <div><strong data-u="s">0</strong><span>sec</span></div>
      </div>`;
    const tick = () => {
      let ms = Math.max(0, next._d - new Date());
      const parts = { d: 864e5, h: 36e5, m: 6e4, s: 1e3 };
      for (const [u, size] of Object.entries(parts)) {
        const v = Math.floor(ms / size);
        ms -= v * size;
        cd.querySelector(`[data-u="${u}"]`).textContent = String(v).padStart(u === "d" ? 1 : 2, "0");
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  // Past events + filters
  const pastList = $("#pastList");
  const filters = $("#pastFilters");
  const types = ["All", ...new Set(past.map((e) => e.type).filter(Boolean))];
  function renderPast(type) {
    const list = type === "All" ? past : past.filter((e) => e.type === type);
    pastList.innerHTML = list.length
      ? list.map((e) => eventCard(e, true)).join("")
      : `<p class="empty cell">No past events yet.</p>`;
    observe(pastList);
  }
  filters.innerHTML = types
    .map((t, i) => `<button type="button" data-type="${esc(t)}" aria-pressed="${i === 0}">${esc(t)}</button>`)
    .join("");
  filters.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    renderPast(b.dataset.type);
  });
  if (types.length <= 2) filters.hidden = true;

  /* ---------- Members ---------- */
  const GROUPS = [
    ["lead", "Group leader"],
    ["core", "Core team"],
    ["member", "Members"],
  ];
  const initials = (n) => String(n).trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  function memberCard(m) {
    const photo = safeUrl(m.photo)
      ? `<img src="${esc(m.photo)}" alt="Photo of ${esc(m.name)}" loading="lazy" />`
      : `<div class="member__initials"${m.group === "lead" ? "" : ' data-hovergrid="4x4"'} aria-hidden="true">${esc(initials(m.name))}</div>`;
    const links = [];
    if (m.email && m.email.user)
      links.push(`<a href="#" data-mu="${esc(m.email.user)}" data-md="${esc(m.email.domain)}" aria-label="Email ${esc(m.name)}" title="Email"><i class="fa-solid fa-envelope"></i></a>`);
    if (safeUrl(m.linkedin))
      links.push(`<a href="${esc(m.linkedin)}" target="_blank" rel="noopener" aria-label="${esc(m.name)} on LinkedIn" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
    if (safeUrl(m.github))
      links.push(`<a href="${esc(m.github)}" target="_blank" rel="noopener" aria-label="${esc(m.name)} on GitHub" title="GitHub"><i class="fa-brands fa-github"></i></a>`);
    if (safeUrl(m.instagram))
      links.push(`<a href="${esc(m.instagram)}" target="_blank" rel="noopener" aria-label="${esc(m.name)} on Instagram" title="Instagram"><i class="fa-brands fa-instagram"></i></a>`);
    if (safeUrl(m.website))
      links.push(`<a href="${esc(m.website)}" target="_blank" rel="noopener" aria-label="${esc(m.name)}'s website" title="Website"><i class="fa-solid fa-globe"></i></a>`);
    return `
      <article class="member member--${esc(m.group)} reveal">
        <div class="member__photo">${photo}</div>
        <div class="member__body">
          <h3>${esc(m.name)}</h3>
          <span class="member__role">${esc(m.role)}</span>
          ${m.program ? `<span class="member__prog">${esc(m.program)}</span>` : ""}
        </div>
        ${links.length ? `<div class="member__links">${links.join("")}</div>` : ""}
      </article>`;
  }

  // Teams by year (newest first). Falls back to a flat `members` list if present.
  const teams = (D.teams && D.teams.length ? D.teams : [{ year: new Date().getFullYear(), members: D.members || [] }])
    .slice()
    .sort((a, b) => Number(b.year) - Number(a.year));
  let activeYear = teams[0].year;

  const yearsEl = $("#teamYears");
  yearsEl.innerHTML = teams
    .map((t, i) => `<button type="button" role="tab" data-year="${esc(t.year)}" aria-pressed="${i === 0}" aria-selected="${i === 0}">${esc(t.year)}${i === 0 ? " · Current" : ""}</button>`)
    .join("");
  yearsEl.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    activeYear = b.dataset.year;
    yearsEl.querySelectorAll("button").forEach((x) => {
      const on = x === b;
      x.setAttribute("aria-pressed", String(on));
      x.setAttribute("aria-selected", String(on));
    });
    renderMembers($("#memberSearch").value);
  });

  const groupsEl = $("#memberGroups");
  function renderMembers(q = "") {
    const team = teams.find((t) => String(t.year) === String(activeYear)) || teams[0];
    const needle = q.trim().toLowerCase();
    const match = (m) => !needle || [m.name, m.role, m.program].join(" ").toLowerCase().includes(needle);
    const html = GROUPS.map(([key, label]) => {
      const list = (team.members || []).filter((m) => (m.group || "member") === key && match(m));
      if (!list.length) return "";
      return `<section class="group"><h3 class="group__title">${label} ${esc(team.year)} · ${list.length}</h3><div class="members">${list.map(memberCard).join("")}</div></section>`;
    }).join("");
    const hasMembers = (team.members || []).some((m) => (m.group || "member") === "member");
    const apply = !needle && !hasMembers ? applyPanel(team.year) : "";
    groupsEl.innerHTML = (html || (needle ? `<p class="empty cell">No members match "${esc(q)}".</p>` : "")) + apply;
    observe(groupsEl);
  }

  /* No general members listed for this year: invite people to apply by email. */
  function applyPanel(year) {
    return `
      <section class="group">
        <h3 class="group__title">Members ${esc(year)}</h3>
        <div class="suggest cell">
          <div class="suggest__intro">
            <span class="suggest__badge"><i class="fa-solid fa-user-plus"></i> Membership open</span>
            <h3>Apply to become a member</h3>
            <p>Interested in Cloud, AI or DevOps? Join the AWS Student Builder Group at NCIT to get early access to workshops, hands-on labs, hackathons and a community of builders.</p>
            <p class="suggest__follow">Fill this in and we'll email you back about next steps.</p>
          </div>
          <form class="suggest__form" id="applyForm" novalidate>
            <label><span>Full name <em aria-hidden="true">*</em></span>
              <input name="name" required maxlength="80" autocomplete="name" />
            </label>
            <label><span>College email <em aria-hidden="true">*</em></span>
              <input name="email" type="email" required maxlength="120" autocomplete="email" placeholder="you@ncit.edu.np" />
            </label>
            <label>Program
              <select name="program">
                <option>BCA</option><option>BE Computer</option><option>BE Software</option>
                <option>BE IT</option><option>BE Electronics</option><option>BE Civil</option><option>Other</option>
              </select>
            </label>
            <label>Semester
              <select name="semester">
                ${["1st","2nd","3rd","4th","5th","6th","7th","8th"].map((x) => `<option>${x}</option>`).join("")}
              </select>
            </label>
            <fieldset class="suggest__wide apply__interests">
              <legend>Interested in</legend>
              <label><input type="checkbox" name="interest" value="Cloud" checked /> Cloud</label>
              <label><input type="checkbox" name="interest" value="AI / ML" /> AI / ML</label>
              <label><input type="checkbox" name="interest" value="DevOps" /> DevOps</label>
            </fieldset>
            <label class="suggest__wide">Why do you want to join?
              <textarea name="why" rows="3" maxlength="1000" placeholder="Optional: what you'd like to learn or build"></textarea>
            </label>
            <div class="suggest__actions suggest__wide">
              <button class="btn btn--primary" type="submit"><i class="fa-brands fa-google"></i> Apply via Gmail</button>
              <a class="suggest__alt" href="#" data-apply-mailto>Use my email app instead</a>
            </div>
            <p class="suggest__error suggest__wide" data-apply-error role="alert" hidden>Please add your name and a valid email.</p>
          </form>
        </div>
      </section>`;
  }

  // Membership application → pre-filled email (delegated, since the team section re-renders).
  function applyEmail(form) {
    const f = new FormData(form);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const ok = name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    form.querySelector("[data-apply-error]").hidden = !!ok;
    if (!ok) { (name ? form.email : form.name).focus(); return null; }
    const to = s.email && s.email.user ? `${s.email.user}@${s.email.domain}` : "";
    const subject = `Membership application: ${name}`;
    const body = [
      "Hi AWS Student Builder Group team,",
      "",
      "I'd like to apply to become a member.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Program: ${f.get("program")}`,
      `Semester: ${f.get("semester")}`,
      `Interested in: ${f.getAll("interest").join(", ") || "-"}`,
      "",
      "Why I want to join:",
      String(f.get("why") || "").trim() || "-",
    ].join("\n");
    return { to, subject, body };
  }
  groupsEl.addEventListener("submit", (ev) => {
    if (ev.target.id !== "applyForm") return;
    ev.preventDefault();
    const m = applyEmail(ev.target);
    if (!m) return;
    window.open("https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(m.to)}&su=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`, "_blank", "noopener");
  });
  groupsEl.addEventListener("click", (ev) => {
    const a = ev.target.closest("[data-apply-mailto]");
    if (!a) return;
    ev.preventDefault();
    const m = applyEmail(a.closest("form"));
    if (m) window.location.href = `mailto:${m.to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
  });
  // Assemble member emails only when clicked.
  groupsEl.addEventListener("click", (ev) => {
    const a = ev.target.closest("a[data-mu]");
    if (!a) return;
    ev.preventDefault();
    window.location.href = `mailto:${a.dataset.mu}@${a.dataset.md}`;
  });
  $("#memberSearch").addEventListener("input", (ev) => renderMembers(ev.target.value));

  /* ---------- Socials ---------- */
  const socials = (D.socials || []).filter((x) => safeUrl(x.url));
  $("#socials").innerHTML = socials
    .map(
      (x) => `
      <a class="social reveal" href="${esc(x.url)}" target="_blank" rel="noopener">
        <i class="${icon(x.platform)}" aria-hidden="true"></i>
        <strong>${esc(x.label || x.platform)}</strong>
        <span>${esc(x.handle || "")}</span>
      </a>`
    )
    .join("");
  $("#footerSocials").innerHTML = socials
    .map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener" aria-label="${esc(x.label || x.platform)}"><i class="${icon(x.platform)}"></i></a>`)
    .join("");

  /* ---------- Stats ---------- */
  const workshops = past.filter((e) => /workshop|study jam/i.test(e.type || "")).length;
  const stats = [
    [s.memberCount || ((D.teams && D.teams[0] && D.teams[0].members) || D.members || []).length + "+", "Community members"],
    [past.length, "Events held"],
    [workshops, "Hands-on sessions"],
    upcoming.length
      ? [upcoming.length, "Coming up"]
      : [past.reduce((n, e) => n + (Number(e.attendees) || 0), 0) + "+", "Event RSVPs"],
  ];
  $("#stats").innerHTML = stats.map(([n, l]) => `<li><strong>${esc(n)}</strong><span>${esc(l)}</span></li>`).join("");

  /* ---------- Nav: burger, theme, active link ---------- */
  const burger = $("#burger");
  const links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    burger.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}" aria-hidden="true"></i>`;
  });
  links.addEventListener("click", (ev) => {
    if (ev.target.closest("a") && links.classList.contains("open")) burger.click();
  });

  const themeBtn = $("#themeToggle");
  const setThemeIcon = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeBtn.innerHTML = `<i class="fa-solid ${light ? "fa-moon" : "fa-sun"}" aria-hidden="true"></i>`;
    document.querySelector('meta[name="theme-color"]').content = light ? "#f3f6fa" : "#161d26";
  };
  setThemeIcon();
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("sbg-theme", next); } catch (e) {}
    setThemeIcon();
  });

  const navAnchors = [...links.querySelectorAll('a[href^="#"]:not(.btn)')];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((sec) => spy.observe(sec));
  }

  /* ---------- Reveal on scroll ---------- */
  let io = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12 }
    );
  }
  function observe(root) {
    root.querySelectorAll(".reveal:not(.in)").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }

  renderPast("All");
  renderMembers();
  observe(document);
})();
