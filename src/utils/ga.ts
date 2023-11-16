async function initGA() {
  try {
    const ReactGA = await import("react-ga4");
    ReactGA.initialize("G-99BB8YJNGZ")
  } catch (err) {
    console.error("Error in GA config!", err);
  }
}

export default initGA;
