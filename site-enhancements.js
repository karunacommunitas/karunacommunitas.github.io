const KC_CONTACT_EMAIL = "info@karunacommunitas.com";
const KC_FORMSUBMIT_TOKEN = "8319f8c5d70d6fc0cf48ca477f50f6fc";
const KC_CONTACT_ENDPOINT = `https://formsubmit.co/${KC_FORMSUBMIT_TOKEN}`;
const KC_CONTACT_AJAX_ENDPOINT = `https://formsubmit.co/ajax/${KC_FORMSUBMIT_TOKEN}`;
const KC_CONTACT_SUCCESS_PATH = "/contact/thanks/";
const KC_LOGO_PATH = "/assets/images/branding/KarunaCommunitas_Logo.png";
const KC_FAVICON_PATH = "/assets/images/branding/favicon.ico";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const pageMap = new Map([
    ["/", "home"],
    ["/about", "about"],
    ["/articles", "articles"],
    ["/resources", "resources"],
    ["/resources/preparation-tips", "preparation-tips"],
    ["/resources/integration-tips", "integration-tips"],
    ["/team", "team"],
    ["/practitioners", "practitioners"],
    ["/contact", "contact"],
    ["/store", "store"],
    ["/cart", "cart"],
  ]);

  const body = document.body;

  ensureSiteFavicon();
  const pageSections = Array.from(document.querySelectorAll(".page-section"));
  const footerSections = Array.from(document.querySelectorAll("#footer-sections .page-section"));

  normalizeBodyClasses(body);
  simplifySiteChrome();
  body.classList.add("kc-minimal");

  if (path.startsWith("/profiles/")) {
    body.classList.add("kc-page-profile");
  } else if (path.startsWith("/articles/")) {
    body.classList.add("kc-page-article");
  } else if (path.startsWith("/store/p/")) {
    body.classList.add("kc-page-product");
  } else if (path.startsWith("/profiles/tag/") || path.startsWith("/profiles/category/")) {
    body.classList.add("kc-page-practitioner-filter");
  } else {
    body.classList.add(`kc-page-${pageMap.get(path) || "generic"}`);
  }

  pageSections.forEach((section, index) => {
    section.classList.add(`kc-section-${index + 1}`);
  });

  footerSections.forEach((section, index) => {
    section.classList.add(`kc-footer-section-${index + 1}`);
  });

  document.querySelectorAll(".summary-item").forEach((item) => {
    item.classList.add("kc-card");
  });

  document.querySelectorAll(".blog-item-wrapper, .product-list-item, .item-pagination-link, .form-wrapper").forEach((item) => {
    item.classList.add("kc-card");
  });

  if (body.classList.contains("kc-page-home")) {
    renderHomePage();
  }

  if (body.classList.contains("kc-page-contact")) {
    renderContactPage();
  }

  if (body.classList.contains("kc-page-about")) {
    renderAboutPage();
  }

  if (body.classList.contains("kc-page-articles")) {
    renderArticlesPage();
  }

  if (body.classList.contains("kc-page-resources")) {
    renderResourcesPage();
  }

  if (body.classList.contains("kc-page-preparation-tips")) {
    renderPreparationTipsPage();
  }

  if (body.classList.contains("kc-page-integration-tips")) {
    renderIntegrationTipsPage();
  }

  if (body.classList.contains("kc-page-team")) {
    renderTeamPage();
  }

  if (body.classList.contains("kc-page-practitioners")) {
    renderPractitionersPage();
  }

  if (body.classList.contains("kc-page-store")) {
    renderStorePage();
  }

  if (body.classList.contains("kc-page-article")) {
    renderArticleDetailPage();
  }

  if (body.classList.contains("kc-page-profile")) {
    renderProfileDetailPage();
  }

  if (body.classList.contains("kc-page-product")) {
    renderProductDetailPage();
  }

  enhanceStaticContactForms();
});

function ensureSiteFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  favicon.type = "image/x-icon";
  favicon.href = KC_FAVICON_PATH;
}

function normalizeBodyClasses(body) {
  const preserved = Array.from(body.classList).filter((className) => {
    return className.startsWith("collection-") || className === "homepage";
  });

  body.className = preserved.join(" ");
}

function simplifySiteChrome() {
  document.querySelectorAll(".header-display-mobile, .header-menu, .header-burger, .header-actions").forEach((element) => {
    element.remove();
  });

  document.querySelectorAll("header style").forEach((element) => {
    element.remove();
  });

  const header = document.querySelector("#header");
  const headerInner = document.querySelector('[data-test="header-inner"]');
  const desktopDisplay = document.querySelector(".header-display-desktop");
  const navList = desktopDisplay?.querySelector(".header-nav-list");

  if (header) {
    header.removeAttribute("style");
  }

  if (headerInner) {
    headerInner.removeAttribute("style");
  }

  if (desktopDisplay) {
    desktopDisplay.removeAttribute("style");
  }

  if (navList) {
    navList.setAttribute("aria-label", "Primary");
  }
}

function getSocialLinks() {
  return Array.from(document.querySelectorAll('a[href*="instagram.com"], a[href*="youtube.com"], a[href*="linkedin.com"]'));
}

function buildSiteShell({ currentPath, shellClass = "", mainContent }) {
  const shell = document.createElement("div");
  const pageClass = ["kc-home-shell", shellClass].filter(Boolean).join(" ");
  shell.className = pageClass;
  shell.innerHTML = `
    <header class="kc-site-header">
      <div class="kc-site-header__inner">
        <a class="kc-site-brand" href="/" aria-label="Karuna Communitas home">
          <img class="kc-site-brand__logo" src="${KC_LOGO_PATH}" alt="Karuna Communitas">
        </a>
        <nav class="kc-site-nav" aria-label="Primary">
          ${getPrimaryNavMarkup(currentPath)}
        </nav>
      </div>
    </header>
    <main class="kc-home-main">
      ${mainContent}
    </main>
    <footer class="kc-site-footer">
      <div>
        <p class="kc-eyebrow">Karuna Communitas</p>
        <p>A living network for compassionate, ethical, community-rooted transformation.</p>
      </div>
      <div class="kc-site-footer__links">
        <a href="/about">About</a>
        <a href="/practitioners">Practitioners</a>
        <a href="/resources">Resources</a>
        <a href="/articles">Articles</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="kc-site-footer__social"></div>
    </footer>
  `;

  const socialSlot = shell.querySelector(".kc-site-footer__social");
  getSocialLinks().forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = labelForSocialLink(link.href);
    socialSlot.appendChild(anchor);
  });

  if (!socialSlot.children.length) {
    socialSlot.remove();
  }

  return shell;
}

function getPrimaryNavMarkup(currentPath) {
  const items = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/team", label: "Team" },
    { href: "/practitioners", label: "Practitioners" },
    { href: "/resources", label: "Resources" },
    { href: "/articles", label: "Articles" },
    { href: "/store", label: "Store" },
    { href: "/contact", label: "Contact" },
  ];

  return items
    .map(({ href, label }) => `<a href="${href}"${href === currentPath ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");
}

function replaceWithShell(shell, rebuiltClass) {
  const header = document.querySelector("#header");
  const siteWrapper = document.querySelector("#siteWrapper");
  const sections = Array.from(document.querySelectorAll(".page-section"));
  const footer = document.querySelector("#footer-sections");

  if (!siteWrapper) {
    return;
  }

  header?.remove();
  sections.forEach((section) => section.remove());
  footer?.remove();
  siteWrapper.innerHTML = "";
  siteWrapper.appendChild(shell);
  document.body.classList.add(rebuiltClass);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTextContent(node) {
  return node?.textContent?.replace(/\s+/g, " ").trim() || "";
}

function getSectionParagraphs(section) {
  return Array.from(section.querySelectorAll(".sqs-html-content p"))
    .map((node) => getTextContent(node))
    .filter(Boolean);
}

function getSectionImage(section) {
  return section.querySelector("img")?.getAttribute("src") || section.querySelector("img")?.dataset.src || "";
}

function getPaginationData() {
  return Array.from(document.querySelectorAll(".item-pagination-link")).map((link) => ({
    href: link.getAttribute("href") || "#",
    direction: link.classList.contains("item-pagination-link--prev") ? "Previous" : "Next",
    title: getTextContent(link.querySelector(".item-pagination-title")),
  }));
}

function getBodyMarkup(scope) {
  return scope?.querySelector(".blog-item-content")?.innerHTML || "";
}

function getBodyImage(scope) {
  return scope?.querySelector(".blog-item-content img")?.getAttribute("src")
    || scope?.querySelector(".blog-item-content img")?.dataset.src
    || scope?.querySelector("img")?.getAttribute("src")
    || scope?.querySelector("img")?.dataset.src
    || "";
}

function getProfileMetaItems(scope) {
  return Array.from(scope.querySelectorAll(".blog-item-category")).map((item) => ({
    label: getTextContent(item),
    href: item.getAttribute("href") || "#",
  }));
}

function getContactIntroMarkup({ eyebrow, title, titleTag = "h2", copy }) {
  const headingMarkup = `<${titleTag}>${escapeHtml(title)}</${titleTag}>`;

  return `
    <div class="kc-home-contact__intro">
      <p class="kc-eyebrow">${escapeHtml(eyebrow)}</p>
      ${headingMarkup}
      <p>${escapeHtml(copy)}</p>
      <div class="kc-contact-notes">
        <p><strong>Email:</strong> <a class="kc-contact-email-link" href="mailto:${KC_CONTACT_EMAIL}?subject=Hello">${KC_CONTACT_EMAIL}</a></p>
      </div>
    </div>
  `;
}

function getContactSectionMarkup({ eyebrow, title, titleTag = "h2", copy, compact, pageClass = "" }) {
  const sectionClass = ["kc-home-contact", pageClass].filter(Boolean).join(" ");

  return `
    <section class="${sectionClass}">
      ${getContactIntroMarkup({ eyebrow, title, titleTag, copy })}
      <div class="kc-home-contact__form">
        ${getStaticContactFormMarkup({
          eyebrow: "Write to us",
          title: "Send a message",
          compact,
        })}
      </div>
    </section>
  `;
}

function getPageHeroMarkup({ eyebrow, title, titleTag = "h1", heroClass = "", split = false, contentMarkup = "", mediaMarkup = "" }) {
  const sectionClass = ["kc-page-hero", split ? "kc-page-hero--split" : "", heroClass].filter(Boolean).join(" ");
  const headingMarkup = `
    <p class="kc-eyebrow">${escapeHtml(eyebrow)}</p>
    <${titleTag}>${escapeHtml(title)}</${titleTag}>
    ${contentMarkup}
  `;

  if (!split && !mediaMarkup) {
    return `
      <section class="${sectionClass}">
        ${headingMarkup}
      </section>
    `;
  }

  return `
    <section class="${sectionClass}">
      <div class="kc-page-hero__content">
        ${headingMarkup}
      </div>
      <div class="kc-page-hero__media">
        ${mediaMarkup}
      </div>
    </section>
  `;
}

function getPaginationSectionMarkup(pagination) {
  if (!pagination.length) {
    return "";
  }

  return `
    <section class="kc-page-section">
      <div class="kc-pagination-grid">
        ${pagination.map((item) => `
          <a class="kc-pagination-card" href="${escapeHtml(item.href)}">
            <p class="kc-eyebrow">${escapeHtml(item.direction)}</p>
            <h2>${escapeHtml(item.title)}</h2>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHomePage() {
  if (document.querySelector(".kc-home-shell")) {
    return;
  }

  const sections = Array.from(document.querySelectorAll(".page-section"));
  const heroSection = sections[0];
  const aboutSection = sections[1];
  const contactSection = sections[2];

  if (!heroSection || !aboutSection || !contactSection) {
    return;
  }

  const heroCopy = heroSection.querySelector("p")?.textContent.trim() || "";
  const heroButton = heroSection.querySelector('a[href]:not([href="#"])');
  const aboutTitle = aboutSection.querySelector("h1, h2")?.textContent.trim() || "Who we are";
  const aboutCopy = aboutSection.querySelector("p")?.textContent.trim() || "";
  const contactTitle = contactSection.querySelector("h1, h2")?.textContent.trim() || "Contact";
  const contactCopy = contactSection.querySelector("p")?.textContent.trim() || "";

  const shell = buildSiteShell({
    currentPath: "/",
    mainContent: `
      <section class="kc-home-hero">
        <div class="kc-home-hero__content">
          <p class="kc-home-kicker">Grounded, relational, community-rooted</p>
          <h1>Compassionate pathways into psychedelic care.</h1>
          <p class="kc-home-lead">${heroCopy}</p>
          <div class="kc-home-actions">
            <a class="kc-home-button kc-home-button--solid" href="${heroButton?.getAttribute("href") || "/about"}">${heroButton?.textContent.trim() || "Learn more"}</a>
            <a class="kc-home-button" href="/contact">Get in touch</a>
          </div>
        </div>
        <aside class="kc-home-hero__panel">
          <p class="kc-eyebrow">Community-led healing</p>
          <h2>Care before, during, and after transformation.</h2>
          <p>We are building accessible, relational pathways into psychedelic education, preparation, integration, and mutual support.</p>
          <ul class="kc-leaf-list">
            <li>Compassion over performance</li>
            <li>Community over hierarchy</li>
            <li>Integration over spectacle</li>
          </ul>
        </aside>
      </section>
      <section class="kc-home-story">
        <div class="kc-home-section-heading">
          <p class="kc-eyebrow">Who we are</p>
          <h2>${aboutTitle}</h2>
          <p>${aboutCopy}</p>
        </div>
        <div class="kc-home-story__quote">
          <blockquote>Healing deepens when people are held in relationship, not processed through a funnel.</blockquote>
          <div class="kc-story-pillars">
            <div>
              <strong>Preparation</strong>
              <p>Building trust, context, and consent before any threshold is crossed.</p>
            </div>
            <div>
              <strong>Integration</strong>
              <p>Making meaning together so insight can become change in everyday life.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="kc-home-paths">
        <div class="kc-home-section-heading">
          <p class="kc-eyebrow">Explore</p>
          <h2>Ways into the community</h2>
        </div>
        <div class="kc-home-path-grid">
          <a class="kc-path-card" href="/practitioners">
            <h3>Meet practitioners</h3>
            <p>Browse therapists and guides offering grounded, integrative support.</p>
          </a>
          <a class="kc-path-card" href="/articles">
            <h3>Read articles</h3>
            <p>Explore writing on healing, community, and accessible psychedelic care.</p>
          </a>
          <a class="kc-path-card" href="/about">
            <h3>Learn the ethos</h3>
            <p>Understand the social responsibility and values shaping this network.</p>
          </a>
        </div>
      </section>
      ${getContactSectionMarkup({
        eyebrow: "Start here",
        title: contactTitle,
        copy: contactCopy,
        compact: true,
      })}
    `,
  });

  replaceWithShell(shell, "kc-home-rebuilt");
}

function renderContactPage() {
  if (document.querySelector(".kc-contact-shell")) {
    return;
  }

  const heroSection = document.querySelector(".page-section");
  if (!heroSection) {
    return;
  }

  const title = heroSection.querySelector("h1, h2")?.textContent.trim() || "Contact Us";
  const copy = heroSection.querySelector("p")?.textContent.trim() || "We would love to hear from you.";

  const shell = buildSiteShell({
    currentPath: "/contact",
    shellClass: "kc-contact-shell",
    mainContent: getContactSectionMarkup({
      eyebrow: "Contact",
      title,
      titleTag: "h1",
      copy,
      compact: false,
      pageClass: "kc-home-contact--page",
    }),
  });

  replaceWithShell(shell, "kc-contact-rebuilt");
}

function renderAboutPage() {
  const sections = Array.from(document.querySelectorAll(".page-section"));
  if (!sections.length || document.querySelector(".kc-about-shell")) {
    return;
  }

  const introSection = sections[0];
  const karunaSection = sections.find((section) => getTextContent(section.querySelector("h2")) === "Karuna");
  const communitasSection = sections.find((section) => getTextContent(section.querySelector("h2")) === "Communitas");

  const introTitle = getTextContent(introSection.querySelector("h1, h2")) || "About Karuna Communitas";
  const introParagraphs = getSectionParagraphs(introSection);
  const introImage = getSectionImage(introSection);
  const karunaParagraphs = karunaSection ? getSectionParagraphs(karunaSection) : [];
  const communitasParagraphs = communitasSection ? getSectionParagraphs(communitasSection) : [];
  const communitasCopy = communitasParagraphs.length
    ? communitasParagraphs
    : [
        "Communitas is the deep bond that can emerge when people gather with sincerity, equality, and shared intention.",
        "It names a kind of belonging that softens hierarchy and allows healing to be held in relationship rather than performance.",
      ];

  const shell = buildSiteShell({
    currentPath: "/about",
    shellClass: "kc-about-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "About",
        title: introTitle,
        split: true,
        contentMarkup: introParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
        mediaMarkup: introImage ? `<img src="${escapeHtml(introImage)}" alt="Karuna Communitas community">` : "",
      })}
      <section class="kc-page-section kc-page-section--duo">
        <article class="kc-value-card">
          <p class="kc-eyebrow">Karuna</p>
          <h2>Compassion in action</h2>
          ${karunaParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </article>
        <article class="kc-value-card">
          <p class="kc-eyebrow">Communitas</p>
          <h2>Belonging without hierarchy</h2>
          ${communitasCopy.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </article>
      </section>
      <section class="kc-page-section kc-page-section--cta">
        <div class="kc-page-section__intro">
          <p class="kc-eyebrow">Stay connected</p>
          <h2>Build with us</h2>
          <p>We are shaping a slower, more relational alternative to transactional care. If that resonates, we’d love to hear from you.</p>
        </div>
        <div class="kc-inline-actions">
          <a class="kc-home-button kc-home-button--solid" href="/contact">Contact us</a>
          <a class="kc-home-button" href="/articles">Read our writing</a>
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-about-rebuilt");
}

function renderArticlesPage() {
  if (document.querySelector(".kc-articles-shell")) {
    return;
  }

  const cards = Array.from(document.querySelectorAll("article.blog-single-column--container"))
    .map((article) => {
      const titleLink = article.querySelector(".blog-title a");
      const title = getTextContent(titleLink);
      const href = titleLink?.getAttribute("href") || "#";
      const date = getTextContent(article.querySelector(".blog-date"));
      const excerpt = Array.from(article.querySelectorAll(".blog-body-wrapper p"))
        .map((node) => getTextContent(node))
        .filter(Boolean)
        .slice(0, 2)
        .join(" ");

      if (!title) {
        return "";
      }

      return `
        <article class="kc-article-card">
          <p class="kc-article-meta">${escapeHtml(date)}</p>
          <h2><a href="${escapeHtml(href)}">${escapeHtml(title)}</a></h2>
          <p>${escapeHtml(excerpt)}</p>
          <a class="kc-text-link" href="${escapeHtml(href)}">Read article</a>
        </article>
      `;
    })
    .filter(Boolean)
    .join("");

  const shell = buildSiteShell({
    currentPath: "/articles",
    shellClass: "kc-articles-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Articles",
        title: "Writing rooted in healing, relationship, and community.",
        contentMarkup: `<p>Stories, reflections, and research-informed thoughts from the Karuna Communitas network.</p>`,
      })}
      <section class="kc-page-section">
        <div class="kc-article-grid">
          ${cards}
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-articles-rebuilt");
}

function renderResourcesPage() {
  if (document.querySelector(".kc-resources-shell")) {
    return;
  }

  const shell = buildSiteShell({
    currentPath: "/resources",
    shellClass: "kc-resources-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Resources",
        title: "Practical support for preparation and integration.",
        contentMarkup: `
          <p>Grounded guidance for approaching these experiences with care, clarity, and a strong sense of relational support.</p>
          <p>These resources are educational in nature and are not a substitute for medical advice, emergency support, or crisis care.</p>
        `,
      })}
      <section class="kc-page-section">
        <div class="kc-home-path-grid">
          <a class="kc-path-card" href="/resources/preparation-tips">
            <h2>Preparation Tips</h2>
            <p>Support for intention-setting, practical planning, emotional honesty, and creating the conditions for safety.</p>
          </a>
          <a class="kc-path-card" href="/resources/integration-tips">
            <h2>Integration Tips</h2>
            <p>Support for reflection, pacing, embodiment, and turning insight into meaningful change in everyday life.</p>
          </a>
        </div>
      </section>
      <section class="kc-page-section">
        <div class="kc-page-section__intro">
          <p class="kc-eyebrow">Support</p>
          <h2>Looking for personal support?</h2>
          <p>If you would like one-to-one preparation or integration support, you can explore practitioners in the wider Karuna Communitas network.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button kc-home-button--solid" href="/practitioners">Find a practitioner</a>
          </div>
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-resources-rebuilt");
}

function renderPreparationTipsPage() {
  if (document.querySelector(".kc-preparation-shell")) {
    return;
  }

  const shell = buildSiteShell({
    currentPath: "/resources",
    shellClass: "kc-preparation-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Resources",
        title: "Preparation Tips",
        contentMarkup: `
          <p>Creating the conditions for safety, clarity, and intention before an experience can be just as important as the experience itself.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button" href="/resources">Back to resources</a>
          </div>
        `,
      })}
      <section class="kc-page-section">
        <article class="kc-rich-copy">
          <p>Preparation is not only practical. It is also emotional, relational, and reflective. The aim is not to control what happens, but to approach the experience with care, honesty, and enough support around you.</p>
          <h2>Cultivate stillness</h2>
          <p>Meditation and breathwork can help you stay present and connected to your senses rather than getting lost in mental chatter. Even a simple daily practice of slowing down, noticing the breath, and returning attention to the body can make it easier to meet the experience with steadiness.</p>
          <h2>Prepare in relationship, not only alone</h2>
          <p>If the work is happening in a group context, it can be helpful for the group to meet online beforehand and practise embodied listening together. This can build familiarity, self-awareness, and empathy within the wider community container before meeting in person.</p>
          <h2>Be mindful of what enters your consciousness</h2>
          <p>In the lead-up to an experience, it can help to reduce the amount of overstimulating, stressful, or violent material you take in. A gentle digital detox, stepping back from doom-scrolling, and choosing activities that promote openness rather than stress can all support a more grounded state of mind.</p>
          <h2>Clarify your intention</h2>
          <p>Ask yourself why you are approaching this experience now. You may be hoping to understand a pattern, reconnect with yourself, process something difficult, or simply enter the experience with more openness and care. A clear intention can help you feel anchored without turning the experience into a test you have to pass.</p>
          <h2>Hold intention and expectation in balance</h2>
          <p>We can have the loveliest intentions in the world, but if we expect them to unfold in a very specific way or within a specific timeframe, disappointment can quickly follow. Sometimes what we long for does happen, just not in the form we imagined. Holding intention a little more loosely can support the process and leave room for the experience to unfold in its own way.</p>
          <h2>Be honest about your current state</h2>
          <p>Take stock of how you have been recently. Stress, exhaustion, emotional instability, major life disruption, or limited support can all affect how prepared you feel. Honesty here is not about judging yourself. It is about noticing what kind of support, pacing, or postponement might actually be wise.</p>
          <h2>Consider set and setting</h2>
          <p>Preparation includes the inner and outer environment. Your mindset, the physical setting, the people around you, and the degree of trust and safety available all matter. If the wider context feels pressured, chaotic, or unsafe, that is important information.</p>
          <h2>Practice positive self-talk and self-compassion</h2>
          <p>It can be helpful to notice self-critical parts with warmth rather than judgment. Some people find the Internal Family Systems model useful here, especially for understanding how protective parts may once have served a purpose but no longer need to lead. This <a href="https://www.youtube.com/watch?v=6MesvXKa8Rg">IFS introduction video</a> may be a supportive starting point.</p>
          <h2>Practise feeling emotions in the body</h2>
          <p>Before a journey, it can be useful to build familiarity with how emotions actually show up in your body. Practices such as Felt Sense work or <a href="https://www.tarabrach.com/rain/">RAIN meditation</a> can help. You might gently bring a challenging emotion to mind and ask: what does this feel like, and where do I notice it in the body? Try greeting it with curiosity rather than resistance. Framing it as “something in me feels...” can create a little space around the emotion. You might notice whether it has a shape, colour, temperature, or movement, and then offer it some warmth and compassion. Often, the relationship to the feeling begins to shift.</p>
          <h2>Plan your support</h2>
          <p>Think ahead about who you can speak to before and after the experience. This might be a trusted friend, therapist, integration practitioner, or other grounded support person. Knowing you will not be left alone with what emerges can make a real difference.</p>
          <h2>Create a dedicated space</h2>
          <p>Some people find it meaningful to create a small altar or dedicated space at home with objects of personal significance, such as photos of loved ones, meaningful symbols, or items from nature. This can become a simple physical expression of your intention and a place to return to before or after the experience.</p>
          <h2>Connect with nature</h2>
          <p>Nature can be a powerful support for preparation. Mindful walking, forest bathing, or even a flower bath made with leaves and flowers gathered from your garden or local area can help you slow down and feel more connected. If helpful, you could explore this <a href="https://www.nationaltrust.org.uk/discover/nature/trees-plants/a-beginners-guide-to-forest-bathing">beginner’s guide to forest bathing</a> or this piece on <a href="https://thatflowerfeeling.org/flower-baths-a-luxurious-self-care-ritual-you-need-to-try/">flower baths as a self-care ritual</a>.</p>
          <h2>Use breathwork to cultivate openness</h2>
          <p>Practising breathing techniques in the run-up to a journey can help create a calmer, more open frame of mind. Some people find equal breathing especially helpful for centring themselves, while others benefit from a slow, focused exhale to release tension and soften the body.</p>
          <h2>Learn from manageable discomfort</h2>
          <p>Practices such as cold water immersion can help some people prepare by building familiarity with intensity and teaching the body that discomfort can be met without panic. This is less about pushing yourself and more about learning how to stay present and steady when things feel challenging.</p>
          <h2>Keep a preparation journal</h2>
          <p>A dedicated notebook for the period leading up to a ceremony can help you notice patterns, questions, hopes, and feelings as they arise. The same journal can then support integration afterwards, helping you make sense of insights and return to them over the coming months or even years.</p>
          <h2>Spend time with people who nourish you</h2>
          <p>Leading up to an experience, prioritise time with people who help you feel happy, supported, and energised. Where possible, reduce time around dynamics that leave you feeling drained, conflicted, or emotionally contracted.</p>
          <h2>Stay close to integrity</h2>
          <p>Preparation can also include the relational and ethical tone of everyday life. Honest communication, openness, and stepping back from behaviours that pull you out of integrity, such as dishonesty or gossip, can help create a stronger sense of inner alignment.</p>
          <h2>Reduce unnecessary pressure</h2>
          <p>It can help to soften expectations of breakthrough, certainty, or transformation. Preparation is often stronger when it is rooted in curiosity rather than performance. You do not need to force a life-changing outcome for the experience to be meaningful.</p>
          <h2>Support the body through food and rhythm</h2>
          <p>It can be wise to consider contraindications and to eat in a way that leaves you feeling clear, steady, and well-resourced before taking the medicine. Emerging research also suggests that gut health may play a meaningful role in how people respond to psychedelic experiences, so a healthy diet may support the wider process.</p>
          <h2>Reduce overstimulation</h2>
          <p>Some people find it helpful to bring more restraint to the period before a journey, including around sexual activity, heavy media consumption, and highly stimulating social interactions. The intention is not moral purity, but creating more internal quiet and coherence.</p>
          <h2>Immediately prior to the ceremony</h2>
          <p>Some participants find it helpful to gently move the body and settle the nervous system just before the ceremony begins. Breathwork, chanting, or simple meditative movement practices such as qigong can help ease the transition into stillness before lying down.</p>
          <h2>Bring gratitude into the ceremony</h2>
          <p>It can be meaningful to reflect beforehand on what, and who, you may want to offer gratitude to before the ceremony begins. Some people like to weave this into the space through a short poem, a few spoken words, or a simple private reflection. Gratitude can help soften the heart and clarify the relational spirit in which the journey is being approached.</p>
          <h2>Make space for conversations about ancestors</h2>
          <p>Many journeys involve a sense of connection with ancestors or loved ones who have died. Speaking about this beforehand can be helpful, especially for someone who has never journeyed before and may find the idea unfamiliar or strange. Naming the possibility can reduce shock and support a sense of openness if this kind of material arises.</p>
          <h2>Remember that the medicine may not feel random</h2>
          <p>Nervous participants sometimes find it calming to consider that the medicine has a kind of benign agency and may work in relationship with the preconscious or unconscious mind in ways that are ultimately in their best interests. That does not mean every moment feels easy, but it can help people stay in relationship with challenging material rather than feeling immediately threatened by it.</p>
          <h2>Screen physical and mental health carefully</h2>
          <p>Preparation should include thoughtful screening of both physical and psychological health. This may include blood pressure concerns, epilepsy, injuries, medications, or other physical issues that need to be managed, as well as trauma history, suicidality, psychosis, personality disorder, or other factors that may increase risk. A participant should have a reasonably stable level of day-to-day functioning before proceeding.</p>
          <h2>Check possible medicine interactions</h2>
          <p>It is important to review possible interactions between any medicine being used and existing medications or substances. A drug interaction checker such as Medscape may be a useful starting point, and where appropriate this should be discussed with a suitably qualified medical professional rather than guessed.</p>
          <h2>Prepare practically</h2>
          <p>Attend to sleep, food, hydration, transport, comfort, and the time you will need afterwards. Practical details are easy to dismiss, but they often shape how supported and resourced you feel. Leaving space after the experience is part of the preparation, not an optional extra.</p>
          <h2>Know your boundaries</h2>
          <p>Preparation also includes recognising when something does not feel right. If you feel pressured, unsure, unwell, or unsupported, it may be better to pause and seek advice. Respecting your limits is part of creating safety.</p>
          <h2>Discuss touch and consent clearly</h2>
          <p>If touch may be part of the holding process, it is important to discuss consent explicitly beforehand. Clear pre-consent, including around the gender of the space holder where relevant, can reduce harm, protect both participant and space holder, and help create a safer container for the work.</p>
          <p>Careful preparation is not separate from the journey. It is part of the work itself.</p>
        </article>
      </section>
      <section class="kc-page-section">
        <div class="kc-page-section__intro">
          <p class="kc-eyebrow">Next</p>
          <h2>When the experience is over, integration begins.</h2>
          <p>Making meaning from what happened often takes time, gentleness, and support.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button kc-home-button--solid" href="/resources/integration-tips">Explore integration tips</a>
            <a class="kc-home-button" href="/practitioners">Find a practitioner</a>
          </div>
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-preparation-rebuilt");
}

function renderIntegrationTipsPage() {
  if (document.querySelector(".kc-integration-shell")) {
    return;
  }

  const shell = buildSiteShell({
    currentPath: "/resources",
    shellClass: "kc-integration-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Resources",
        title: "Integration Tips",
        contentMarkup: `
          <p>Integration is the process of making space for reflection, meaning, and grounded next steps after an experience.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button" href="/resources">Back to resources</a>
          </div>
        `,
      })}
      <section class="kc-page-section">
        <article class="kc-rich-copy">
          <p>Integration does not need to be rushed. Sometimes the most helpful thing is to create enough spaciousness for meaning to unfold gradually, rather than trying to pin everything down too quickly.</p>
          <h2>Give yourself time</h2>
          <p>If possible, reduce stimulation and allow some time for rest. Gentle pacing can help you notice what remains meaningful after the intensity has passed. Not every insight needs to become action immediately.</p>
          <h2>Record what feels important</h2>
          <p>Journalling, voice notes, drawing, or writing down a few phrases can help preserve what feels alive before it becomes harder to recall. You do not need to capture everything. A few honest fragments are often enough.</p>
          <h2>Stay curious, not forceful</h2>
          <p>Some experiences feel clear straight away. Others take longer to understand. It can help to stay close to the questions that emerged without demanding instant certainty. Meaning often develops in layers.</p>
          <h2>Talk to someone you trust</h2>
          <p>Sharing with a trusted friend, therapist, or integration practitioner can help you feel less alone and can support you in making sense of what stands out. Relational reflection is often part of how integration deepens.</p>
          <h2>Support the body as well as the mind</h2>
          <p>Sleep, nourishing food, walking, breath, movement, and steady routines can all help with integration. The nervous system may need as much care as the thinking mind. Gentle embodiment practices can be especially supportive.</p>
          <h2>Look for one small next step</h2>
          <p>Rather than trying to transform everything at once, ask what one grounded change might look like. This could be a conversation, a boundary, a new practice, or a small shift in how you care for yourself day to day.</p>
          <h2>Be gentle with intensity</h2>
          <p>Difficult or tender material can continue to surface afterwards. If the experience leaves you feeling disoriented or emotionally raw, that does not mean you have done anything wrong. It may simply mean more support, rest, or containment is needed.</p>
          <h2>Know when extra help is needed</h2>
          <p>If distress feels persistent, if your ability to function drops significantly, or if there are concerns about your safety, it is important to seek appropriate professional or emergency support. Reaching out is part of care, not a failure of integration.</p>
          <p>Integration is often less about finding the perfect interpretation and more about building a relationship with what you learned.</p>
        </article>
      </section>
      <section class="kc-page-section">
        <div class="kc-page-section__intro">
          <p class="kc-eyebrow">Support</p>
          <h2>You do not have to make sense of everything alone.</h2>
          <p>If you are looking for grounded one-to-one support, the Karuna Communitas practitioner network may be a good next step.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button kc-home-button--solid" href="/practitioners">Find a practitioner</a>
          </div>
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-integration-rebuilt");
}

function renderTeamPage() {
  if (document.querySelector(".kc-team-shell")) {
    return;
  }

  const introSection = document.querySelector(".page-section");
  const title = getTextContent(introSection?.querySelector("h1")) || "Meet the Directors";
  const introCopy = getSectionParagraphs(introSection)[0] || "Behind everything we do is a team of people who truly care.";
  const members = Array.from(document.querySelectorAll(".page-section h2"))
    .map((heading) => {
      const name = getTextContent(heading);
      if (!name || name === "Karuna Communitas") {
        return null;
      }

      const section = heading.closest(".page-section");
      const image = getSectionImage(section);
      const paragraphs = getSectionParagraphs(section);
      const bio = paragraphs.join(" ");
      const bioSentences = bio.split(/(?<=[.!?])\s+/).filter(Boolean);
      const summary = bioSentences.slice(0, 3).join(" ");

      return {
        name,
        image,
        bio: summary || bio,
      };
    })
    .filter((member, index, array) => member && array.findIndex((entry) => entry.name === member.name) === index);

  const shell = buildSiteShell({
    currentPath: "/team",
    shellClass: "kc-team-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Team",
        title,
        contentMarkup: `<p>${escapeHtml(introCopy)}</p>`,
      })}
      <section class="kc-page-section">
        <div class="kc-profile-grid">
          ${members
            .map(
              (member) => `
                <article class="kc-profile-card">
                  ${member.image ? `<img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}">` : ""}
                  <div class="kc-profile-card__body">
                    <h2>${escapeHtml(member.name)}</h2>
                    <p>${escapeHtml(member.bio)}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-team-rebuilt");
}

function renderPractitionersPage() {
  if (document.querySelector(".kc-practitioners-shell")) {
    return;
  }

  const introSection = document.querySelector(".page-section");
  const title = getTextContent(introSection?.querySelector("h1")) || "Preparation and Integration Practitioners";
  const paragraphs = getSectionParagraphs(introSection);
  const cards = Array.from(document.querySelectorAll(".summary-item"))
    .map((item) => {
      const titleLink = item.querySelector(".summary-title-link");
      const name = getTextContent(titleLink);
      const href = titleLink?.getAttribute("href") || "#";
      const role = getTextContent(item.querySelector(".summary-excerpt"));
      const image = item.querySelector("img")?.getAttribute("src") || item.querySelector("img")?.dataset.src || "";

      if (!name) {
        return "";
      }

      return `
        <article class="kc-practitioner-card">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(name)}">` : ""}
          <div class="kc-practitioner-card__body">
            <h2>${escapeHtml(name)}</h2>
            <p>${escapeHtml(role)}</p>
            <a class="kc-text-link" href="${escapeHtml(href)}">View profile</a>
          </div>
        </article>
      `;
    })
    .filter(Boolean)
    .join("");

  const shell = buildSiteShell({
    currentPath: "/practitioners",
    shellClass: "kc-practitioners-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Practitioners",
        title: title.replace("Practioners", "Practitioners"),
        contentMarkup: paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
      })}
      <section class="kc-page-section">
        <div class="kc-practitioner-grid">
          ${cards}
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-practitioners-rebuilt");
}

function renderStorePage() {
  if (document.querySelector(".kc-store-shell")) {
    return;
  }

  const products = Array.from(document.querySelectorAll(".product-list-item"))
    .map((item) => {
      const link = item.querySelector(".product-list-item-link");
      const title = getTextContent(item.querySelector(".product-list-item-title"));
      const price = getTextContent(item.querySelector(".product-list-item-price"));
      const image = item.querySelector("img")?.getAttribute("src") || item.querySelector("img")?.dataset.src || "";
      const href = link?.getAttribute("href") || "#";

      if (!title) {
        return "";
      }

      return `
        <article class="kc-store-card">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">` : ""}
          <div class="kc-store-card__body">
            <p class="kc-eyebrow">Store</p>
            <h2>${escapeHtml(title)}</h2>
            <p class="kc-store-price">${escapeHtml(price)}</p>
            <a class="kc-home-button kc-home-button--solid" href="${escapeHtml(href)}">View product</a>
          </div>
        </article>
      `;
    })
    .filter(Boolean)
    .join("");

  const shell = buildSiteShell({
    currentPath: "/store",
    shellClass: "kc-store-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Store",
        title: "Small offerings that help support the wider work.",
        contentMarkup: `<p>Merch and simple goods that extend the spirit of Karuna Communitas without feeling like a corporate storefront.</p>`,
      })}
      <section class="kc-page-section">
        <div class="kc-store-grid">
          ${products}
        </div>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-store-rebuilt");
}

function renderArticleDetailPage() {
  if (document.querySelector(".kc-article-detail-shell")) {
    return;
  }

  const wrapper = document.querySelector(".blog-item-wrapper");
  if (!wrapper) {
    return;
  }

  const title = getTextContent(wrapper.querySelector(".entry-title")) || "Article";
  const date = getTextContent(wrapper.querySelector(".blog-meta-item--date"));
  const bodyMarkup = getBodyMarkup(wrapper);
  const heroImage = getBodyImage(wrapper);
  const pagination = getPaginationData();

  const shell = buildSiteShell({
    currentPath: "/articles",
    shellClass: "kc-article-detail-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Article",
        title,
        heroClass: "kc-detail-hero",
        split: true,
        contentMarkup: `
          <p class="kc-detail-meta">${escapeHtml(date)}</p>
          <p>Long-form reflections from the Karuna Communitas network on healing, communitas, and grounded psychedelic care.</p>
        `,
        mediaMarkup: heroImage ? `<img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title)}">` : "",
      })}
      <section class="kc-page-section kc-detail-content">
        <article class="kc-rich-copy">
          ${bodyMarkup}
        </article>
      </section>
      ${getPaginationSectionMarkup(pagination)}
    `,
  });

  replaceWithShell(shell, "kc-article-detail-rebuilt");
}

function renderProfileDetailPage() {
  if (document.querySelector(".kc-profile-detail-shell")) {
    return;
  }

  const wrapper = document.querySelector(".blog-item-wrapper");
  if (!wrapper) {
    return;
  }

  const title = getTextContent(wrapper.querySelector(".entry-title")) || "Practitioner";
  const metaItems = getProfileMetaItems(wrapper);
  const heroImage = getBodyImage(wrapper);
  const bodyMarkup = getBodyMarkup(wrapper);
  const pagination = getPaginationData();

  const shell = buildSiteShell({
    currentPath: "/practitioners",
    shellClass: "kc-profile-detail-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Practitioner Profile",
        title,
        heroClass: "kc-detail-hero kc-detail-hero--profile",
        split: true,
        contentMarkup: `
          ${metaItems.length ? `
            <div class="kc-chip-row">
              ${metaItems.map((item) => `<a class="kc-chip" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("")}
            </div>
          ` : ""}
          <p>Grounded, relational support for preparation, integration, and ongoing therapeutic care.</p>
        `,
        mediaMarkup: heroImage ? `<img src="${escapeHtml(heroImage)}" alt="${escapeHtml(title)}">` : "",
      })}
      <section class="kc-page-section kc-detail-content">
        <article class="kc-rich-copy kc-rich-copy--profile">
          ${bodyMarkup}
        </article>
      </section>
      ${getPaginationSectionMarkup(pagination)}
    `,
  });

  replaceWithShell(shell, "kc-profile-detail-rebuilt");
}

function renderProductDetailPage() {
  if (document.querySelector(".kc-product-detail-shell")) {
    return;
  }

  const title = getTextContent(document.querySelector(".ProductItem-details-title, .product-detail .product-title, .pdp-title, h1"))
    || "Enlightened Toad T-shirt";
  const price = getTextContent(document.querySelector(".product-price, .ProductItem-details-price, .sqs-money-native"))
    || "£25.00";
  const descriptionMarkup = document.querySelector(".ProductItem-details-excerpt")
    ?.innerHTML
    || document.querySelector(".product-detail .product-description, .pdp-details")
      ?.innerHTML
    || `
      <p>A Gildan Softstyle adult t-shirt featuring the Karuna Communitas enlightened toad design.</p>
      <p>These shirts are printed to order and may take a few weeks to arrive depending on when the order was processed.</p>
      <p>Available sizes include S, M, L, XL, and XXL in both black and white.</p>
    `;
  const image = document.querySelector(".product-detail img, .ProductItem-gallery-slides-item img, .pdp-images img, .product-images img")?.getAttribute("src")
    || document.querySelector(".product-detail img, .ProductItem-gallery-slides-item img, .pdp-images img, .product-images img")?.dataset.src
    || document.querySelector("img")?.getAttribute("src")
    || document.querySelector("img")?.dataset.src
    || "/assets/images/localized/5bc9fa74eb-enightened-toad.jpg";

  const shell = buildSiteShell({
    currentPath: "/store",
    shellClass: "kc-product-detail-shell",
    mainContent: `
      ${getPageHeroMarkup({
        eyebrow: "Store",
        title,
        heroClass: "kc-detail-hero",
        split: true,
        contentMarkup: `
          <p class="kc-store-price">${escapeHtml(price)}</p>
          <p>This GitHub Pages version keeps the product information visible in a simple static format.</p>
          <div class="kc-inline-actions">
            <a class="kc-home-button kc-home-button--solid" href="/contact">Enquire about this item</a>
            <a class="kc-home-button" href="/store">Back to store</a>
          </div>
        `,
        mediaMarkup: image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}">` : "",
      })}
      <section class="kc-page-section kc-detail-content">
        <article class="kc-rich-copy">
          ${descriptionMarkup || "<p>Product details coming soon.</p>"}
        </article>
      </section>
    `,
  });

  replaceWithShell(shell, "kc-product-detail-rebuilt");
}

function getStaticContactFormMarkup({ eyebrow, title, compact }) {
  return `
    <div class="kc-form-shell${compact ? " kc-form-shell--compact" : ""}">
      <p class="kc-eyebrow">${eyebrow}</p>
      <h3>${title}</h3>
      <form class="kc-static-contact-form" action="${KC_CONTACT_ENDPOINT}" method="POST" data-success-url="${KC_CONTACT_SUCCESS_PATH}">
        <input type="hidden" name="_subject" value="New enquiry from Karuna Communitas">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_next" value="${KC_CONTACT_SUCCESS_PATH}">
        <input type="text" name="_honey" class="kc-honeypot" tabindex="-1" autocomplete="off">
        <div class="kc-field-grid${compact ? " kc-field-grid--compact" : ""}">
          <label class="kc-field">
            <span>Name</span>
            <input type="text" name="name" autocomplete="name" required>
          </label>
          <label class="kc-field">
            <span>Email</span>
            <input type="email" name="email" autocomplete="email" required>
          </label>
        </div>
        <label class="kc-field">
          <span>Message</span>
          <textarea name="message" rows="${compact ? "5" : "7"}" required></textarea>
        </label>
        <div class="kc-form-actions">
          <button type="submit" class="kc-home-button kc-home-button--solid">
            <span class="kc-submit-label">Send message</span>
          </button>
          <p class="kc-form-meta">Delivered to <a class="kc-contact-email-link" href="mailto:${KC_CONTACT_EMAIL}?subject=Hello">${KC_CONTACT_EMAIL}</a></p>
        </div>
        <p class="kc-form-status" aria-live="polite"></p>
      </form>
    </div>
  `;
}

function enhanceStaticContactForms() {
  document.querySelectorAll(".kc-static-contact-form").forEach((form) => {
    if (form.dataset.enhanced === "true") {
      return;
    }

    form.dataset.enhanced = "true";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const submitLabel = form.querySelector(".kc-submit-label");
      const status = form.querySelector(".kc-form-status");
      const successUrl = new URL(form.dataset.successUrl || KC_CONTACT_SUCCESS_PATH, window.location.origin).toString();
      const formData = new FormData(form);

      formData.set("_next", successUrl);

      if (submitButton) {
        submitButton.disabled = true;
      }

      if (submitLabel) {
        submitLabel.textContent = "Sending...";
      }

      if (status) {
        status.textContent = "Sending your message...";
        status.dataset.state = "pending";
      }

      try {
        const response = await fetch(KC_CONTACT_AJAX_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        window.location.href = successUrl;
      } catch (error) {
        if (status) {
          status.textContent = "Something went wrong online. We are opening the direct form submission flow instead.";
          status.dataset.state = "error";
        }

        HTMLFormElement.prototype.submit.call(form);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }

        if (submitLabel) {
          submitLabel.textContent = "Send message";
        }
      }
    });
  });
}

function labelForSocialLink(href) {
  if (href.includes("instagram")) {
    return "Instagram";
  }

  if (href.includes("youtube")) {
    return "YouTube";
  }

  if (href.includes("linkedin")) {
    return "LinkedIn";
  }

  return "Social";
}
