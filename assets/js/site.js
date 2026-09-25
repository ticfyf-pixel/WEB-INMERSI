(function () {
  document.documentElement.classList.add("js");
  const stars = document.getElementById("stars");
  if (stars && !stars.childElementCount) {
    let s = 2103981;
    const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 70; i++) {
      const d = document.createElement("i");
      d.className = "star";
      d.style.left = rnd() * 100 + "%";
      d.style.top = rnd() * 55 + "%";
      d.style.opacity = String(0.15 + rnd() * 0.55);
      d.style.transform = "scale(" + (0.6 + rnd() * 1.6) + ")";
      frag.appendChild(d);
    }
    stars.appendChild(frag);
  }
  const GATES = [
    "(max-width: 720px)",
    "(orientation: portrait) and (max-width: 1024px)",
    "(orientation: portrait) and (pointer: coarse)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)"
  ];

  const stage = document.getElementById("stage");
  const hero = document.getElementById("hero");
  const bands = [...document.querySelectorAll(".hero-scrub .band")].map((el) => {
    return {
      el,
      a: Number(el.dataset.a),
      b: Number(el.dataset.b),
      op: -1,
      k: -1
    };
  });

  let scrubOn = false;
  let heroOnScreen = true;
  let target = 0;
  let shown = 0;
  let rafId = null;
  let lastTick = 0;
  let loadK = 0;
  const loadStart = performance.now();

  const smoothstep = (p, e0, e1) => {
    const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function heroProgress() {
    const rect = hero.getBoundingClientRect();
    const range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 1;
    return clamp(-rect.top / range, 0, 1);
  }

  function updateCaptions(p) {
    const now = performance.now();
    if (now - loadStart < 900) {
      loadK = smoothstep((now - loadStart) / 900, 0, 1);
    } else {
      loadK = 1;
    }
    bands.forEach((band, i) => {
      const { a, b, el } = band;
      const f = Math.min(0.02, (b - a) / 3);
      let opacity;
      if (i === 0) opacity = 1 - smoothstep(p, b - f, b);
      else if (i === bands.length - 1) opacity = smoothstep(p, a, a + f);
      else opacity = smoothstep(p, a, a + f) * (1 - smoothstep(p, b - f, b));
      const ramp = Math.min(0.025, (b - a) * 0.35);
      let k = clamp((p - a) / ramp, 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(opacity - band.op) > 0.008) {
        band.op = opacity;
        el.style.opacity = String(opacity);
      }
      if (Math.abs(k - band.k) > 0.008) {
        band.k = k;
        el.style.setProperty("--k", k.toFixed(3));
      }
    });
    const lights = clamp((p - 0.18) / 0.24, 0, 1);
    const gate = clamp((p - 0.4) / 0.32, 0, 1);
    const lantern = clamp((p - 0.7) / 0.18, 0, 1);
    stage.style.setProperty("--p", p.toFixed(4));
    stage.style.setProperty("--lights", lights.toFixed(4));
    stage.style.setProperty("--gate", gate.toFixed(4));
    stage.style.setProperty("--lantern", lantern.toFixed(4));
  }

  function tick(now) {
    const dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    const k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) {
      shown = target;
      rafId = null;
      lastTick = 0;
    } else {
      rafId = requestAnimationFrame(tick);
    }
    updateCaptions(shown);
    if (loadK < 1 && rafId === null && scrubOn) rafId = requestAnimationFrame(tick);
  }

  let lastPage = -1;
  function pageRail() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    if (Math.abs(y - lastPage) < 0.004) return;
    lastPage = y;
    document.documentElement.style.setProperty("--page", y.toFixed(3));
  }

  function onScroll() {
    target = heroProgress();
    pageRail();
    if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
  }
  addEventListener("scroll", pageRail, { passive: true });
  pageRail();

  function unpinFinalStates() {
    document.querySelector(".plan-wrap")?.classList.remove("is-reduced");
    bands.forEach((b) => {
      b.op = -1;
      b.k = -1;
    });
  }

  function pinToFinalStates() {
    updateCaptions(1);
    document.querySelector(".plan-wrap")?.classList.add("is-reduced", "is-done");
    const done = document.getElementById("planDone");
    const hint = document.getElementById("planHint");
    if (done) done.hidden = false;
    if (hint) hint.hidden = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function enableScrub() {
    if (scrubOn) return;
    scrubOn = true;
    addEventListener("scroll", onScroll, { passive: true });
    unpinFinalStates();
    updateCaptions(heroProgress());
    onScroll();
  }

  function disableScrub() {
    if (!scrubOn) return;
    scrubOn = false;
    removeEventListener("scroll", onScroll);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    pinToFinalStates();
  }

  function applyHeroMode() {
    if (GATES.some((q) => matchMedia(q).matches)) disableScrub();
    else enableScrub();
  }

  const MQLS = GATES.map((q) => matchMedia(q));
  MQLS.forEach((m) => m.addEventListener("change", applyHeroMode));
  applyHeroMode();

  matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    if (e.matches) pinToFinalStates();
    else applyHeroMode();
  });

  new IntersectionObserver((entries) => {
    heroOnScreen = entries[0].isIntersecting;
    if (!heroOnScreen && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }).observe(hero);

  document.querySelectorAll(".oficio, .rise, .hears figure, .faq details, .como-copy, .plan-wrap").forEach((el) => {
    el.classList.add("rise");
    new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 }).observe(el);
  });

  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("paused", document.hidden);
  });

  const planWrap = document.querySelector(".plan-wrap");
  const plan = document.getElementById("plan");
  const planPath = document.getElementById("planPath");
  const planDone = document.getElementById("planDone");
  const planHint = document.getElementById("planHint");
  let planProg = 0;
  let planRaf = null;
  let holding = false;

  function setPlan(v) {
    planProg = clamp(v, 0, 1);
    if (planPath) planPath.style.strokeDashoffset = String(720 * (1 - planProg));
    if (planProg >= 0.97) {
      planWrap.classList.add("is-done");
      if (planDone) planDone.hidden = false;
      if (planHint) planHint.hidden = true;
    }
  }

  function easePlanBack() {
    holding = false;
    const step = () => {
      if (holding || planWrap.classList.contains("is-done")) return;
      planProg += (0 - planProg) * 0.08;
      setPlan(planProg);
      if (planProg > 0.01) planRaf = requestAnimationFrame(step);
    };
    planRaf = requestAnimationFrame(step);
  }

  function pointerNearPath(ev) {
    if (!planPath) return false;
    const pt = plan.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const ctm = plan.getScreenCTM();
    if (!ctm) return false;
    const loc = pt.matrixTransform(ctm.inverse());
    const len = planPath.getTotalLength();
    const goal = len * Math.min(0.99, planProg + 0.04);
    const p = planPath.getPointAtLength(goal);
    const dx = loc.x - p.x;
    const dy = loc.y - p.y;
    return dx * dx + dy * dy < 900;
  }

  if (plan && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    plan.addEventListener("pointerdown", (ev) => {
      if (matchMedia("(pointer: coarse)").matches) {
        setPlan(1);
        return;
      }
      holding = true;
      plan.setPointerCapture(ev.pointerId);
      if (pointerNearPath(ev)) setPlan(planProg + 0.08);
    });
    plan.addEventListener("pointermove", (ev) => {
      if (!holding) return;
      if (pointerNearPath(ev)) setPlan(planProg + 0.045);
    });
    plan.addEventListener("pointerup", easePlanBack);
    plan.addEventListener("pointercancel", easePlanBack);
  } else {
    planWrap?.classList.add("is-reduced", "is-done");
    if (planDone) planDone.hidden = false;
    if (planHint) planHint.hidden = true;
  }

  const form = document.getElementById("diagForm");
  const formOk = document.getElementById("formOk");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (!form.reportValidity()) return;
    const body = [
      "Nombre: " + data.get("nombre"),
      "Sitio: " + data.get("sitio"),
      "Ciudad: " + data.get("ciudad"),
      "Correo: " + data.get("correo"),
      "",
      "Qué te preocupa:",
      data.get("nota") || ""
    ].join("\n");
    const href =
      "mailto:gerencia@seruma.com.co?subject=" +
      encodeURIComponent("Diagnóstico SERUMA") +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = href;
    if (formOk) formOk.hidden = false;
  });
})();
