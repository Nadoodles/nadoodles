// ===== Calendly booking popup =====
// Load Calendly only when someone shows interest in booking, so the page stays fast.
// If Calendly can't load, the link simply opens the booking page instead.
(function () {
  var BRAND = "ff6a3d";
  var loading = null;

  function loadCalendly() {
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(css);
      var js = document.createElement("script");
      js.src = "https://assets.calendly.com/assets/external/widget.js";
      js.async = true;
      js.onload = resolve;
      js.onerror = reject;
      document.head.appendChild(js);
    });
    return loading;
  }

  document.querySelectorAll("[data-calendly]").forEach(function (link) {
    ["pointerenter", "touchstart", "focus"].forEach(function (evt) {
      link.addEventListener(evt, loadCalendly, { once: true, passive: true });
    });

    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var done = false;
      var fallback = function () { if (!done) { done = true; window.location.href = link.href; } };
      var timer = setTimeout(fallback, 5000);
      loadCalendly().then(function () {
        if (done || !window.Calendly) return fallback();
        done = true;
        clearTimeout(timer);
        window.Calendly.initPopupWidget({
          url: link.href + "?hide_gdpr_banner=1&primary_color=" + BRAND
        });
      }).catch(function () { clearTimeout(timer); fallback(); });
    });
  });
})();

// ===== "What's taking up too much of your time?" picker =====
(function () {
  var SOLUTIONS = {
    leads: {
      before: "Inquiries sit in your inbox until you have time. Some get a reply days later; some never do.",
      title: "Automatic lead follow-up",
      after: "Every inquiry gets an instant, friendly reply, lands in one list, and you get a nudge if nobody has called back.",
      benefit: "No lead slips through the cracks."
    },
    scheduling: {
      before: "Back-and-forth calls and texts to find a time, then no-shows because nobody sent a reminder.",
      title: "Online booking with reminders",
      after: "Customers pick a time that works, get a confirmation right away, and receive a reminder before the appointment.",
      benefit: "Fewer messages and fewer no-shows."
    },
    customers: {
      before: "Customer details are spread across spreadsheets, notebooks, email, and your phone.",
      title: "One place for every customer",
      after: "A simple customer system with contact info, history, and notes, so anyone on your team can pick up where you left off.",
      benefit: "Find anything about a customer in seconds."
    },
    questions: {
      before: "You answer the same questions about hours, prices, and services over and over, by phone and email.",
      title: "A website assistant",
      after: "An AI assistant on your website answers common questions from your own information and hands anything tricky to you.",
      benefit: "Customers get answers at any hour. You get your time back."
    },
    invoices: {
      before: "You keep a mental list of who owes what and send awkward reminder emails one at a time.",
      title: "Automatic payment reminders",
      after: "Invoices go out with a pay-online link, and polite reminders are sent on a schedule until they're paid.",
      benefit: "Get paid faster without chasing anyone."
    },
    members: {
      before: "Paper forms, checks in the mail, and a spreadsheet you update by hand after every event.",
      title: "Online registration and payments",
      after: "Members sign up and pay online, renewals are tracked automatically, and you can see everything in one dashboard.",
      benefit: "Less paperwork and a clear picture of who's in."
    }
  };

  var chips = document.querySelectorAll(".chip[data-problem]");
  var box = document.querySelector(".solution");
  if (!chips.length || !box) return;

  var els = {
    before: document.getElementById("sol-before"),
    title: document.getElementById("sol-title"),
    after: document.getElementById("sol-after"),
    benefit: document.getElementById("sol-benefit")
  };

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var s = SOLUTIONS[chip.dataset.problem];
      if (!s) return;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      Object.keys(els).forEach(function (k) { els[k].textContent = s[k]; });
      box.classList.remove("swap");
      void box.offsetWidth; // restart the fade animation
      box.classList.add("swap");
    });
  });
})();
