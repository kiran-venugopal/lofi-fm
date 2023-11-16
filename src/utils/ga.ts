async function initGA() {
  try {
    const mixpanel = await import("mixpanel-browser");

    mixpanel.init("5d2cbd8006e9a5c5c077c2f36592c2c1", {
      debug: true,
      track_pageview: true,
      persistence: "localStorage",
    });

    mixpanel.track("Page load", {
      Path: window.location.pathname + window.location.search,
    });
  } catch (err) {
    console.error("Error in GA config!", err);
  }
}

export default initGA;
