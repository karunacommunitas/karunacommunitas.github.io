const KC_READINGS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOEVfvQOytcoRKOuMgioILrj_wiGdix7QBEP-mcLsV-7e2oWtZIKKRdqTjXNECemyfT5P2b_uFGiNO/pub?gid=171203096&single=true&output=csv";

// Quoted cells can contain commas, line breaks, and escaped double quotes.
function parseReadingsCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell); cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("Incomplete CSV");
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const headers = (rows.shift() || []).map(value => value.trim().toLowerCase());
  if (!["title", "author", "link", "genres", "why we recommend it"].every(key => headers.includes(key))) {
    throw new Error("Missing reading columns");
  }
  return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, (values[i] || "").trim()])))
    .filter(reading => reading.title);
}

function getReadingUrl(value) {
  if (!/^https?:\/\//i.test(value) || /^https?:\/\/https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    return url.hostname && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

async function loadCommunityReadings() {
  const list = document.querySelector("#kc-readings-list");
  const status = document.querySelector("#kc-readings-status");
  const retry = document.querySelector("#kc-readings-retry");
  if (!list || !status || !retry) return;
  retry.hidden = true;
  status.textContent = "Loading community recommendations…";
  list.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(KC_READINGS_CSV_URL, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("Readings unavailable");
    const readings = parseReadingsCsv(await response.text());
    list.replaceChildren();
    for (const reading of readings) {
      const card = document.createElement("article");
      card.className = "kc-value-card kc-reading-card";
      const title = document.createElement("h2");
      title.textContent = reading.title;
      card.append(title);
      if (reading.author) {
        const author = document.createElement("p");
        author.className = "kc-reading-author";
        author.textContent = `By ${reading.author}`;
        card.append(author);
      }
      if (reading.genres) {
        const genres = document.createElement("ul");
        genres.className = "kc-reading-genres";
        genres.setAttribute("aria-label", "Genres");
        reading.genres.split(",").map(value => value.trim()).filter(Boolean).forEach(value => {
          const genre = document.createElement("li");
          genre.textContent = value;
          genres.append(genre);
        });
        card.append(genres);
      }
      if (reading["why we recommend it"]) {
        const heading = document.createElement("h3");
        heading.textContent = "Why we recommend it";
        const description = document.createElement("p");
        description.className = "kc-reading-description";
        description.textContent = reading["why we recommend it"];
        card.append(heading, description);
      }
      const url = getReadingUrl(reading.link);
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.textContent = "Explore this reading";
        link.setAttribute("aria-label", `Explore ${reading.title}`);
        card.append(link);
      }
      list.append(card);
    }
    status.textContent = readings.length ? `${readings.length} community recommendation${readings.length === 1 ? "" : "s"}` : "Our community reading list is coming soon.";
  } catch {
    status.textContent = "We couldn’t load the reading list just now. Please try again in a moment.";
    retry.hidden = false;
  } finally {
    list.removeAttribute("aria-busy");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#kc-readings-retry")?.addEventListener("click", loadCommunityReadings);
  loadCommunityReadings();
});
