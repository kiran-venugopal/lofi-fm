async function initGA() {
  try {
    // const { default: ReactGA } = await import("react-ga4");
    // ReactGA.initialize("G-99BB8YJNGZ");
    // // Send pageview with a custom path
    // ReactGA.send({
    //   hitType: "pageview",
    //   page: window.location.pathname + window.location.search,
    //   title: "Page Loaded",
    // });
  } catch (err) {
    console.error("Error in GA config!", err);
  }
}

export default initGA;
