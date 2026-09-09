/* =========================================================
   VIMBUZZ V2
   Frontend-only News Website
   No database • No API • LocalStorage
   ========================================================= */

"use strict";

/* =========================
   STORAGE
========================= */

const STORAGE_KEY = "vimbuzz_articles_v2";
const SUBSCRIBER_KEY = "vimbuzz_subscribers_v2";

/* =========================
   SAMPLE ARTICLES
========================= */

const DEFAULT_ARTICLES = [
    {
        id: "vb-001",
        title: "Latest Ghana News Making Headlines Today",
        category: "News",
        author: "VimBuzz",
        image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Stay updated with the latest stories, developments and important news from Ghana.",
        content: "Welcome to VimBuzz. This is your destination for the latest Ghana news, trending stories and important updates.",
        featured: true,
        trending: true,
        views: 1250,
        createdAt: "2026-09-09T08:00:00"
    },
    {
        id: "vb-002",
        title: "Ghana Football: Latest Updates and Stories",
        category: "Sports",
        author: "VimBuzz Sports",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Get the latest football news, results, transfers and stories from Ghana and around the world.",
        content: "Football fans can follow the latest updates, results, transfer stories and major football developments on VimBuzz.",
        featured: true,
        trending: true,
        views: 980,
        createdAt: "2026-09-08T15:30:00"
    },
    {
        id: "vb-003",
        title: "Entertainment Stories Trending in Ghana",
        category: "Entertainment",
        author: "VimBuzz Entertainment",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Discover trending entertainment, celebrity and showbiz stories from Ghana.",
        content: "VimBuzz brings you entertainment news, celebrity updates, music stories and the latest happenings in Ghanaian showbiz.",
        featured: true,
        trending: true,
        views: 870,
        createdAt: "2026-09-08T12:00:00"
    },
    {
        id: "vb-004",
        title: "Technology: New Digital Trends to Know",
        category: "Technology",
        author: "VimBuzz Tech",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Explore technology news, apps, AI, smartphones and digital trends.",
        content: "Technology continues to change rapidly. Follow VimBuzz for technology news, digital tools, artificial intelligence and innovation.",
        featured: false,
        trending: true,
        views: 720,
        createdAt: "2026-09-07T10:00:00"
    },
    {
        id: "vb-005",
        title: "Lifestyle: Ideas for Everyday Ghanaian Life",
        category: "Lifestyle",
        author: "VimBuzz Lifestyle",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Lifestyle stories, useful ideas, food, travel and everyday inspiration.",
        content: "Explore lifestyle stories covering food, travel, fashion, relationships, personal development and everyday life.",
        featured: false,
        trending: false,
        views: 650,
        createdAt: "2026-09-06T09:00:00"
    },
    {
        id: "vb-006",
        title: "What Ghanaians Are Talking About Today",
        category: "News",
        author: "VimBuzz",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
        excerpt: "Here are some of the stories and conversations currently getting attention.",
        content: "VimBuzz brings together important stories and conversations happening across Ghana.",
        featured: false,
        trending: true,
        views: 540,
        createdAt: "2026-09-05T11:00:00"
    }
];

/* =========================
   HELPERS
========================= */

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getArticles() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(DEFAULT_ARTICLES)
            );

            return [...DEFAULT_ARTICLES];
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(DEFAULT_ARTICLES)
            );

            return [...DEFAULT_ARTICLES];
        }

        return parsed;
    } catch (error) {
        console.error("VimBuzz storage error:", error);
        return [...DEFAULT_ARTICLES];
    }
}

function saveArticles(articles) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(articles)
    );
}

function formatDate(date) {
    if (!date) return "Recently";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "Recently";

    return d.toLocaleDateString("en-GH", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatViews(number) {
    number = Number(number) || 0;

    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
    }

    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    }

    return number.toString();
}

function getArticle(id) {
    return getArticles().find(
        article => String(article.id) === String(id)
    );
}

function sortNewest(articles) {
    return [...articles].sort(
        (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
    );
}

/* =========================
   IMAGE FALLBACK
========================= */

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";

function imageHTML(article, className = "article-image") {
    return `
        <img
            class="${className}"
            src="${escapeHTML(article.image || FALLBACK_IMAGE)}"
            alt="${escapeHTML(article.title)}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
        >
    `;
}

/* =========================
   ARTICLE CARD
========================= */

function articleCard(article) {
    return `
        <article
            class="article-card"
            data-article-id="${escapeHTML(article.id)}"
            tabindex="0"
        >
            <div class="article-image-wrap">
                ${imageHTML(article)}
                <span class="category-tag">
                    ${escapeHTML(article.category)}
                </span>
            </div>

            <div class="article-card-content">

                <div class="article-meta">
                    <span>${formatDate(article.createdAt)}</span>
                    <span>•</span>
                    <span>${formatViews(article.views)} views</span>
                </div>

                <h3>
                    ${escapeHTML(article.title)}
                </h3>

                <p class="article-excerpt">
                    ${escapeHTML(article.excerpt)}
                </p>

                <div class="card-footer">
                    <span>
                        ${escapeHTML(article.author || "VimBuzz")}
                    </span>

                    <span class="read-more">
                        Read →
                    </span>
                </div>

            </div>
        </article>
    `;
}

/* =========================
   HERO
========================= */

function renderHero() {
    const container = $("#heroGrid");

    if (!container) return;

    const articles = sortNewest(getArticles());

    const featured =
        articles.filter(a => a.featured).slice(0, 1);

    const main =
        featured[0] ||
        articles[0];

    const side =
        articles
            .filter(a => a.id !== main?.id)
            .slice(0, 2);

    if (!main) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <article
            class="hero-main"
            data-article-id="${escapeHTML(main.id)}"
            tabindex="0"
        >
            ${imageHTML(main)}

            <div class="hero-overlay"></div>

            <div class="hero-content">

                <span class="category-tag">
                    ${escapeHTML(main.category)}
                </span>

                <h1>
                    ${escapeHTML(main.title)}
                </h1>

                <p>
                    ${escapeHTML(main.excerpt)}
                </p>

                <div class="article-meta">
                    <span>${formatDate(main.createdAt)}</span>
                    <span>•</span>
                    <span>${formatViews(main.views)} views</span>
                </div>

            </div>
        </article>

        <div class="hero-side">
            ${side.map(article => `
                <article
                    class="hero-side-card"
                    data-article-id="${escapeHTML(article.id)}"
                    tabindex="0"
                >
                    ${imageHTML(article)}

                    <div class="hero-side-card-content">
                        <span class="category-tag">
                            ${escapeHTML(article.category)}
                        </span>

                        <h3>
                            ${escapeHTML(article.title)}
                        </h3>

                        <div class="article-meta">
                            ${formatDate(article.createdAt)}
                        </div>
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

/* =========================
   LATEST
========================= */

function renderLatest() {
    const container = $("#latestArticles");

    if (!container) return;

    const articles = sortNewest(getArticles())
        .slice(0, 6);

    if (!articles.length) {
        container.innerHTML =
            `<p class="empty-state">No articles available yet.</p>`;
        return;
    }

    container.innerHTML =
        articles.map(articleCard).join("");
}

/* =========================
   CATEGORY
========================= */

function renderCategory(category, elementId) {
    const container = $("#" + elementId);

    if (!container) return;

    const articles = sortNewest(getArticles())
        .filter(article =>
            article.category.toLowerCase() ===
            category.toLowerCase()
        )
        .slice(0, 4);

    if (!articles.length) {
        container.innerHTML = `
            <div class="empty-state">
                No ${escapeHTML(category)} articles yet.
            </div>
        `;
        return;
    }

    container.innerHTML =
        articles.map(articleCard).join("");
}

/* =========================
   MOST READ
========================= */

function renderMostRead() {
    const container = $("#mostRead");

    if (!container) return;

    const articles = [...getArticles()]
        .sort(
            (a, b) =>
                (Number(b.views) || 0) -
                (Number(a.views) || 0)
        )
        .slice(0, 5);

    if (!articles.length) {
        container.innerHTML =
            `<p class="empty-state">No popular articles yet.</p>`;
        return;
    }

    container.innerHTML = articles
        .map((article, index) => `
            <article
                class="most-read-item"
                data-article-id="${escapeHTML(article.id)}"
                tabindex="0"
            >
                <span class="most-read-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <div>
                    <span class="category-tag">
                        ${escapeHTML(article.category)}
                    </span>

                    <h3>
                        ${escapeHTML(article.title)}
                    </h3>

                    <div class="article-meta">
                        ${formatViews(article.views)} views
                    </div>
                </div>
            </article>
        `)
        .join("");
}

/* =========================
   TRENDING
========================= */

function renderTrending() {
    const container = $("#trendingList");

    if (!container) return;

    let articles = getArticles()
        .filter(article => article.trending);

    if (!articles.length) {
        articles = [...getArticles()]
            .sort(
                (a, b) =>
                    (Number(b.views) || 0) -
                    (Number(a.views) || 0)
            );
    }

    articles = articles.slice(0, 8);

    container.innerHTML = articles
        .map(article => `
            <button
                class="trending-item"
                type="button"
                data-article-id="${escapeHTML(article.id)}"
            >
                ${escapeHTML(article.title)}
            </button>
        `)
        .join("");
}

/* =========================
   RENDER EVERYTHING
========================= */

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
}

/* =========================
   MOBILE MENU
========================= */

function setupMobileMenu() {
    const menuButton = $("#menuBtn");
    const mobileNav = $("#mobileNav");

    if (!menuButton || !mobileNav) return;

    menuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
        menuButton.classList.toggle("active");
    });

    $all("#mobileNav a").forEach(link => {
        link.addEventListener("click", () => {
            mobileNav.classList.remove("open");
            menuButton.classList.remove("active");
        });
    });
}

/* =========================
   SEARCH
========================= */

function setupSearch() {
    const searchButton = $("#searchBtn");
    const searchBox = $("#searchBox");
    const searchForm = $("#searchForm");
    const searchInput = $("#searchInput");
    const clearButton = $("#clearSearch");

    if (searchButton && searchBox) {
        searchButton.addEventListener("click", () => {
            searchBox.classList.toggle("open");

            if (searchBox.classList.contains("open")) {
                setTimeout(() => {
                    searchInput?.focus();
                }, 100);
            }
        });
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", event => {
            event.preventDefault();

            performSearch(searchInput.value.trim());
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
            }

            performSearch("");
        });
    }
}

function performSearch(query) {
    const section = $("#searchResultsSection");
    const container = $("#searchResults");

    if (!section || !container) return;

    query = query.toLowerCase().trim();

    if (!query) {
        section.style.display = "none";
        return;
    }

    const results = getArticles().filter(article => {
        const text = `
            ${article.title}
            ${article.category}
            ${article.author}
            ${article.excerpt}
            ${article.content}
        `.toLowerCase();

        return text.includes(query);
    });

    section.style.display = "block";

    if (!results.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No results found</h3>
                <p>Try another search.</p>
            </div>
        `;
        return;
    }

    container.innerHTML =
        sortNewest(results)
            .map(articleCard)
            .join("");

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================
   ARTICLE MODAL
========================= */

function openArticle(id) {
    const article = getArticle(id);

    if (!article) return;

    /* Increase views */
    const articles = getArticles();

    const index = articles.findIndex(
        a => String(a.id) === String(id)
    );

    if (index !== -1) {
        articles[index].views =
            (Number(articles[index].views) || 0) + 1;

        saveArticles(articles);

        article.views = articles[index].views;
    }

    const modal = $("#articleModal");

    if (!modal) return;

    const modalImage = $("#modalImage");
    const modalCategory = $("#modalCategory");
    const modalDate = $("#modalDate");
    const modalTitle = $("#modalTitle");
    const modalAuthor = $("#modalAuthor");
    const modalExcerpt = $("#modalExcerpt");
    const modalBody = $("#modalBody");

    if (modalImage) {
        modalImage.src =
            article.image || FALLBACK_IMAGE;

        modalImage.alt = article.title;

        modalImage.onerror = function () {
            this.onerror = null;
            this.src = FALLBACK_IMAGE;
        };
    }

    if (modalCategory) {
        modalCategory.textContent =
            article.category;
    }

    if (modalDate) {
        modalDate.textContent =
            `${formatDate(article.createdAt)} • ${formatViews(article.views)} views`;
    }

    if (modalTitle) {
        modalTitle.textContent =
            article.title;
    }

    if (modalAuthor) {
        modalAuthor.textContent =
            `By ${article.author || "VimBuzz"}`;
    }

    if (modalExcerpt) {
        modalExcerpt.textContent =
            article.excerpt || "";
    }

    if (modalBody) {
        modalBody.textContent =
            article.content || article.excerpt || "";
    }

    modal.dataset.currentArticle =
        article.id;

    modal.classList.add("open");
    document.body.classList.add("modal-open");

    renderMostRead();
}

function closeArticle() {
    const modal = $("#articleModal");

    if (!modal) return;

    modal.classList.remove("open");
    document.body.classList.remove("modal-open");

    delete modal.dataset.currentArticle;
}

/* =========================
   SHARING
========================= */

function getShareURL() {
    const modal = $("#articleModal");

    const id =
        modal?.dataset.currentArticle;

    if (!id) {
        return window.location.href;
    }

    return `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(id)}`;
}

function setupSharing() {
    const whatsapp = $("#shareWhatsApp");
    const facebook = $("#shareFacebook");
    const native = $("#shareNative");

    if (whatsapp) {
        whatsapp.addEventListener("click", () => {
            const modal = $("#articleModal");
            const article = getArticle(
                modal?.dataset.currentArticle
            );

            if (!article) return;

            const text =
                `${article.title}\n\nRead more on VimBuzz`;

            const url =
                `https://wa.me/?text=${encodeURIComponent(
                    text + "\n" + getShareURL()
                )}`;

            window.open(url, "_blank");
        });
    }

    if (facebook) {
        facebook.addEventListener("click", () => {
            const url =
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    getShareURL()
                )}`;

            window.open(
                url,
                "_blank",
                "width=600,height=500"
            );
        });
    }

    if (native) {
        native.addEventListener("click", async () => {
            const modal = $("#articleModal");

            const article = getArticle(
                modal?.dataset.currentArticle
            );

            if (!article) return;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: article.title,
                        text: article.excerpt,
                        url: getShareURL()
                    });
                } catch (error) {
                    console.log("Share cancelled.");
                }
            } else {
                try {
                    await navigator.clipboard.writeText(
                        getShareURL()
                    );

                    showToast(
                        "Article link copied!"
                    );
                } catch {
                    showToast(
                        "Sharing is not supported on this browser."
                    );
                }
            }
        });
    }
}

/* =========================
   EDITOR
========================= */

function openEditor(article = null) {
    const editor = $("#articleEditor");

    if (!editor) return;

    editor.style.display = "block";

    const form = $("#articleForm");

    if (!form) return;

    if (article) {
        $("#editorTitle").textContent =
            "Edit Article";

        $("#articleId").value =
            article.id;

        $("#articleTitle").value =
            article.title || "";

        $("#articleCategory").value =
            article.category || "News";

        $("#articleAuthor").value =
            article.author || "";

        $("#articleImage").value =
            article.image || "";

        $("#articleExcerpt").value =
            article.excerpt || "";

        $("#articleContent").value =
            article.content || "";

        $("#articleFeatured").checked =
            !!article.featured;

        $("#articleTrending").checked =
            !!article.trending;
    } else {
        $("#editorTitle").textContent =
            "Create New Article";

        form.reset();

        $("#articleId").value = "";
    }

    editor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function closeEditor() {
    const editor = $("#articleEditor");

    if (!editor) return;

    editor.style.display = "none";

    const form = $("#articleForm");

    if (form) {
        form.reset();
    }

    const id = $("#articleId");

    if (id) {
        id.value = "";
    }
}

function setupEditor() {
    const newButton = $("#newArticleBtn");
    const closeButton = $("#closeEditorBtn");
    const cancelButton = $("#cancelEditorBtn");
    const form = $("#articleForm");

    if (newButton) {
        newButton.addEventListener(
            "click",
            () => openEditor()
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeEditor
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeEditor
        );
    }

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const title =
            $("#articleTitle")?.value.trim();

        const category =
            $("#articleCategory")?.value;

        const author =
            $("#articleAuthor")?.value.trim();

        const image =
            $("#articleImage")?.value.trim();

        const excerpt =
            $("#articleExcerpt")?.value.trim();

        const content =
            $("#articleContent")?.value.trim();

        if (!title || !excerpt || !content) {
            showToast(
                "Please fill in the required fields."
            );

            return;
        }

        const articleId =
            $("#articleId")?.value;

        const articles = getArticles();

        if (articleId) {
            const index = articles.findIndex(
                article =>
                    String(article.id) ===
                    String(articleId)
            );

            if (index !== -1) {
                articles[index] = {
                    ...articles[index],
                    title,
                    category,
                    author: author || "VimBuzz",
                    image: image || FALLBACK_IMAGE,
                    excerpt,
                    content,
                    featured:
                        $("#articleFeatured")?.checked || false,
                    trending:
                        $("#articleTrending")?.checked || false
                };

                saveArticles(articles);

                showToast(
                    "Article updated successfully!"
                );
            }
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
                author: author || "VimBuzz",
                image: image || FALLBACK_IMAGE,
                excerpt,
                content,
                featured:
                    $("#articleFeatured")?.checked || false,
                trending:
                    $("#articleTrending")?.checked || false,
                views: 0,
                createdAt:
                    new Date().toISOString()
            };

            articles.unshift(newArticle);

            saveArticles(articles);

            showToast(
                "Article published successfully!"
            );
        }

        closeEditor();
        renderAll();
    });
}

/* =========================
   ADMIN ARTICLE LIST
========================= */

function renderAdminArticles() {
    const container = $("#adminArticlesList");
    const count = $("#articleCount");

    if (!container) return;

    const articles = sortNewest(getArticles());

    if (count) {
        count.textContent =
            `${articles.length} article${articles.length === 1 ? "" : "s"}`;
    }

    if (!articles.length) {
        container.innerHTML =
            `<p class="empty-state">No articles yet.</p>`;

        return;
    }

    container.innerHTML = articles
        .map(article => `
            <div
                class="admin-article"
                data-admin-id="${escapeHTML(article.id)}"
            >
                <img
                    class="admin-article-image"
                    src="${escapeHTML(article.image || FALLBACK_IMAGE)}"
                    alt=""
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >

                <div class="admin-article-info">
                    <strong>
                        ${escapeHTML(article.title)}
                    </strong>

                    <span>
                        ${escapeHTML(article.category)}
                    </span>

                    <small>
                        ${formatDate(article.createdAt)}
                        •
                        ${formatViews(article.views)} views
                    </small>
                </div>

                <div class="admin-actions">

                    <button
                        class="admin-action-btn"
                        type="button"
                        data-edit-id="${escapeHTML(article.id)}"
                    >
                        Edit
                    </button>

                    <button
                        class="admin-action-btn admin-delete"
                        type="button"
                        data-delete-id="${escapeHTML(article.id)}"
                    >
                        Delete
                    </button>

                </div>
            </div>
        `)
        .join("");
}

function deleteArticle(id) {
    const article = getArticle(id);

    if (!article) return;

    const confirmed = confirm(
        `Delete "${article.title}"?`
    );

    if (!confirmed) return;

    const articles =
        getArticles().filter(
            item =>
                String(item.id) !== String(id)
        );

    saveArticles(articles);

    renderAll();

    showToast(
        "Article deleted."
    );
}

/* =========================
   NEWSLETTER
========================= */

function setupNewsletter() {
    const form = $("#newsletterForm");
    const input = $("#newsletterEmail");
    const message = $("#newsletterMessage");

    if (!form || !input) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email =
            input.value.trim().toLowerCase();

        if (!email || !email.includes("@")) {
            if (message) {
                message.textContent =
                    "Enter a valid email address.";
            }

            return;
        }

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

        if (!subscribers.includes(email)) {
            subscribers.push(email);

            localStorage.setItem(
                SUBSCRIBER_KEY,
                JSON.stringify(subscribers)
            );

            if (message) {
                message.textContent =
                    "You're subscribed to VimBuzz!";
            }

            showToast(
                "Newsletter subscription saved."
            );
        } else {
            if (message) {
                message.textContent =
                    "You're already subscribed.";
            }
        }

        input.value = "";
    });
}

/* =========================
   GLOBAL CLICKS
========================= */

function setupGlobalEvents() {
    document.addEventListener("click", event => {

        /* Article */
        const articleTarget =
            event.target.closest(
                "[data-article-id]"
            );

        if (
            articleTarget &&
            !event.target.closest("button")
        ) {
            const id =
                articleTarget.dataset.articleId;

            openArticle(id);

            return;
        }

        /* Trending */
        const trending =
            event.target.closest(
                ".trending-item[data-article-id]"
            );

        if (trending) {
            openArticle(
                trending.dataset.articleId
            );

            return;
        }

        /* Edit */
        const edit =
            event.target.closest(
                "[data-edit-id]"
            );

        if (edit) {
            const article =
                getArticle(
                    edit.dataset.editId
                );

            if (article) {
                openEditor(article);
            }

            return;
        }

        /* Delete */
        const remove =
            event.target.closest(
                "[data-delete-id]"
            );

        if (remove) {
            deleteArticle(
                remove.dataset.deleteId
            );

            return;
        }
    });
}

/* =========================
   MODAL EVENTS
========================= */

function setupModal() {
    const modal = $("#articleModal");
    const overlay = $("#modalOverlay");
    const closeButton = $("#closeModal");

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeArticle
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeArticle
        );
    }

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeArticle();
            }

            if (
                event.key === "Enter" &&
                event.target.matches(
                    "[data-article-id]"
                )
            ) {
                openArticle(
                    event.target.dataset.articleId
                );
            }
        }
    );
}

/* =========================
   CATEGORY NAVIGATION
========================= */

function setupCategoryLinks() {
    const mapping = {
        news: "latestArticles",
        sports: "sportsArticles",
        entertainment: "entertainmentArticles",
        technology: "technologyArticles",
        lifestyle: "lifestyleArticles"
    };

    $all(
        "a[href], button[data-category]"
    ).forEach(element => {
        element.addEventListener("click", event => {

            const category =
                element.dataset.category ||
                element.getAttribute("href");

            if (!category) return;

            const clean =
                category
                    .replace("#", "")
                    .replace("/", "")
                    .toLowerCase();

            if (!mapping[clean]) return;

            const target =
                document.getElementById(
                    mapping[clean]
                );

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

/* =========================
   EXPORT / IMPORT
========================= */

function setupImportExport() {
    const exportButton = $("#exportBtn");
    const importInput = $("#importFile");

    if (exportButton) {
        exportButton.addEventListener(
            "click",
            () => {
                const articles =
                    getArticles();

                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                articles,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                                "application/json"
                        }
                    );

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement("a");

                link.href = url;

                link.download =
                    "vimbuzz-articles.json";

                document.body.appendChild(link);

                link.click();

                link.remove();

                URL.revokeObjectURL(url);

                showToast(
                    "Articles exported."
                );
            }
        );
    }

    if (importInput) {
        importInput.addEventListener(
            "change",
            event => {
                const file =
                    event.target.files[0];

                if (!file) return;

                const reader =
                    new FileReader();

                reader.onload = () => {
                    try {
                        const imported =
                            JSON.parse(
                                reader.result
                            );

                        if (
                            !Array.isArray(
                                imported
                            )
                        ) {
                            throw new Error(
                                "Invalid file"
                            );
                        }

                        const confirmed =
                            confirm(
                                "Import these articles and replace your current articles?"
                            );

                        if (!confirmed) {
                            return;
                        }

                        saveArticles(
                            imported
                        );

                        renderAll();

                        showToast(
                            "Articles imported."
                        );

                    } catch (error) {
                        console.error(
                            error
                        );

                        showToast(
                            "Invalid JSON file."
                        );
                    }

                    importInput.value = "";
                };

                reader.readAsText(file);
            }
        );
    }
}

/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message) {
    const toast = $("#toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* =========================
   SCROLL TOP
========================= */

function setupScrollTop() {
    const button = $("#scrollTop");

    if (!button) return;

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY > 500) {
                button.classList.add("show");
            } else {
                button.classList.remove("show");
            }
        }
    );

    button.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
}

/* =========================
   YEAR
========================= */

function setupYear() {
    const year = $("#currentYear");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }
}

/* =========================
   URL ARTICLE
========================= */

function openArticleFromURL() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    const articleId =
        params.get("article");

    if (!articleId) return;

    setTimeout(() => {
        openArticle(articleId);
    }, 300);
}

/* =========================
   ONLINE / OFFLINE
========================= */

function setupConnectionStatus() {
    window.addEventListener(
        "offline",
        () => {
            showToast(
                "You are offline. VimBuzz is still available."
            );
        }
    );

    window.addEventListener(
        "online",
        () => {
            showToast(
                "You are back online."
            );
        }
    );
}

/* =========================
   DEBUG TOOLS
========================= */

window.VimBuzz = {
    getArticles,
    saveArticles,
    renderAll,

    reset: function () {
        localStorage.removeItem(
            STORAGE_KEY
        );

        location.reload();
    },

    clear: function () {
        localStorage.removeItem(
            STORAGE_KEY
        );

        renderAll();

        showToast(
            "Articles cleared."
        );
    }
};

/* =========================
   START APP
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "VimBuzz V2 starting..."
        );

        /* Make sure sample articles exist */
        getArticles();

        /* Render immediately */
        renderAll();

        /* Features */
        setupMobileMenu();
        setupSearch();
        setupEditor();
        setupGlobalEvents();
        setupModal();
        setupSharing();
        setupNewsletter();
        setupCategoryLinks();
        setupImportExport();
        setupScrollTop();
        setupYear();
        setupConnectionStatus();

        /* URL article */
        openArticleFromURL();

        console.log(
            "VimBuzz V2 loaded successfully."
        );
    }
);
