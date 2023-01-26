async function initGA() {
  try {
    const ReactGA = await import("react-ga");
    ReactGA.initialize("UA-163410944-1", {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
  } catch (err) {
    console.error("Error in GA config!", err);
  }
}

export default initGA;
