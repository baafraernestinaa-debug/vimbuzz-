/* =========================================================
   VIMBUZZ V2 — COMPLETE SCRIPT.JS
   No backend • No database • No login
   Uses LocalStorage
   ========================================================= */

"use strict";

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "vimbuzz_articles_v2";
const SUBSCRIBER_KEY = "vimbuzz_subscribers_v2";

let articles = [];
let currentArticleId = null;


/* =========================================================
   SAMPLE ARTICLES
   ========================================================= */

const defaultArticles = [
  {
    id: "vb-001",
    title: "Ghana's Digital Future: How Technology Is Changing Everyday Life",
    category: "Technology",
    author: "VimBuzz",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Technology continues to transform how Ghanaians work, communicate, learn and do business.",
    content:
      "Technology is becoming an important part of everyday life in Ghana.\n\nFrom mobile money and online businesses to digital education and artificial intelligence, more people are using technology to solve everyday problems.\n\nThe growth of digital services is also creating opportunities for young entrepreneurs and creators.",
    featured: true,
    trending: true,
    views: 1280,
    date: "2026-09-09T09:00:00"
  },

  {
    id: "vb-002",
    title: "Ghana Football: Fans Prepare for Another Exciting Weekend",
    category: "Sports",
    author: "VimBuzz Sports",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Football fans across Ghana are getting ready for another weekend of exciting matches.",
    content:
      "Football remains one of Ghana's biggest passions.\n\nFans are preparing for another exciting weekend as clubs compete for important points.\n\nSupporters are expected to fill stadiums and follow the action from home.",
    featured: false,
    trending: true,
    views: 980,
    date: "2026-09-08T15:00:00"
  },

  {
    id: "vb-003",
    title: "Ghanaian Entertainment Continues to Make Waves",
    category: "Entertainment",
    author: "VimBuzz",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Music, film and social media creators continue to influence Ghana's entertainment scene.",
    content:
      "Ghana's entertainment industry continues to grow.\n\nArtists, actors and digital creators are finding new ways to connect with audiences locally and internationally.\n\nSocial media has become an important platform for discovering new talent.",
    featured: false,
    trending: true,
    views: 870,
    date: "2026-09-08T11:00:00"
  },

  {
    id: "vb-004",
    title: "Simple Lifestyle Habits That Can Improve Your Day",
    category: "Lifestyle",
    author: "VimBuzz Lifestyle",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Small daily habits can help improve productivity, organization and overall wellbeing.",
    content:
      "Building simple habits can make everyday life easier.\n\nPlanning your day, getting enough rest, staying organized and making time for learning are simple steps that can have a positive impact.\n\nConsistency is often more important than trying to change everything at once.",
    featured: false,
    trending: false,
    views: 640,
    date: "2026-09-07T14:00:00"
  },

  {
    id: "vb-005",
    title: "Business Opportunities for Young Entrepreneurs in Ghana",
    category: "News",
    author: "VimBuzz Business",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Young entrepreneurs are exploring new opportunities through digital businesses and local services.",
    content:
      "Entrepreneurship continues to attract young people across Ghana.\n\nOnline stores, digital services, content creation and local service businesses are among the areas receiving attention.\n\nThe internet has lowered the barrier to starting many small businesses.",
    featured: false,
    trending: false,
    views: 520,
    date: "2026-09-07T09:30:00"
  },

  {
    id: "vb-006",
    title: "The Rise of Online Learning in Ghana",
    category: "News",
    author: "VimBuzz",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "More learners are turning to online platforms to develop academic and professional skills.",
    content:
      "Online learning gives students and professionals access to educational resources from almost anywhere.\n\nCourses covering technology, business, languages and creative skills are becoming increasingly accessible.",
    featured: false,
    trending: false,
    views: 450,
    date: "2026-09-06T13:00:00"
  }
];


/* =========================================================
   DOM
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadArticles();
  setupNavigation();
  setupSearch();
  setupEditor();
  setupModal();
  setupNewsletter();
  setupScrollTop();
  setupCategoryButtons();
  setupGlobalEvents();
  renderAll();
  updateYear();
});


/* =========================================================
   LOAD / SAVE ARTICLES
   ========================================================= */

function loadArticles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        articles = parsed;
        return;
      }
    }
  } catch (error) {
    console.error("Could not load articles:", error);
  }

  articles = [...defaultArticles];
  saveArticles();
}


function saveArticles() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(articles)
    );
  } catch (error) {
    console.error("Could not save articles:", error);
    showToast("Storage is full. Try deleting some articles.");
  }
}


/* =========================================================
   HELPERS
   ========================================================= */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


function formatViews(views) {
  const number = Number(views) || 0;

  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }

  return number.toString();
}


function getArticle(id) {
  return articles.find((article) => article.id === id);
}


function sortNewest(list) {
  return [...list].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}


function fallbackImage() {
  return "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderAll() {
  renderHero();
  renderLatest();
  renderMostRead();
  renderCategory("Sports", "sportsArticles");
  renderCategory("Entertainment", "entertainmentArticles");
  renderCategory("Technology", "technologyArticles");
  renderCategory("Lifestyle", "lifestyleArticles");
  renderTrending();
  renderAdminArticles();
  updateArticleCount();
}


/* =========================================================
   HERO
   ========================================================= */

function renderHero() {
  const container = $("#heroGrid");

  if (!container) return;

  let featured = articles.filter(
    (article) => article.featured
  );

  featured = sortNewest(featured);

  if (!featured.length) {
    featured = sortNewest(articles);
  }

  const heroArticles = featured.slice(0, 3);

  if (!heroArticles.length) {
    container.innerHTML = `
      <div class="hero-main">
        <div class="hero-content">
          <h1>No articles yet</h1>
        </div>
      </div>
    `;
    return;
  }

  const main = heroArticles[0];

  const side = heroArticles.slice(1, 3);

  container.innerHTML = `
    <article
      class="hero-main"
      data-article-id="${escapeHTML(main.id)}"
    >
      <img
        src="${escapeHTML(main.image || fallbackImage())}"
        alt="${escapeHTML(main.title)}"
        onerror="this.src='${fallbackImage()}'"
      >

      <div class="hero-overlay"></div>

      <div class="hero-content">

        <div class="article-meta">
          <span class="category-tag">
            ${escapeHTML(main.category)}
          </span>

          <span>
            ${formatDate(main.date)}
          </span>
        </div>

        <h1>
          ${escapeHTML(main.title)}
        </h1>

      </div>
    </article>

    <div class="hero-side">

      ${side
        .map(
          (article) => `
          <article
            class="hero-side-card"
            data-article-id="${escapeHTML(article.id)}"
          >

            <img
              src="${escapeHTML(article.image || fallbackImage())}"
              alt="${escapeHTML(article.title)}"
              onerror="this.src='${fallbackImage()}'"
            >

            <div class="hero-overlay"></div>

            <div class="hero-content">

              <div class="article-meta">
                <span class="category-tag">
                  ${escapeHTML(article.category)}
                </span>
              </div>

              <h2>
                ${escapeHTML(article.title)}
              </h2>

            </div>

          </article>
        `
        )
        .join("")}

    </div>
  `;
}


/* =========================================================
   LATEST ARTICLES
   ========================================================= */

function renderLatest() {
  const container = $("#latestArticles");

  if (!container) return;

  const latest = sortNewest(articles).slice(0, 8);

  container.innerHTML = latest.length
    ? latest.map(articleCard).join("")
    : emptyState("No articles available.");
}


/* =========================================================
   CATEGORY
   ========================================================= */

function renderCategory(category, elementId) {
  const container = document.getElementById(elementId);

  if (!container) return;

  const categoryArticles = sortNewest(
    articles.filter(
      (article) => article.category === category
    )
  ).slice(0, 4);

  container.innerHTML = categoryArticles.length
    ? categoryArticles.map(articleCard).join("")
    : emptyState(`No ${category} articles yet.`);
}


/* =========================================================
   ARTICLE CARD
   ========================================================= */

function articleCard(article) {
  return `
    <article
      class="article-card"
      data-article-id="${escapeHTML(article.id)}"
    >

      <div class="article-image">

        <img
          src="${escapeHTML(article.image || fallbackImage())}"
          alt="${escapeHTML(article.title)}"
          loading="lazy"
          onerror="this.src='${fallbackImage()}'"
        >

      </div>

      <div class="article-card-content">

        <div class="article-meta">

          <span class="category-tag">
            ${escapeHTML(article.category)}
          </span>

          <span>
            ${formatDate(article.date)}
          </span>

        </div>

        <h3>
          ${escapeHTML(article.title)}
        </h3>

        <p class="article-excerpt">
          ${escapeHTML(article.excerpt)}
        </p>

        <div class="card-footer">

          <span>
            By ${escapeHTML(article.author || "VimBuzz")}
          </span>

          <span>
            👁 ${formatViews(article.views)}
          </span>

        </div>

      </div>

    </article>
  `;
}


function emptyState(message) {
  return `
    <div style="
      grid-column: 1 / -1;
      padding: 30px;
      text-align: center;
      color: #6b7280;
      background: #fff;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    ">
      ${escapeHTML(message)}
    </div>
  `;
}


/* =========================================================
   MOST READ
   ========================================================= */

function renderMostRead() {
  const container = $("#mostRead");

  if (!container) return;

  const mostRead = [...articles]
    .sort(
      (a, b) =>
        (Number(b.views) || 0) -
        (Number(a.views) || 0)
    )
    .slice(0, 6);

  container.innerHTML = mostRead.length
    ? mostRead
        .map(
          (article, index) => `
          <article
            class="most-read-item"
            data-article-id="${escapeHTML(article.id)}"
          >

            <div class="most-read-number">
              ${String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <h3>
                ${escapeHTML(article.title)}
              </h3>

              <small>
                ${formatViews(article.views)} views
                • ${escapeHTML(article.category)}
              </small>
            </div>

          </article>
        `
        )
        .join("")
    : emptyState("No articles available.");
}


/* =========================================================
   TRENDING
   ========================================================= */

function renderTrending() {
  const container = $("#trendingList");

  if (!container) return;

  let trending = articles.filter(
    (article) => article.trending
  );

  trending = sortNewest(trending).slice(0, 8);

  if (!trending.length) {
    trending = sortNewest(articles).slice(0, 5);
  }

  container.innerHTML = trending
    .map(
      (article) => `
      <a
        href="#"
        data-article-id="${escapeHTML(article.id)}"
      >
        ${escapeHTML(article.title)}
      </a>
    `
    )
    .join("");
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {
  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");

      menuToggle.textContent =
        mobileNav.classList.contains("open")
          ? "✕"
          : "☰";
    });
  }

  $$("#mobileNav a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav?.classList.remove("open");

      if (menuToggle) {
        menuToggle.textContent = "☰";
      }
    });
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      $$(".nav-link").forEach((item) =>
        item.classList.remove("active")
      );

      link.classList.add("active");
    });
  });
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {
  const searchToggle = $("#searchToggle");
  const searchBox = $("#searchBox");
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  const clearSearch = $("#clearSearch");

  searchToggle?.addEventListener("click", () => {
    searchBox?.classList.toggle("open");

    if (searchBox?.classList.contains("open")) {
      setTimeout(() => searchInput?.focus(), 100);
    }
  });

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      showToast("Enter something to search.");
      return;
    }

    performSearch(query);
  });

  clearSearch?.addEventListener("click", () => {
    searchInput.value = "";

    $("#searchResultsSection")?.classList.add("hidden");

    window.location.hash = "home";
  });
}


function performSearch(query) {
  const results = articles.filter((article) => {
    const searchable = `
      ${article.title}
      ${article.category}
      ${article.author}
      ${article.excerpt}
      ${article.content}
    `.toLowerCase();

    return searchable.includes(query);
  });

  const container = $("#searchResults");

  if (!container) return;

  container.innerHTML = results.length
    ? results.map(articleCard).join("")
    : emptyState(`No results found for "${query}".`);

  $("#searchResultsSection")?.classList.remove("hidden");

  $("#searchResultsSection")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategoryButtons() {
  $$(".category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      if (!category) return;

      const matching = articles.filter(
        (article) => article.category === category
      );

      if (!matching.length) {
        showToast(`No ${category} articles yet.`);
        return;
      }

      const query =
        `#${category.toLowerCase()}`;

      const section = document.querySelector(query);

      section?.scrollIntoView({
        behavior: "smooth"
      });
    });
  });
}


/* =========================================================
   EDITOR
   ========================================================= */

function setupEditor() {
  const newArticleBtn = $("#newArticleBtn");
  const closeEditorBtn = $("#closeEditorBtn");
  const cancelEditorBtn = $("#cancelEditorBtn");
  const articleForm = $("#articleForm");

  newArticleBtn?.addEventListener("click", () => {
    openNewArticleEditor();
  });

  closeEditorBtn?.addEventListener("click", closeEditor);
  cancelEditorBtn?.addEventListener("click", closeEditor);

  articleForm?.addEventListener("submit", saveArticleFromForm);
}


function openNewArticleEditor() {
  const editor = $("#articleEditor");

  if (!editor) return;

  currentArticleId = null;

  $("#editorTitle").textContent = "Create Article";

  $("#articleId").value = "";
  $("#articleTitle").value = "";
  $("#articleCategory").value = "News";
  $("#articleAuthor").value = "VimBuzz";
  $("#articleImage").value = "";
  $("#articleExcerpt").value = "";
  $("#articleContent").value = "";
  $("#articleFeatured").checked = false;
  $("#articleTrending").checked = false;

  editor.classList.remove("hidden");

  editor.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  $("#articleTitle")?.focus();
}


function openEditArticle(id) {
  const article = getArticle(id);

  if (!article) {
    showToast("Article not found.");
    return;
  }

  currentArticleId = id;

  $("#editorTitle").textContent = "Edit Article";

  $("#articleId").value = article.id;
  $("#articleTitle").value = article.title || "";
  $("#articleCategory").value =
    article.category || "News";
  $("#articleAuthor").value =
    article.author || "VimBuzz";
  $("#articleImage").value =
    article.image || "";
  $("#articleExcerpt").value =
    article.excerpt || "";
  $("#articleContent").value =
    article.content || "";
  $("#articleFeatured").checked =
    Boolean(article.featured);
  $("#articleTrending").checked =
    Boolean(article.trending);

  $("#articleEditor")?.classList.remove("hidden");

  $("#articleEditor")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  $("#articleTitle")?.focus();
}


function closeEditor() {
  $("#articleEditor")?.classList.add("hidden");

  currentArticleId = null;
}


function saveArticleFromForm(event) {
  event.preventDefault();

  const title = $("#articleTitle").value.trim();
  const category = $("#articleCategory").value;
  const author =
    $("#articleAuthor").value.trim() || "VimBuzz";
  const image = $("#articleImage").value.trim();
  const excerpt = $("#articleExcerpt").value.trim();
  const content = $("#articleContent").value.trim();
  const featured = $("#articleFeatured").checked;
  const trending = $("#articleTrending").checked;

  if (!title || !excerpt || !content) {
    showToast("Please complete all required fields.");
    return;
  }

  if (currentArticleId) {
    const index = articles.findIndex(
      (article) =>
        article.id === currentArticleId
    );

    if (index === -1) {
      showToast("Article could not be found.");
      return;
    }

    articles[index] = {
      ...articles[index],
      title,
      category,
      author,
      image: image || fallbackImage(),
      excerpt,
      content,
      featured,
      trending
    };

    showToast("Article updated successfully.");
  } else {
    const newArticle = {
      id:
        "vb-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .slice(2, 8),

      title,
      category,
      author,
      image: image || fallbackImage(),
      excerpt,
      content,
      featured,
      trending,
      views: 0,
      date: new Date().toISOString()
    };

    articles.unshift(newArticle);

    showToast("Article published successfully.");
  }

  saveArticles();
  closeEditor();
  renderAll();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   ADMIN ARTICLE LIST
   ========================================================= */

function renderAdminArticles() {
  const container = $("#adminArticlesList");

  if (!container) return;

  const sorted = sortNewest(articles);

  if (!sorted.length) {
    container.innerHTML =
      emptyState("No articles available.");
    return;
  }

  container.innerHTML = sorted
    .map(
      (article) => `
      <div class="admin-article">

        <div class="admin-article-image">

          <img
            src="${escapeHTML(article.image || fallbackImage())}"
            alt=""
            onerror="this.src='${fallbackImage()}'"
          >

        </div>

        <div class="admin-article-info">

          <h4>
            ${escapeHTML(article.title)}
          </h4>

          <small>
            ${escapeHTML(article.category)}
            • ${formatDate(article.date)}
            • ${formatViews(article.views)} views
          </small>

        </div>

        <div class="admin-actions">

          <button
            class="admin-action-btn"
            data-edit-id="${escapeHTML(article.id)}"
            title="Edit article"
          >
            ✏️
          </button>

          <button
            class="admin-action-btn admin-delete"
            data-delete-id="${escapeHTML(article.id)}"
            title="Delete article"
          >
            🗑️
          </button>

        </div>

      </div>
    `
    )
    .join("");
}


function updateArticleCount() {
  const counter = $("#articleCount");

  if (!counter) return;

  counter.textContent =
    `${articles.length} article${articles.length === 1 ? "" : "s"}`;
}


/* =========================================================
   DELETE ARTICLE
   ========================================================= */

function deleteArticle(id) {
  const article = getArticle(id);

  if (!article) return;

  const confirmed = window.confirm(
    `Delete "${article.title}"?`
  );

  if (!confirmed) return;

  articles = articles.filter(
    (item) => item.id !== id
  );

  saveArticles();
  renderAll();

  showToast("Article deleted.");
}


/* =========================================================
   ARTICLE MODAL
   ========================================================= */

function setupModal() {
  const modal = $("#articleModal");
  const overlay = $("#modalOverlay");
  const closeModal = $("#closeModal");

  overlay?.addEventListener("click", closeArticleModal);
  closeModal?.addEventListener("click", closeArticleModal);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal?.classList.contains("open")
    ) {
      closeArticleModal();
    }
  });

  $("#shareWhatsApp")?.addEventListener(
    "click",
    shareWhatsApp
  );

  $("#shareFacebook")?.addEventListener(
    "click",
    shareFacebook
  );

  $("#shareNative")?.addEventListener(
    "click",
    shareNative
  );
}


function openArticle(id) {
  const article = getArticle(id);

  if (!article) return;

  /*
    Count a view each time an article is opened.
  */
  article.views =
    (Number(article.views) || 0) + 1;

  saveArticles();

  $("#modalCategory").textContent =
    article.category || "News";

  $("#modalDate").textContent =
    formatDate(article.date);

  $("#modalTitle").textContent =
    article.title;

  $("#modalAuthor").textContent =
    article.author || "VimBuzz";

  $("#modalExcerpt").textContent =
    article.excerpt || "";

  $("#modalBody").textContent =
    article.content || "";

  const image = $("#modalImage");

  image.src =
    article.image || fallbackImage();

  image.alt = article.title;

  image.onerror = () => {
    image.src = fallbackImage();
  };

  currentArticleId = article.id;

  $("#articleModal")?.classList.add("open");
  $("#articleModal")?.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");

  renderMostRead();
  renderLatest();
  renderCategory("Sports", "sportsArticles");
  renderCategory(
    "Entertainment",
    "entertainmentArticles"
  );
  renderCategory(
    "Technology",
    "technologyArticles"
  );
  renderCategory(
    "Lifestyle",
    "lifestyleArticles"
  );
  renderAdminArticles();
}


function closeArticleModal() {
  $("#articleModal")?.classList.remove("open");
  $("#articleModal")?.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");
}


/* =========================================================
   SHARING
   ========================================================= */

function getShareData() {
  const article = getArticle(currentArticleId);

  if (!article) return null;

  return {
    title: article.title,
    url:
      window.location.origin +
      window.location.pathname +
      "?article=" +
      encodeURIComponent(article.id)
  };
}


function shareWhatsApp() {
  const data = getShareData();

  if (!data) return;

  const text =
    `${data.title}\n\nRead it on VimBuzz:\n${data.url}`;

  const url =
    "https://wa.me/?text=" +
    encodeURIComponent(text);

  window.open(url, "_blank");
}


function shareFacebook() {
  const data = getShareData();

  if (!data) return;

  const url =
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(data.url);

  window.open(
    url,
    "_blank",
    "width=600,height=500"
  );
}


async function shareNative() {
  const data = getShareData();

  if (!data) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: "Read this story on VimBuzz.",
        url: data.url
      });

      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(
      data.url
    );

    showToast("Article link copied.");
  } catch (error) {
    window.prompt(
      "Copy this article link:",
      data.url
    );
  }
}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {
  const form = $("#newsletterForm");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = $("#newsletterEmail")
      .value
      .trim()
      .toLowerCase();

    if (!email) return;

    let subscribers = [];

    try {
      subscribers =
        JSON.parse(
          localStorage.getItem(
            SUBSCRIBER_KEY
          )
        ) || [];
    } catch {
      subscribers = [];
    }

    if (subscribers.includes(email)) {
      $("#newsletterMessage").textContent =
        "You're already subscribed.";
      return;
    }

    subscribers.push(email);

    localStorage.setItem(
      SUBSCRIBER_KEY,
      JSON.stringify(subscribers)
    );

    $("#newsletterEmail").value = "";

    $("#newsletterMessage").textContent =
      "You're subscribed! 🎉";

    showToast("Subscription saved.");
  });
}


/* =========================================================
   SCROLL TOP
   ========================================================= */

function setupScrollTop() {
  const button = $("#scrollTop");

  if (!button) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 450) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* =========================================================
   GLOBAL EVENTS
   ========================================================= */

function setupGlobalEvents() {

  document.addEventListener("click", (event) => {

    /*
      Article cards / hero cards
    */
    const articleElement =
      event.target.closest(
        "[data-article-id]"
      );

    if (articleElement) {

      const articleId =
        articleElement.dataset.articleId;

      /*
        Admin edit
      */
      if (
        articleElement.hasAttribute(
          "data-edit-id"
        )
      ) {
        event.preventDefault();

        openEditArticle(
          articleElement.dataset.editId
        );

        return;
      }

      /*
        Admin delete
      */
      if (
        articleElement.hasAttribute(
          "data-delete-id"
        )
      ) {
        event.preventDefault();

        deleteArticle(
          articleElement.dataset.deleteId
        );

        return;
      }

      /*
        Trending links
      */
      if (
        articleElement.tagName === "A" &&
        articleElement.dataset.articleId
      ) {
        event.preventDefault();

        openArticle(articleId);

        return;
      }

      /*
        Regular article
      */
      openArticle(articleId);
    }

    /*
      Admin edit button
    */
    const editButton =
      event.target.closest(
        "[data-edit-id]"
      );

    if (editButton) {
      event.preventDefault();

      openEditArticle(
        editButton.dataset.editId
      );

      return;
    }

    /*
      Admin delete button
    */
    const deleteButton =
      event.target.closest(
        "[data-delete-id]"
      );

    if (deleteButton) {
      event.preventDefault();

      deleteArticle(
        deleteButton.dataset.deleteId
      );

      return;
    }

  });


  /*
    Active nav based on scrolling
  */
  const sections = $$(
    "main section[id]"
  );

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id;

          $$(".nav-link").forEach((link) => {

            const href =
              link.getAttribute("href");

            link.classList.toggle(
              "active",
              href === `#${id}`
            );

          });

        });

      },
      {
        threshold: 0.2
      }
    );

  sections.forEach((section) =>
    observer.observe(section)
  );
}


/* =========================================================
   EXPORT ARTICLES
   ========================================================= */

function exportArticles() {
  const data = JSON.stringify(
    articles,
    null,
    2
  );

  const blob = new Blob(
    [data],
    {
      type: "application/json"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `vimbuzz-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

  showToast("Backup exported.");
}


/* =========================================================
   IMPORT ARTICLES
   ========================================================= */

function importArticles(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {

    try {

      const imported =
        JSON.parse(
          event.target.result
        );

      if (!Array.isArray(imported)) {
        throw new Error(
          "Invalid article file."
        );
      }

      const validArticles =
        imported.filter(
          (article) =>
            article &&
            article.title &&
            article.content
        );

      if (!validArticles.length) {
        throw new Error(
          "No valid articles found."
        );
      }

      const confirmed =
        window.confirm(
          `Import ${validArticles.length} article(s)? This will replace your current articles.`
        );

      if (!confirmed) return;

      articles = validArticles;

      saveArticles();
      renderAll();

      showToast(
        `${validArticles.length} article(s) imported.`
      );

    } catch (error) {

      console.error(error);

      showToast(
        "Could not import this file."
      );

    }

  };

  reader.readAsText(file);
}


/* =========================================================
   EXPORT / IMPORT EVENTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  $("#exportBtn")?.addEventListener(
    "click",
    exportArticles
  );

  $("#importFile")?.addEventListener(
    "change",
    (event) => {

      const file =
        event.target.files?.[0];

      importArticles(file);

      event.target.value = "";

    }
  );

});


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {
  const toast = $("#toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}


/* =========================================================
   YEAR
   ========================================================= */

function updateYear() {
  const year = $("#currentYear");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}


/* =========================================================
   OPEN ARTICLE FROM URL
   Example:
   ?article=vb-001
   ========================================================= */

function openArticleFromURL() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const id =
    params.get("article");

  if (!id) return;

  const article = getArticle(id);

  if (article) {
    setTimeout(() => {
      openArticle(id);
    }, 300);
  }
}


document.addEventListener(
  "DOMContentLoaded",
  openArticleFromURL
);


/* =========================================================
   ONLINE / OFFLINE
   ========================================================= */

window.addEventListener(
  "offline",
  () => {
    showToast(
      "You are offline. VimBuzz still works locally."
    );
  }
);

window.addEventListener(
  "online",
  () => {
    showToast(
      "Internet connection restored."
    );
  }
);


/* =========================================================
   DEBUG HELPER
   ========================================================= */

window.VimBuzz = {
  getArticles: () => articles,

  save: saveArticles,

  reset: () => {
    const confirmed =
      window.confirm(
        "Reset VimBuzz to the original demo articles?"
      );

    if (!confirmed) return;

    articles = [...defaultArticles];

    saveArticles();
    renderAll();

    showToast("VimBuzz has been reset.");
  }
};
