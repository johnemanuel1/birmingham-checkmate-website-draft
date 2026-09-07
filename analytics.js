(() => {
  const measurementId = "G-2L2S132MV6";
  const storageKey = "checkmate-analytics-consent-v1";
  let consent = null;
  let started = false;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && saved.expires > Date.now()) consent = saved.choice;
  } catch (_) { /* Storage may be unavailable in private browsing. */ }

  function startAnalytics() {
    if (started || consent !== "accepted") return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    // Exclude query strings and fragments, which can contain personal information.
    window.gtag("config", measurementId, {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : "",
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }

  window.trackBookingEnquiry = () => {
    if (consent === "accepted" && started) {
      window.gtag("event", "generate_lead", { form_id: "booking-form" });
    }
  };

  const panel = document.createElement("section");
  panel.className = "analytics-consent";
  panel.setAttribute("aria-label", "Analytics cookie choice");
  panel.innerHTML = '<h2>Help us improve the website</h2><p>With your permission, Google Analytics uses cookies to measure visits and successful booking enquiries. We do not send names, email addresses or booking answers to Analytics. You can use the website and booking form without accepting.</p><p>Your choice is saved on this device for six months. You can change it using Analytics settings in the footer. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a>.</p><div><button type="button" data-choice="accepted">Accept analytics</button> <button type="button" data-choice="rejected">Reject analytics</button></div>';
  panel.hidden = consent === "accepted" || consent === "rejected";
  document.body.appendChild(panel);

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "analytics-settings";
  settings.textContent = "Analytics settings";
  (document.querySelector(".site-footer") || document.body).appendChild(settings);
  settings.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector("button").focus();
  });

  panel.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      consent = button.dataset.choice;
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          choice: consent, expires: Date.now() + 15552000000
        }));
      } catch (_) { /* The choice still applies to this page. */ }
      panel.hidden = true;
      settings.focus();
      if (consent === "accepted") {
        startAnalytics();
      } else if (started) {
        window["ga-disable-" + measurementId] = true;
        const parts = location.hostname.split(".");
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0].trim();
          if (name !== "_ga" && !name.startsWith("_ga_")) return;
          document.cookie = name + "=; Max-Age=0; path=/";
          for (let i = 0; i < parts.length - 1; i++) {
            document.cookie = name + "=; Max-Age=0; path=/; domain=" + parts.slice(i).join(".");
          }
        });
        location.reload();
      }
    });
  });
  startAnalytics();
})();
