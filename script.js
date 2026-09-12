/* =========================================================
   VIMBUZZ V4
   Complete Frontend JavaScript
   No Backend • No Database • LocalStorage
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     STORAGE
     ========================================================= */

  const KEYS = {
    articles: "vimbuzz_articles_v4",
    likes: "vimbuzz_likes_v4",
    bookmarks: "vimbuzz_bookmarks_v4",
    comments: "vimbuzz_comments_v4",
    subscribers: "vimbuzz_subscribers_v4",
    settings: "vimbuzz_settings_v4",
    notifications: "vimbuzz_notifications_v4",
    searches: "vimbuzz_searches_v4",
    views: "vimbuzz_views_v4"
  };

  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error("Storage read error:", error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage write error:", error);
      return false;
    }
  }

  function uid(prefix = "id") {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 9)
    );
  }

  function escapeHTML(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(value = "") {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatViews(number = 0) {
    number = Number(number) || 0;

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1).replace(".0", "") + "M";
    }

    if (number >= 1000) {
      return (number / 1000).toFixed(1).replace(".0", "") + "K";
    }

    return number.toString();
  }

  function formatDate(date) {
    if (!date) return "Recently";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return "Recently";

    return d.toLocaleDateString("en-GH", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function relativeTime(date) {
    if (!date) return "Recently";

    const time = new Date(date).getTime();

    if (Number.isNaN(time)) return "Recently";

    const seconds = Math.floor((Date.now() - time) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return formatDate(date);
  }

  function truncate(text, length = 130) {
    text = String(text || "");

    return text.length > length
      ? text.substring(0, length).trim() + "..."
      : text;
  }

  function slugify(text) {
    return normalizeText(text)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /* =========================================================
     DEFAULT ARTICLES
     ========================================================= */

  const DEFAULT_ARTICLES = [
    {
      id: "vb001",
      title: "Ghana's Digital Economy Continues to Grow as More Businesses Go Online",
      category: "Technology",
      author: "VimBuzz Newsroom",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Businesses across Ghana are increasingly using digital tools to reach customers and improve their operations.",
      content: `
        <p>Ghana's digital economy continues to expand as businesses increasingly adopt websites, mobile applications and digital payment systems.</p>

        <p>Small businesses are also taking advantage of social media and online marketplaces to reach customers outside their immediate communities.</p>

        <p>Technology entrepreneurs believe the trend will continue as internet access and smartphone adoption increase.</p>

        <p>For young developers and entrepreneurs, the growing digital economy is creating new opportunities to build useful products for the Ghanaian market.</p>
      `,
      tags: ["Ghana", "Technology", "Business", "Digital"],
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1248,
      likes: 87,
      shares: 23,
      rating: 4.7,
      featured: true,
      trending: true,
      pinned: true,
      sponsored: false,
      status: "published"
    },

    {
      id: "vb002",
      title: "Local Football Talent Attracts Attention Ahead of New Season",
      category: "Sports",
      author: "VimBuzz Sports",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Young footballers are preparing for another competitive season as clubs search for emerging talent.",
      content: `
        <p>Young football players are attracting attention from clubs as preparations continue for the upcoming football season.</p>

        <p>Coaches say discipline, fitness and consistency will be important factors for players hoping to progress.</p>

        <p>Several local academies are also increasing their focus on youth development.</p>
      `,
      tags: ["Football", "Sports", "Ghana", "Players"],
      date: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
      views: 2980,
      likes: 193,
      shares: 61,
      rating: 4.8,
      featured: false,
      trending: true,
      pinned: false,
      sponsored: false,
      status: "published"
    },

    {
      id: "vb003",
      title: "Ghana Entertainment Scene Welcomes New Wave of Young Creators",
      category: "Entertainment",
      author: "VimBuzz Entertainment",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "A growing number of young Ghanaian creators are building audiences through digital platforms.",
      content: `
        <p>Ghana's entertainment industry is seeing a new generation of young creators use digital platforms to distribute their work.</p>

        <p>From music to comedy and film, social media has become an important tool for discovering new talent.</p>
      `,
      tags: ["Entertainment", "Music", "Creators"],
      date: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 6000000).toISOString(),
      views: 2150,
      likes: 145,
      shares: 39,
      rating: 4.6,
      featured: false,
      trending: true,
      pinned: false,
      sponsored: false,
      status: "published"
    },

    {
      id: "vb004",
      title: "Simple Financial Habits That Can Help Young Ghanaians Save More",
      category: "Lifestyle",
      author: "VimBuzz Lifestyle",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Small changes in daily spending habits can make a meaningful difference over time.",
      content: `
        <p>Building good financial habits does not always require earning a large income.</p>

        <p>Tracking spending, setting clear savings goals and avoiding unnecessary purchases can help people take better control of their money.</p>

        <p>Experts also recommend creating an emergency fund whenever possible.</p>
      `,
      tags: ["Money", "Lifestyle", "Savings", "Ghana"],
      date: new Date(Date.now() - 10800000).toISOString(),
      updatedAt: new Date(Date.now() - 9000000).toISOString(),
      views: 1730,
      likes: 102,
      shares: 28,
      rating: 4.5,
      featured: false,
      trending: false,
      pinned: false,
      sponsored: false,
      status: "published"
    },

    {
      id: "vb005",
      title: "Businesses Turn to Social Media to Reach More Customers",
      category: "News",
      author: "VimBuzz Business",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Social media marketing is becoming increasingly important for small and medium-sized businesses.",
      content: `
        <p>Businesses across Ghana are increasingly using social media platforms to advertise their products and services.</p>

        <p>For smaller companies, social media provides an affordable way to communicate directly with customers.</p>
      `,
      tags: ["Business", "Social Media", "Ghana"],
      date: new Date(Date.now() - 14400000).toISOString(),
      updatedAt: new Date(Date.now() - 12000000).toISOString(),
      views: 1420,
      likes: 75,
      shares: 19,
      rating: 4.4,
      featured: false,
      trending: false,
      pinned: false,
      sponsored: false,
      status: "published"
    },

    {
      id: "vb006",
      title: "New Mobile Tools Make Everyday Tasks Easier",
      category: "Technology",
      author: "VimBuzz Tech",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Mobile technology continues to change the way people work, communicate and access services.",
      content: `
        <p>Smartphones have become important tools for communication, learning, entertainment and business.</p>

        <p>Developers continue to create applications designed to solve everyday problems for users.</p>
      `,
      tags: ["Technology", "Mobile", "Apps"],
      date: new Date(Date.now() - 18000000).toISOString(),
      updatedAt: new Date(Date.now() - 15000000).toISOString(),
      views: 980,
      likes: 54,
      shares: 14,
      rating: 4.3,
      featured: false,
      trending: false,
      pinned: false,
      sponsored: false,
      status: "published"
    }
  ];

  /* =========================================================
     LOAD DATA
     ========================================================= */

  let articles = readStorage(KEYS.articles, null);

  if (!Array.isArray(articles) || articles.length === 0) {
    articles = DEFAULT_ARTICLES;
    writeStorage(KEYS.articles, articles);
  }

  let likes = readStorage(KEYS.likes, {});
  let bookmarks = readStorage(KEYS.bookmarks, []);
  let comments = readStorage(KEYS.comments, {});
  let subscribers = readStorage(KEYS.subscribers, []);
  let notifications = readStorage(KEYS.notifications, []);
  let searches = readStorage(KEYS.searches, []);
  let settings = readStorage(KEYS.settings, {
    darkMode: false,
    readingMode: false,
    fontSize: "normal"
  });

  /* =========================================================
     SAVE
     ========================================================= */

  function saveArticles() {
    writeStorage(KEYS.articles, articles);
  }

  function saveLikes() {
    writeStorage(KEYS.likes, likes);
  }

  function saveBookmarks() {
    writeStorage(KEYS.bookmarks, bookmarks);
  }

  function saveComments() {
    writeStorage(KEYS.comments, comments);
  }

  function saveSubscribers() {
    writeStorage(KEYS.subscribers, subscribers);
  }

  function saveNotifications() {
    writeStorage(KEYS.notifications, notifications);
  }

  function saveSettings() {
    writeStorage(KEYS.settings, settings);
  }

  function saveSearches() {
    writeStorage(KEYS.searches, searches);
  }

  /* =========================================================
     TOAST
     ========================================================= */

  function toast(message, type = "success") {
    let el = $("#toast");

    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }

    el.textContent = message;
    el.classList.remove("show", "success", "error", "info");
    el.classList.add("show", type);

    clearTimeout(window.__vbToastTimer);

    window.__vbToastTimer = setTimeout(() => {
      el.classList.remove("show");
    }, 3000);
  }

  /* =========================================================
     NOTIFICATIONS
     ========================================================= */

  function addNotification(title, message) {
    notifications.unshift({
      id: uid("notification"),
      title,
      message,
      date: new Date().toISOString(),
      read: false
    });

    notifications = notifications.slice(0, 50);

    saveNotifications();

    renderNotifications();
  }

  function renderNotifications() {
    const list = $("#notificationList");

    if (!list) return;

    if (!notifications.length) {
      list.innerHTML =
        '<div class="empty-state">No notifications yet.</div>';
      return;
    }

    list.innerHTML = notifications
      .map(
        n => `
        <div class="notification-item ${n.read ? "read" : ""}">
          <strong>${escapeHTML(n.title)}</strong>
          <p>${escapeHTML(n.message)}</p>
          <small>${relativeTime(n.date)}</small>
        </div>
      `
      )
      .join("");
  }

  /* =========================================================
     ARTICLE HELPERS
     ========================================================= */

  function getArticle(id) {
    return articles.find(article => String(article.id) === String(id));
  }

  function publishedArticles() {
    return articles.filter(
      article => article.status !== "draft"
    );
  }

  function sortedNewest(list) {
    return [...list].sort(
      (a, b) =>
        new Date(b.updatedAt || b.date) -
        new Date(a.updatedAt || a.date)
    );
  }

  function categoryArticles(category) {
    return publishedArticles().filter(
      article =>
        normalizeText(article.category) === normalizeText(category)
    );
  }

  /* =========================================================
     ARTICLE CARD
     ========================================================= */

  function articleCard(article, options = {}) {
    const isLiked = !!likes[article.id];
    const isSaved = bookmarks.includes(article.id);

    const tags = Array.isArray(article.tags)
      ? article.tags
      : [];

    return `
      <article class="article-card"
        data-article-id="${escapeHTML(article.id)}">

        <div class="article-image-wrap">
          <img
            src="${escapeHTML(article.image || "")}"
            alt="${escapeHTML(article.title)}"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80'"
          >

          <span class="category-tag">
            ${escapeHTML(article.category)}
          </span>

          ${
            article.sponsored
              ? `<span class="sponsored-label">Sponsored</span>`
              : ""
          }
        </div>

        <div class="article-body">

          <h3 class="article-title">
            ${escapeHTML(article.title)}
          </h3>

          <p class="article-excerpt">
            ${escapeHTML(
              article.excerpt || truncate(article.content, 130)
            )}
          </p>

          ${
            tags.length
              ? `
              <div class="article-tags">
                ${tags
                  .slice(0, 4)
                  .map(
                    tag =>
                      `<span class="article-tag">#${escapeHTML(
                        tag
                      )}</span>`
                  )
                  .join("")}
              </div>
              `
              : ""
          }

          <div class="article-meta">
            <span>
              ${escapeHTML(article.author || "VimBuzz")}
            </span>

            <span>
              ${relativeTime(article.updatedAt || article.date)}
            </span>

            <span>
              ${formatViews(article.views || 0)} views
            </span>
          </div>

          <div class="card-footer">

            <button
              class="read-more"
              data-open-article="${escapeHTML(article.id)}">
              Read Article
            </button>

            <div class="card-actions">

              <button
                class="article-action mini-like ${
                  isLiked ? "active" : ""
                }"
                data-like="${escapeHTML(article.id)}"
                aria-label="Like article">
                ♥ ${formatViews(article.likes || 0)}
              </button>

              <button
                class="article-action mini-bookmark ${
                  isSaved ? "active" : ""
                }"
                data-bookmark="${escapeHTML(article.id)}"
                aria-label="Save article">
                🔖
              </button>

            </div>

          </div>

        </div>
      </article>
    `;
  }

  /* =========================================================
     HERO
     ========================================================= */

  function renderHero() {
    const container = $("#heroGrid");

    if (!container) return;

    const published = publishedArticles();

    let featured = published.filter(a => a.featured);

    if (!featured.length) {
      featured = sortedNewest(published).slice(0, 1);
    }

    const main = featured[0];

    if (!main) {
      container.innerHTML =
        '<div class="empty-state">No featured article available.</div>';
      return;
    }

    const side = sortedNewest(
      published.filter(a => a.id !== main.id)
    ).slice(0, 4);

    container.innerHTML = `
      <article
        class="hero-main"
        data-open-article="${escapeHTML(main.id)}">

        <img
          src="${escapeHTML(main.image)}"
          alt="${escapeHTML(main.title)}"
          onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80'"
        >

        <div class="hero-overlay"></div>

        <div class="hero-content">

          <span class="category-tag">
            ${escapeHTML(main.category)}
          </span>

          <h1>${escapeHTML(main.title)}</h1>

          <p>${escapeHTML(main.excerpt || "")}</p>

          <div class="article-meta">
            <span>${escapeHTML(main.author)}</span>
            <span>${relativeTime(main.updatedAt || main.date)}</span>
            <span>${formatViews(main.views)} views</span>
          </div>

        </div>

      </article>

      <div class="hero-side">
        ${side
          .map(
            article => `
              <article
                class="hero-side-card"
                data-open-article="${escapeHTML(article.id)}">

                <img
                  src="${escapeHTML(article.image)}"
                  alt="${escapeHTML(article.title)}"
                >

                <div>
                  <span class="category-tag">
                    ${escapeHTML(article.category)}
                  </span>

                  <h3>${escapeHTML(article.title)}</h3>

                  <small>
                    ${relativeTime(article.updatedAt || article.date)}
                  </small>
                </div>

              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  /* =========================================================
     LATEST
     ========================================================= */

  function renderLatest() {
    const container = $("#latestArticles");

    if (!container) return;

    const list = sortedNewest(publishedArticles()).slice(0, 12);

    container.innerHTML = list.length
      ? list.map(article => articleCard(article)).join("")
      : '<div class="empty-state">No articles available.</div>';
  }

  /* =========================================================
     MOST READ
     ========================================================= */

  function renderMostRead() {
    const container = $("#mostRead");

    if (!container) return;

    const list = [...publishedArticles()]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    container.innerHTML = list.length
      ? list
          .map(
            (article, index) => `
            <article
              class="most-read-item"
              data-open-article="${escapeHTML(article.id)}">

              <div class="most-read-number">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <span class="category-tag">
                  ${escapeHTML(article.category)}
                </span>

                <h3>${escapeHTML(article.title)}</h3>

                <small>
                  ${formatViews(article.views)} views
                </small>
              </div>

            </article>
          `
          )
          .join("")
      : '<div class="empty-state">Nothing to show.</div>';
  }

  /* =========================================================
     CATEGORY
     ========================================================= */

  function renderCategory(category, selector) {
    const container = $(selector);

    if (!container) return;

    const list = sortedNewest(
      categoryArticles(category)
    ).slice(0, 6);

    container.innerHTML = list.length
      ? list.map(article => articleCard(article)).join("")
      : '<div class="empty-state">No articles in this category yet.</div>';
  }

  /* =========================================================
     TRENDING
     ========================================================= */

  function renderTrending() {
    const container = $("#trendingList");

    if (!container) return;

    const list = [
      ...publishedArticles()
        .filter(a => a.trending)
        .sort((a, b) => (b.views || 0) - (a.views || 0)),
      ...publishedArticles().filter(a => !a.trending)
    ].slice(0, 10);

    container.innerHTML = list
      .map(
        article => `
          <button
            class="trending-item"
            data-open-article="${escapeHTML(article.id)}">
            <span>#</span>
            ${escapeHTML(article.title)}
          </button>
        `
      )
      .join("");
  }

  /* =========================================================
     BREAKING NEWS
     ========================================================= */

  function renderBreakingNews() {
    const bar = $("#breakingBar");
    const text = $("#breakingNews");

    if (!bar || !text) return;

    const breaking =
      publishedArticles().find(a => a.pinned) ||
      sortedNewest(publishedArticles())[0];

    if (!breaking) {
      bar.style.display = "none";
      return;
    }

    text.innerHTML = `
      <button data-open-article="${escapeHTML(breaking.id)}">
        ${escapeHTML(breaking.title)}
      </button>
    `;

    bar.style.display = "";
  }

  /* =========================================================
     SEARCH
     ========================================================= */

  function performSearch(query) {
    query = String(query || "").trim();

    const section = $("#searchResultsSection");
    const container = $("#searchResults");

    if (!section || !container) return;

    if (!query) {
      section.hidden = true;
      return;
    }

    const q = normalizeText(query);

    const results = publishedArticles().filter(article => {
      const text = normalizeText(
        [
          article.title,
          article.category,
          article.author,
          article.excerpt,
          article.content,
          ...(article.tags || [])
        ].join(" ")
      );

      return text.includes(q);
    });

    searches = [
      query,
      ...searches.filter(
        item => normalizeText(item) !== q
      )
    ].slice(0, 10);

    saveSearches();

    section.hidden = false;

    container.innerHTML = results.length
      ? results.map(article => articleCard(article)).join("")
      : `
        <div class="empty-state">
          <h3>No results found</h3>
          <p>Try another search term.</p>
        </div>
      `;
  }

  function renderSearchSuggestions(query = "") {
    const box = $("#searchSuggestions");

    if (!box) return;

    const q = normalizeText(query);

    if (!q && !searches.length) {
      box.innerHTML = "";
      box.hidden = true;
      return;
    }

    let suggestions = searches;

    if (q) {
      suggestions = publishedArticles()
        .filter(article =>
          normalizeText(article.title).includes(q)
        )
        .slice(0, 5)
        .map(article => article.title);
    }

    box.innerHTML = suggestions
      .slice(0, 7)
      .map(
        item => `
          <button
            class="search-suggestion"
            type="button"
            data-search-suggestion="${escapeHTML(item)}">
            🔎 ${escapeHTML(item)}
          </button>
        `
      )
      .join("");

    box.hidden = !suggestions.length;
  }

  /* =========================================================
     MODAL
     ========================================================= */

  let currentArticleId = null;

  function openArticle(id) {
    const article = getArticle(id);

    if (!article) {
      toast("Article not found.", "error");
      return;
    }

    currentArticleId = article.id;

    article.views = Number(article.views || 0) + 1;
    saveArticles();

    const modal = $("#articleModal");

    if (!modal) {
      showFallbackArticle(article);
      return;
    }

    const image = $("#modalImage");
    const category = $("#modalCategory");
    const date = $("#modalDate");
    const title = $("#modalTitle");
    const author = $("#modalAuthor");
    const excerpt = $("#modalExcerpt");
    const body = $("#modalBody");

    if (image) {
      image.src = article.image || "";
      image.alt = article.title;
    }

    if (category) category.textContent = article.category;
    if (date) {
      date.textContent = `${formatDate(
        article.date
      )} • Updated ${relativeTime(article.updatedAt || article.date)}`;
    }

    if (title) title.textContent = article.title;
    if (author) author.textContent = article.author || "VimBuzz";
    if (excerpt) excerpt.textContent = article.excerpt || "";

    if (body) {
      body.innerHTML = `
        ${article.content || `<p>${escapeHTML(article.excerpt || "")}</p>`}

        ${
          article.tags?.length
            ? `
            <div class="article-tags modal-tags">
              ${article.tags
                .map(
                  tag =>
                    `<span class="article-tag">#${escapeHTML(
                      tag
                    )}</span>`
                )
                .join("")}
            </div>
            `
            : ""
        }
      `;
    }

    updateArticleActionButtons(article);
    renderComments(article.id);
    renderRelated(article);
    resetReadingProgress();

    modal.hidden = false;
    document.body.classList.add("modal-open");

    history.replaceState(
      null,
      "",
      `${location.pathname}?article=${encodeURIComponent(
        article.id
      )}`
    );

    setTimeout(() => {
      const dialog = $(".modal-dialog", modal);
      if (dialog) dialog.scrollTop = 0;
    }, 20);

    renderAll();
  }

  function showFallbackArticle(article) {
    alert(
      `${article.title}\n\n${article.excerpt || ""}`
    );
  }

  function closeArticle() {
    const modal = $("#articleModal");

    if (modal) modal.hidden = true;

    document.body.classList.remove("modal-open");

    currentArticleId = null;

    if (location.search) {
      history.replaceState(
        null,
        "",
        location.pathname
      );
    }

    stopSpeech();
  }

  /* =========================================================
     ARTICLE ACTIONS
     ========================================================= */

  function updateArticleActionButtons(article) {
    const likeBtn = $("#likeArticleBtn");
    const bookmarkBtn = $("#bookmarkArticleBtn");
    const likesCount = $("#modalLikes");

    const liked = !!likes[article.id];
    const saved = bookmarks.includes(article.id);

    if (likeBtn) {
      likeBtn.classList.toggle("active", liked);
      likeBtn.innerHTML = liked
        ? "♥ Liked"
        : "♡ Like";
    }

    if (bookmarkBtn) {
      bookmarkBtn.classList.toggle("active", saved);
      bookmarkBtn.innerHTML = saved
        ? "🔖 Saved"
        : "🔖 Save";
    }

    if (likesCount) {
      likesCount.textContent = formatViews(
        article.likes || 0
      );
    }
  }

  function toggleLike(id) {
    const article = getArticle(id);

    if (!article) return;

    if (likes[id]) {
      delete likes[id];
      article.likes = Math.max(
        0,
        Number(article.likes || 0) - 1
      );

      toast("Like removed.", "info");
    } else {
      likes[id] = true;
      article.likes = Number(article.likes || 0) + 1;

      toast("Article liked ❤️");
    }

    saveLikes();
    saveArticles();

    if (currentArticleId === id) {
      updateArticleActionButtons(article);
    }

    renderAll();
  }

  function toggleBookmark(id) {
    const index = bookmarks.indexOf(id);

    if (index >= 0) {
      bookmarks.splice(index, 1);
      toast("Removed from saved articles.", "info");
    } else {
      bookmarks.push(id);
      toast("Article saved 🔖");
    }

    saveBookmarks();

    if (currentArticleId === id) {
      updateArticleActionButtons(getArticle(id));
    }

    renderSavedArticles();
    renderAll();
  }

  /* =========================================================
     SAVED ARTICLES
     ========================================================= */

  function createSavedButton() {
    if ($("#savedBtn")) return;

    const headerActions =
      $(".header-actions") ||
      $(".site-header .container");

    if (!headerActions) return;

    const button = document.createElement("button");

    button.id = "savedBtn";
    button.className = "icon-button";
    button.type = "button";
    button.title = "Saved Articles";
    button.innerHTML = "🔖 <span class='saved-count'>0</span>";

    headerActions.appendChild(button);
  }

  function updateSavedBadge() {
    const button = $("#savedBtn");

    if (!button) return;

    const count = $(".saved-count", button);

    if (count) {
      count.textContent = bookmarks.length;
    }
  }

  function openSavedPanel() {
    const panel = $("#savedPanel");

    if (!panel) {
      toast(
        bookmarks.length
          ? `${bookmarks.length} saved article(s)`
          : "No saved articles yet.",
        "info"
      );
      return;
    }

    renderSavedArticles();

    panel.hidden = false;

    const overlay = $("#savedOverlay");

    if (overlay) overlay.hidden = false;
  }

  function closeSavedPanel() {
    const panel = $("#savedPanel");
    const overlay = $("#savedOverlay");

    if (panel) panel.hidden = true;
    if (overlay) overlay.hidden = true;
  }

  function renderSavedArticles() {
    const container = $("#savedArticles");

    if (!container) return;

    const saved = bookmarks
      .map(id => getArticle(id))
      .filter(Boolean);

    container.innerHTML = saved.length
      ? saved
          .map(
            article => `
              <article
                class="saved-article"
                data-open-article="${escapeHTML(article.id)}">

                <img
                  src="${escapeHTML(article.image)}"
                  alt="${escapeHTML(article.title)}"
                >

                <div>
                  <strong>
                    ${escapeHTML(article.title)}
                  </strong>

                  <small>
                    ${escapeHTML(article.category)}
                  </small>

                  <button
                    type="button"
                    data-remove-bookmark="${escapeHTML(article.id)}">
                    Remove
                  </button>
                </div>

              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No saved articles yet.</div>';

    updateSavedBadge();
  }

  /* =========================================================
     COMMENTS
     ========================================================= */

  function getComments(articleId) {
    if (!Array.isArray(comments[articleId])) {
      comments[articleId] = [];
    }

    return comments[articleId];
  }

  function renderComments(articleId) {
    const container = $("#commentsList");
    const count = $("#commentCount");

    if (!container) return;

    const list = getComments(articleId);

    if (count) count.textContent = list.length;

    if (!list.length) {
      container.innerHTML =
        '<div class="empty-state">No comments yet. Be the first to comment.</div>';
      return;
    }

    container.innerHTML = list
      .map(
        comment => `
          <article class="comment">

            <div class="comment-header">
              <strong>
                ${escapeHTML(comment.name)}
              </strong>

              <small>
                ${relativeTime(comment.date)}
              </small>
            </div>

            <p>${escapeHTML(comment.text)}</p>

            <button
              type="button"
              class="comment-like"
              data-comment-like="${escapeHTML(comment.id)}">
              ♥ ${comment.likes || 0}
            </button>

          </article>
        `
      )
      .join("");
  }

  function submitComment(event) {
    event.preventDefault();

    if (!currentArticleId) return;

    const nameInput = $("#commentName");
    const textInput = $("#commentText");

    const name = nameInput?.value.trim();
    const text = textInput?.value.trim();

    if (!name || !text) {
      toast("Enter your name and comment.", "error");
      return;
    }

    const list = getComments(currentArticleId);

    list.unshift({
      id: uid("comment"),
      name,
      text,
      likes: 0,
      date: new Date().toISOString()
    });

    saveComments();

    if (nameInput) nameInput.value = "";
    if (textInput) textInput.value = "";

    renderComments(currentArticleId);

    const article = getArticle(currentArticleId);

    if (article) {
      addNotification(
        "New comment",
        `A comment was added to "${article.title}".`
      );
    }

    toast("Comment posted 💬");
    renderDashboard();
  }

  function likeComment(commentId) {
    if (!currentArticleId) return;

    const list = getComments(currentArticleId);

    const comment = list.find(
      item => item.id === commentId
    );

    if (!comment) return;

    comment.likes = Number(comment.likes || 0) + 1;

    saveComments();
    renderComments(currentArticleId);
  }

  /* =========================================================
     RELATED ARTICLES
     ========================================================= */

  function renderRelated(article) {
    const container = $("#relatedArticles");

    if (!container) return;

    let related = publishedArticles()
      .filter(
        item =>
          item.id !== article.id &&
          normalizeText(item.category) ===
            normalizeText(article.category)
      )
      .slice(0, 4);

    if (related.length < 4) {
      related = [
        ...related,
        ...publishedArticles().filter(
          item =>
            item.id !== article.id &&
            !related.some(
              r => r.id === item.id
            )
        )
      ].slice(0, 4);
    }

    container.innerHTML = related
      .map(
        item => `
          <article
            class="related-card"
            data-open-article="${escapeHTML(item.id)}">

            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.title)}"
            >

            <div>
              <span class="category-tag">
                ${escapeHTML(item.category)}
              </span>

              <h4>
                ${escapeHTML(item.title)}
              </h4>
            </div>

          </article>
        `
      )
      .join("");
  }

  /* =========================================================
     SHARE
     ========================================================= */

  function articleURL(article) {
    return `${location.origin}${location.pathname}?article=${encodeURIComponent(
      article.id
    )}`;
  }

  async function copyArticleLink() {
    const article = getArticle(currentArticleId);

    if (!article) return;

    const url = articleURL(article);

    try {
      await navigator.clipboard.writeText(url);

      article.shares =
        Number(article.shares || 0) + 1;

      saveArticles();

      toast("Article link copied!");
    } catch {
      toast("Could not copy link.", "error");
    }
  }

  function shareWhatsApp() {
    const article = getArticle(currentArticleId);

    if (!article) return;

    const url = articleURL(article);

    const text = `${article.title} — ${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );

    article.shares =
      Number(article.shares || 0) + 1;

    saveArticles();
  }

  function shareFacebook() {
    const article = getArticle(currentArticleId);

    if (!article) return;

    const url = articleURL(article);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener"
    );

    article.shares =
      Number(article.shares || 0) + 1;

    saveArticles();
  }

  async function nativeShare() {
    const article = getArticle(currentArticleId);

    if (!article) return;

    const url = articleURL(article);

    if (!navigator.share) {
      await copyArticleLink();
      return;
    }

    try {
      await navigator.share({
        title: article.title,
        text: article.excerpt || "",
        url
      });

      article.shares =
        Number(article.shares || 0) + 1;

      saveArticles();
    } catch {
      // User cancelled share.
    }
  }

  /* =========================================================
     TEXT TO SPEECH
     ========================================================= */

  let speechUtterance = null;

  function getArticleText() {
    const article = getArticle(currentArticleId);

    if (!article) return "";

    const temp = document.createElement("div");

    temp.innerHTML = article.content || "";

    return [
      article.title,
      article.excerpt,
      temp.textContent
    ]
      .filter(Boolean)
      .join(". ");
  }

  function startSpeech() {
    if (!("speechSynthesis" in window)) {
      toast(
        "Text-to-speech is not supported on this device.",
        "error"
      );
      return;
    }

    stopSpeech();

    speechUtterance = new SpeechSynthesisUtterance(
      getArticleText()
    );

    speechUtterance.rate = 0.95;
    speechUtterance.pitch = 1;
    speechUtterance.volume = 1;

    speechSynthesis.speak(speechUtterance);

    toast("Reading article aloud 🔊");
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    speechUtterance = null;
  }

  /* =========================================================
     READING PROGRESS
     ========================================================= */

  function updateReadingProgress() {
    const progress = $("#readingProgress");

    if (!progress) return;

    const modal = $("#articleModal");

    const scrollElement =
      $(".modal-dialog", modal) || modal;

    const max =
      scrollElement.scrollHeight -
      scrollElement.clientHeight;

    if (max <= 0) {
      progress.style.width = "0%";
      return;
    }

    const percent =
      (scrollElement.scrollTop / max) * 100;

    progress.style.width =
      `${Math.min(100, Math.max(0, percent))}%`;
  }

  function resetReadingProgress() {
    const progress = $("#readingProgress");

    if (progress) progress.style.width = "0%";
  }

  /* =========================================================
     NEWSLETTER
     ========================================================= */

  function subscribeNewsletter(event) {
    event.preventDefault();

    const input = $("#newsletterEmail");

    if (!input) return;

    const email = input.value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    if (
      subscribers.some(
        subscriber => subscriber.email === email
      )
    ) {
      setNewsletterMessage(
        "This email is already subscribed.",
        "info"
      );
      return;
    }

    subscribers.push({
      id: uid("subscriber"),
      email,
      date: new Date().toISOString()
    });

    saveSubscribers();

    input.value = "";

    setNewsletterMessage(
      "You're subscribed! Welcome to VimBuzz.",
      "success"
    );

    addNotification(
      "Newsletter subscription",
      "A new reader subscribed to VimBuzz."
    );
  }

  function setNewsletterMessage(message, type) {
    const element = $("#newsletterMessage");

    if (!element) return;

    element.textContent = message;
    element.className =
      `newsletter-message ${type || ""}`;
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */

  function renderDashboard() {
    const published = publishedArticles();

    const statArticles = $("#statArticles");
    const statViews = $("#statViews");
    const statLikes = $("#statLikes");
    const statComments = $("#statComments");

    const totalViews = published.reduce(
      (sum, article) =>
        sum + Number(article.views || 0),
      0
    );

    const totalLikes = published.reduce(
      (sum, article) =>
        sum + Number(article.likes || 0),
      0
    );

    const totalComments = Object.values(
      comments
    ).reduce(
      (sum, list) =>
        sum + (Array.isArray(list) ? list.length : 0),
      0
    );

    if (statArticles)
      statArticles.textContent = articles.length;

    if (statViews)
      statViews.textContent = formatViews(totalViews);

    if (statLikes)
      statLikes.textContent = formatViews(totalLikes);

    if (statComments)
      statComments.textContent = formatViews(
        totalComments
      );

    renderDashboardAnalytics();
    renderAdminArticles();
  }

  function renderDashboardAnalytics() {
    const mostViewed = [...publishedArticles()].sort(
      (a, b) =>
        Number(b.views || 0) -
        Number(a.views || 0)
    )[0];

    const mostLiked = [...publishedArticles()].sort(
      (a, b) =>
        Number(b.likes || 0) -
        Number(a.likes || 0)
    )[0];

    const viewedTitle = $("#mostViewedTitle");
    const viewedViews = $("#mostViewedViews");

    const likedTitle = $("#mostLikedTitle");
    const likedLikes = $("#mostLikedLikes");

    if (viewedTitle) {
      viewedTitle.textContent =
        mostViewed?.title || "No data";
    }

    if (viewedViews) {
      viewedViews.textContent =
        mostViewed
          ? `${formatViews(mostViewed.views)} views`
          : "0 views";
    }

    if (likedTitle) {
      likedTitle.textContent =
        mostLiked?.title || "No data";
    }

    if (likedLikes) {
      likedLikes.textContent =
        mostLiked
          ? `${formatViews(mostLiked.likes)} likes`
          : "0 likes";
    }
  }

  /* =========================================================
     ADMIN ARTICLE LIST
     ========================================================= */

  function renderAdminArticles() {
    const container = $("#adminArticlesList");
    const count = $("#articleCount");

    if (!container) return;

    if (count) {
      count.textContent =
        `${articles.length} article${
          articles.length === 1 ? "" : "s"
        }`;
    }

    const list = sortedNewest(articles);

    container.innerHTML = list
      .map(
        article => `
          <article class="admin-article">

            <img
              class="admin-article-image"
              src="${escapeHTML(article.image)}"
              alt="${escapeHTML(article.title)}"
            >

            <div class="admin-article-info">

              <span class="category-tag">
                ${escapeHTML(article.category)}
              </span>

              <h3>
                ${escapeHTML(article.title)}
              </h3>

              <p>
                ${escapeHTML(
                  article.author || "VimBuzz"
                )}
                •
                ${formatDate(
                  article.updatedAt || article.date
                )}
              </p>

              <small>
                ${formatViews(article.views)} views
                •
                ${formatViews(article.likes)} likes
                •
                ${article.status || "published"}
              </small>

            </div>

            <div class="admin-actions">

              <button
                class="admin-action-btn"
                type="button"
                data-edit-article="${escapeHTML(article.id)}">
                Edit
              </button>

              <button
                class="admin-action-btn"
                type="button"
                data-toggle-status="${escapeHTML(article.id)}">
                ${
                  article.status === "draft"
                    ? "Publish"
                    : "Draft"
                }
              </button>

              <button
                class="admin-action-btn"
                type="button"
                data-toggle-featured="${escapeHTML(article.id)}">
                ${
                  article.featured
                    ? "Unfeature"
                    : "Feature"
                }
              </button>

              <button
                class="admin-action-btn admin-delete"
                type="button"
                data-delete-article="${escapeHTML(article.id)}">
                Delete
              </button>

            </div>

          </article>
        `
      )
      .join("");
  }

  /* =========================================================
     EDITOR
     ========================================================= */

  function openEditor(article = null) {
    const editor = $("#articleEditor");

    if (!editor) return;

    editor.hidden = false;

    const id = $("#articleId");
    const title = $("#articleTitle");
    const category = $("#articleCategory");
    const author = $("#articleAuthor");
    const image = $("#articleImage");
    const excerpt = $("#articleExcerpt");
    const content = $("#articleContent");
    const featured = $("#articleFeatured");
    const trending = $("#articleTrending");

    if (article) {
      if (id) id.value = article.id;
      if (title) title.value = article.title || "";
      if (category) category.value = article.category || "News";
      if (author) author.value = article.author || "";
      if (image) image.value = article.image || "";
      if (excerpt) excerpt.value = article.excerpt || "";
      if (content) content.value = stripHTML(article.content || "");
      if (featured) featured.checked = !!article.featured;
      if (trending) trending.checked = !!article.trending;
    } else {
      if (id) id.value = "";
      if (title) title.value = "";
      if (category) category.value = "News";
      if (author) author.value = "";
      if (image) image.value = "";
      if (excerpt) excerpt.value = "";
      if (content) content.value = "";
      if (featured) featured.checked = false;
      if (trending) trending.checked = false;
    }

    editor.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function stripHTML(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || "";
  }

  function closeEditor() {
    const editor = $("#articleEditor");

    if (editor) editor.hidden = true;
  }

  function saveArticleFromForm(event) {
    event.preventDefault();

    const id = $("#articleId")?.value.trim();
    const title = $("#articleTitle")?.value.trim();
    const category =
      $("#articleCategory")?.value.trim() || "News";
    const author =
      $("#articleAuthor")?.value.trim() || "VimBuzz Newsroom";
    const image =
      $("#articleImage")?.value.trim() ||
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
    const excerpt =
      $("#articleExcerpt")?.value.trim() || "";
    const content =
      $("#articleContent")?.value.trim() || "";
    const featured =
      $("#articleFeatured")?.checked || false;
    const trending =
      $("#articleTrending")?.checked || false;

    if (!title) {
      toast("Article title is required.", "error");
      return;
    }

    if (!content) {
      toast("Article content is required.", "error");
      return;
    }

    if (id) {
      const article = getArticle(id);

      if (!article) {
        toast("Article not found.", "error");
        return;
      }

      article.title = title;
      article.category = category;
      article.author = author;
      article.image = image;
      article.excerpt = excerpt;
      article.content = formatEditorContent(content);
      article.featured = featured;
      article.trending = trending;
      article.updatedAt = new Date().toISOString();

      toast("Article updated successfully.");
    } else {
      const article = {
        id: uid("article"),
        title,
        category,
        author,
        image,
        excerpt,
        content: formatEditorContent(content),
        tags: title
          .split(" ")
          .filter(word => word.length > 4)
          .slice(0, 5),
        date: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        shares: 0,
        rating: 5,
        featured,
        trending,
        pinned: false,
        sponsored: false,
        status: "published"
      };

      articles.unshift(article);

      addNotification(
        "New article published",
        title
      );

      toast("Article published successfully!");
    }

    saveArticles();

    closeEditor();
    renderAll();
  }

  function formatEditorContent(text) {
    return String(text)
      .split(/\n{2,}/)
      .map(
        paragraph =>
          `<p>${escapeHTML(paragraph).replace(
            /\n/g,
            "<br>"
          )}</p>`
      )
      .join("");
  }

  /* =========================================================
     ARTICLE MANAGEMENT
     ========================================================= */

  function deleteArticle(id) {
    const article = getArticle(id);

    if (!article) return;

    const confirmed = confirm(
      `Delete "${article.title}"?`
    );

    if (!confirmed) return;

    articles = articles.filter(
      item => item.id !== id
    );

    delete likes[id];

    bookmarks = bookmarks.filter(
      bookmark => bookmark !== id
    );

    delete comments[id];

    saveArticles();
    saveLikes();
    saveBookmarks();
    saveComments();

    toast("Article deleted.", "info");

    renderAll();
  }

  function toggleStatus(id) {
    const article = getArticle(id);

    if (!article) return;

    article.status =
      article.status === "draft"
        ? "published"
        : "draft";

    article.updatedAt = new Date().toISOString();

    saveArticles();

    toast(
      article.status === "published"
        ? "Article published."
        : "Article moved to drafts.",
      "info"
    );

    renderAll();
  }

  function toggleFeatured(id) {
    const article = getArticle(id);

    if (!article) return;

    article.featured = !article.featured;

    saveArticles();

    toast(
      article.featured
        ? "Article featured."
        : "Article removed from featured.",
      "info"
    );

    renderAll();
  }

  function togglePinned(id) {
    const article = getArticle(id);

    if (!article) return;

    articles.forEach(item => {
      item.pinned = false;
    });

    article.pinned = true;

    saveArticles();

    renderBreakingNews();

    toast("Article pinned as breaking news.");
  }

  /* =========================================================
     IMPORT / EXPORT
     ========================================================= */

  function exportData() {
    const data = {
      version: 4,
      exportedAt: new Date().toISOString(),
      articles,
      likes,
      bookmarks,
      comments,
      subscribers,
      notifications,
      searches,
      settings
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `vimbuzz-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    toast("Backup exported successfully.");
  }

  function importData(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      try {
        const data = JSON.parse(
          event.target.result
        );

        if (
          !data ||
          !Array.isArray(data.articles)
        ) {
          throw new Error("Invalid backup");
        }

        articles = data.articles;
        likes = data.likes || {};
        bookmarks = data.bookmarks || [];
        comments = data.comments || {};
        subscribers = data.subscribers || [];
        notifications = data.notifications || [];
        searches = data.searches || [];
        settings = data.settings || settings;

        saveArticles();
        saveLikes();
        saveBookmarks();
        saveComments();
        saveSubscribers();
        saveNotifications();
        saveSearches();
        saveSettings();

        applySettings();
        renderAll();

        toast("Backup imported successfully.");
      } catch (error) {
        console.error(error);
        toast(
          "Invalid VimBuzz backup file.",
          "error"
        );
      }
    };

    reader.readAsText(file);
  }

  /* =========================================================
     DARK MODE
     ========================================================= */

  function applyDarkMode() {
    document.body.classList.toggle(
      "dark-mode",
      !!settings.darkMode
    );

    const button = $("#darkModeBtn");

    if (button) {
      button.innerHTML = settings.darkMode
        ? "☀️"
        : "🌙";

      button.setAttribute(
        "aria-label",
        settings.darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }
  }

  function toggleDarkMode() {
    settings.darkMode = !settings.darkMode;

    saveSettings();
    applyDarkMode();

    toast(
      settings.darkMode
        ? "Dark mode enabled."
        : "Light mode enabled.",
      "info"
    );
  }

  /* =========================================================
     READING MODE
     ========================================================= */

  function applyReadingMode() {
    document.body.classList.toggle(
      "reading-mode",
      !!settings.readingMode
    );
  }

  function toggleReadingMode() {
    settings.readingMode = !settings.readingMode;

    saveSettings();
    applyReadingMode();

    toast(
      settings.readingMode
        ? "Reading mode enabled."
        : "Reading mode disabled.",
      "info"
    );
  }

  /* =========================================================
     FONT SIZE
     ========================================================= */

  function applyFontSize() {
    document.documentElement.dataset.fontSize =
      settings.fontSize || "normal";
  }

  function changeFontSize(value) {
    const sizes = [
      "small",
      "normal",
      "large",
      "xlarge"
    ];

    if (!sizes.includes(value)) return;

    settings.fontSize = value;

    saveSettings();
    applyFontSize();
  }

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  function setupMobileMenu() {
    const menuBtn = $("#menuBtn");
    const mobileNav = $("#mobileNav");

    if (!menuBtn || !mobileNav) return;

    menuBtn.addEventListener("click", event => {
      event.stopPropagation();

      mobileNav.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        mobileNav.classList.contains("open")
      );
    });

    $$(".mobile-nav a", mobileNav).forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });
  }

  /* =========================================================
     SEARCH UI
     ========================================================= */

  function setupSearch() {
    const searchBtn = $("#searchBtn");
    const searchBox = $("#searchBox");
    const searchForm = $("#searchForm");
    const searchInput = $("#searchInput");

    if (searchBtn && searchBox) {
      searchBtn.addEventListener("click", () => {
        searchBox.classList.toggle("open");

        if (searchBox.classList.contains("open")) {
          searchInput?.focus();
        }
      });
    }

    if (searchForm) {
      searchForm.addEventListener(
        "submit",
        event => {
          event.preventDefault();

          performSearch(
            searchInput?.value || ""
          );
        }
      );
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        renderSearchSuggestions(
          searchInput.value
        );
      });
    }
  }

  /* =========================================================
     NAVIGATION
     ========================================================= */

  function setupNavigation() {
    $$("[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;

        const sectionId =
          category === "News"
            ? "news"
            : category.toLowerCase();

        document
          .getElementById(sectionId)
          ?.scrollIntoView({
            behavior: "smooth"
          });
      });
    });

    $$('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = $(href);

        if (target) {
          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  /* =========================================================
     GLOBAL CLICK HANDLER
     ========================================================= */

  function setupGlobalClicks() {
    document.addEventListener("click", event => {
      const openButton =
        event.target.closest(
          "[data-open-article]"
        );

      if (openButton) {
        const id =
          openButton.dataset.openArticle;

        if (id) {
          openArticle(id);
          return;
        }
      }

      const likeButton =
        event.target.closest(
          "[data-like]"
        );

      if (likeButton) {
        toggleLike(
          likeButton.dataset.like
        );
        return;
      }

      const bookmarkButton =
        event.target.closest(
          "[data-bookmark]"
        );

      if (bookmarkButton) {
        toggleBookmark(
          bookmarkButton.dataset.bookmark
        );
        return;
      }

      const removeBookmark =
        event.target.closest(
          "[data-remove-bookmark]"
        );

      if (removeBookmark) {
        toggleBookmark(
          removeBookmark.dataset.removeBookmark
        );
        return;
      }

      const commentLike =
        event.target.closest(
          "[data-comment-like]"
        );

      if (commentLike) {
        likeComment(
          commentLike.dataset.commentLike
        );
        return;
      }

      const suggestion =
        event.target.closest(
          "[data-search-suggestion]"
        );

      if (suggestion) {
        const value =
          suggestion.dataset.searchSuggestion;

        const input = $("#searchInput");

        if (input) input.value = value;

        performSearch(value);
        return;
      }

      const edit =
        event.target.closest(
          "[data-edit-article]"
        );

      if (edit) {
        const article = getArticle(
          edit.dataset.editArticle
        );

        if (article) openEditor(article);

        return;
      }

      const del =
        event.target.closest(
          "[data-delete-article]"
        );

      if (del) {
        deleteArticle(
          del.dataset.deleteArticle
        );
        return;
      }

      const status =
        event.target.closest(
          "[data-toggle-status]"
        );

      if (status) {
        toggleStatus(
          status.dataset.toggleStatus
        );
        return;
      }

      const feature =
        event.target.closest(
          "[data-toggle-featured]"
        );

      if (feature) {
        toggleFeatured(
          feature.dataset.toggleFeatured
        );
        return;
      }

      const pin =
        event.target.closest(
          "[data-pin-article]"
        );

      if (pin) {
        togglePinned(
          pin.dataset.pinArticle
        );
        return;
      }
    });
  }

  /* =========================================================
     MODAL EVENTS
     ========================================================= */

  function setupModal() {
    const modal = $("#articleModal");
    const close = $("#closeModal");
    const overlay = $("#modalOverlay");

    close?.addEventListener(
      "click",
      closeArticle
    );

    overlay?.addEventListener(
      "click",
      closeArticle
    );

    modal?.addEventListener(
      "scroll",
      updateReadingProgress
    );

    const dialog = $(".modal-dialog", modal);

    dialog?.addEventListener(
      "scroll",
      updateReadingProgress
    );

    $("#likeArticleBtn")?.addEventListener(
      "click",
      () => {
        if (currentArticleId)
          toggleLike(currentArticleId);
      }
    );

    $("#bookmarkArticleBtn")?.addEventListener(
      "click",
      () => {
        if (currentArticleId)
          toggleBookmark(currentArticleId);
      }
    );

    $("#copyArticleBtn")?.addEventListener(
      "click",
      copyArticleLink
    );

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
      nativeShare
    );

    $("#readArticleBtn")?.addEventListener(
      "click",
      startSpeech
    );

    $("#stopReadingBtn")?.addEventListener(
      "click",
      stopSpeech
    );

    $("#commentForm")?.addEventListener(
      "submit",
      submitComment
    );
  }

  /* =========================================================
     DASHBOARD EVENTS
     ========================================================= */

  function setupDashboard() {
    $("#newArticleBtn")?.addEventListener(
      "click",
      () => openEditor()
    );

    $("#closeEditorBtn")?.addEventListener(
      "click",
      closeEditor
    );

    $("#cancelEditorBtn")?.addEventListener(
      "click",
      closeEditor
    );

    $("#articleForm")?.addEventListener(
      "submit",
      saveArticleFromForm
    );

    $("#exportBtn")?.addEventListener(
      "click",
      exportData
    );

    $("#importFile")?.addEventListener(
      "change",
      event => {
        importData(event.target.files[0]);
        event.target.value = "";
      }
    );
  }

  /* =========================================================
     SAVED EVENTS
     ========================================================= */

  function setupSaved() {
    createSavedButton();

    $("#savedBtn")?.addEventListener(
      "click",
      openSavedPanel
    );

    $("#closeSavedBtn")?.addEventListener(
      "click",
      closeSavedPanel
    );

    $("#savedOverlay")?.addEventListener(
      "click",
      closeSavedPanel
    );
  }

  /* =========================================================
     BREAKING CLOSE
     ========================================================= */

  function setupBreaking() {
    $("#breakingClose")?.addEventListener(
      "click",
      () => {
        const bar = $("#breakingBar");

        if (bar) bar.hidden = true;
      }
    );
  }

  /* =========================================================
     SETTINGS PANEL
     ========================================================= */

  function setupSettings() {
    $$("[data-font-size]").forEach(button => {
      button.addEventListener("click", () => {
        changeFontSize(
          button.dataset.fontSize
        );
      });
    });

    $("[data-reading-mode]")?.addEventListener(
      "click",
      toggleReadingMode
    );
  }

  /* =========================================================
     SCROLL TOP
     ========================================================= */

  function setupScrollTop() {
    const button = $("#scrollTop");

    if (!button) return;

    window.addEventListener(
      "scroll",
      () => {
        button.classList.toggle(
          "show",
          window.scrollY > 500
        );
      },
      { passive: true }
    );

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* =========================================================
     NEWSLETTER
     ========================================================= */

  function setupNewsletter() {
    $("#newsletterForm")?.addEventListener(
      "submit",
      subscribeNewsletter
    );
  }

  /* =========================================================
     DARK MODE BUTTON
     ========================================================= */

  function setupDarkMode() {
    $("#darkModeBtn")?.addEventListener(
      "click",
      toggleDarkMode
    );
  }

  /* =========================================================
     KEYBOARD
     ========================================================= */

  function setupKeyboard() {
    document.addEventListener(
      "keydown",
      event => {
        if (event.key === "Escape") {
          closeArticle();
          closeSavedPanel();

          const mobileNav = $("#mobileNav");

          if (mobileNav) {
            mobileNav.classList.remove(
              "open"
            );
          }
        }

        if (
          event.key === "/" &&
          !["INPUT", "TEXTAREA"].includes(
            document.activeElement?.tagName
          )
        ) {
          event.preventDefault();

          $("#searchBox")?.classList.add(
            "open"
          );

          $("#searchInput")?.focus();
        }
      }
    );
  }

  /* =========================================================
     ONLINE / OFFLINE
     ========================================================= */

  function setupConnectionStatus() {
    function update() {
      const status = $("#connectionStatus");

      if (!status) return;

      status.textContent = navigator.onLine
        ? "Online"
        : "Offline";

      status.classList.toggle(
        "offline",
        !navigator.onLine
      );
    }

    window.addEventListener(
      "online",
      () => {
        update();
        toast("You're back online.");
      }
    );

    window.addEventListener(
      "offline",
      () => {
        update();
        toast(
          "You're offline. VimBuzz is still available locally.",
          "info"
        );
      }
    );

    update();
  }

  /* =========================================================
     IMAGE FALLBACK
     ========================================================= */

  function setupImages() {
    document.addEventListener(
      "error",
      event => {
        if (
          event.target.tagName === "IMG" &&
          !event.target.dataset.fallback
        ) {
          event.target.dataset.fallback = "true";

          event.target.src =
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80";
        }
      },
      true
    );
  }

  /* =========================================================
     PWA
     ========================================================= */

  async function setupPWA() {
    if (!("serviceWorker" in navigator)) return;

    try {
      await navigator.serviceWorker.register(
        "sw.js"
      );
    } catch (error) {
      console.log(
        "PWA service worker not available yet."
      );
    }
  }

  /* =========================================================
     PAGE LOADER
     ========================================================= */

  function hideLoader() {
    const loader = $(".page-loader");

    if (!loader) return;

    loader.classList.add("hidden");

    setTimeout(() => {
      loader.remove();
    }, 600);
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

    $$("[data-current-year]").forEach(el => {
      el.textContent =
        new Date().getFullYear();
    });
  }

  /* =========================================================
     ACTIVE NAV
     ========================================================= */

  function setupActiveNavigation() {
    const sections = $$(
      "main section[id]"
    );

    const links = $$(
      '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
    );

    if (!sections.length || !links.length)
      return;

    const observer =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting)
              return;

            links.forEach(link => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                  `#${entry.target.id}`
              );
            });
          });
        },
        {
          rootMargin:
            "-100px 0px -60% 0px"
        }
      );

    sections.forEach(section =>
      observer.observe(section)
    );
  }

  /* =========================================================
     ARTICLE URL
     ========================================================= */

  function checkArticleURL() {
    const params = new URLSearchParams(
      location.search
    );

    const id = params.get("article");

    if (!id) return;

    setTimeout(() => {
      openArticle(id);
    }, 300);
  }

  /* =========================================================
     RENDER ALL
     ========================================================= */

  function renderAll() {
    renderBreakingNews();
    renderTrending();
    renderHero();
    renderLatest();
    renderMostRead();

    renderCategory(
      "Sports",
      "#sportsArticles"
    );

    renderCategory(
      "Entertainment",
      "#entertainmentArticles"
    );

    renderCategory(
      "Technology",
      "#technologyArticles"
    );

    renderCategory(
      "Lifestyle",
      "#lifestyleArticles"
    );

    renderDashboard();
    renderNotifications();
    renderSavedArticles();

    updateSavedBadge();
    updateYear();
  }

  /* =========================================================
     SETTINGS
     ========================================================= */

  function applySettings() {
    applyDarkMode();
    applyReadingMode();
    applyFontSize();
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {
    console.log(
      "%cVimBuzz V4 loaded successfully.",
      "font-weight:bold;font-size:16px"
    );

    applySettings();

    setupMobileMenu();
    setupSearch();
    setupNavigation();
    setupGlobalClicks();
    setupModal();
    setupDashboard();
    setupSaved();
    setupBreaking();
    setupSettings();
    setupScrollTop();
    setupNewsletter();
    setupDarkMode();
    setupKeyboard();
    setupConnectionStatus();
    setupImages();
    setupActiveNavigation();

    renderAll();

    setupPWA();

    hideLoader();

    checkArticleURL();
  }

  /* =========================================================
     START
     ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

  /* =========================================================
     PUBLIC DEBUG API
     ========================================================= */

  window.VimBuzz = {
    getArticles: () => articles,

    addArticle(article) {
      articles.unshift({
        id: uid("article"),
        date: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        shares: 0,
        featured: false,
        trending: false,
        pinned: false,
        sponsored: false,
        status: "published",
        ...article
      });

      saveArticles();
      renderAll();

      return articles[0];
    },

    deleteArticle,

    openArticle,

    search: performSearch,

    clearData() {
      const confirmed = confirm(
        "Delete all VimBuzz local data?"
      );

      if (!confirmed) return;

      Object.values(KEYS).forEach(key =>
        localStorage.removeItem(key)
      );

      location.reload();
    }
  };
})();