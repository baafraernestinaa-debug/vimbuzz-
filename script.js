/* =========================================================
   VIMBUZZ V1
   Complete Frontend JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  const searchBtn = document.getElementById("searchBtn");
  const searchPanel = document.getElementById("searchPanel");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");

  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const currentYear = document.getElementById("currentYear");

  const articleCards = Array.from(
    document.querySelectorAll(".article-card")
  );

  const navLinks = Array.from(
    document.querySelectorAll(".desktop-nav a, .mobile-nav a")
  );


  /* =======================================================
     DYNAMIC YEAR
     ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  if (menuBtn && mobileNav) {

    menuBtn.addEventListener("click", () => {

      mobileNav.classList.toggle("show");

      const isOpen = mobileNav.classList.contains("show");

      menuBtn.setAttribute("aria-expanded", isOpen);

      menuBtn.textContent = isOpen ? "✕" : "☰";

    });


    // Close mobile menu after clicking a link
    const mobileLinks = mobileNav.querySelectorAll("a");

    mobileLinks.forEach(link => {

      link.addEventListener("click", () => {

        mobileNav.classList.remove("show");

        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.textContent = "☰";

      });

    });

  }


  /* =======================================================
     SEARCH PANEL
     ======================================================= */

  if (searchBtn && searchPanel) {

    searchBtn.addEventListener("click", () => {

      searchPanel.classList.toggle("show");

      if (searchPanel.classList.contains("show")) {

        setTimeout(() => {
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);

      } else {

        clearSearch();

      }

    });

  }


  /* =======================================================
     SEARCH FUNCTION
     ======================================================= */

  function getArticleTitle(article) {

    const titleElement = article.querySelector(
      "h1, h2, h3, h4"
    );

    return titleElement
      ? titleElement.textContent.trim()
      : "";

  }


  function getArticleCategory(article) {

    const categoryElement = article.querySelector(
      ".category-text, .category-badge"
    );

    return categoryElement
      ? categoryElement.textContent.trim()
      : "STORY";

  }


  function searchArticles(query) {

    const cleanQuery = query
      .toLowerCase()
      .trim();

    if (!searchResults) {
      return;
    }

    searchResults.innerHTML = "";

    if (!cleanQuery) {

      searchResults.innerHTML = `
        <div class="search-result">
          <span>Type something to search VimBuzz.</span>
        </div>
      `;

      return;
    }


    const matches = articleCards.filter(article => {

      const title = getArticleTitle(article).toLowerCase();

      const category = getArticleCategory(article).toLowerCase();

      const dataTitle = (
        article.dataset.title || ""
      ).toLowerCase();

      const dataCategory = (
        article.dataset.category || ""
      ).toLowerCase();

      return (
        title.includes(cleanQuery) ||
        category.includes(cleanQuery) ||
        dataTitle.includes(cleanQuery) ||
        dataCategory.includes(cleanQuery)
      );

    });


    if (matches.length === 0) {

      searchResults.innerHTML = `
        <div class="search-result">
          <strong>No stories found.</strong>
          <span>Try another keyword.</span>
        </div>
      `;

      return;
    }


    matches.slice(0, 8).forEach((article, index) => {

      const title = getArticleTitle(article);
      const category = getArticleCategory(article);

      const result = document.createElement("div");

      result.className = "search-result";

      result.innerHTML = `
        <strong>${escapeHTML(title)}</strong>
        <span>${escapeHTML(category)} · Result ${index + 1}</span>
      `;


      result.addEventListener("click", () => {

        article.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        article.style.transform = "scale(1.02)";

        setTimeout(() => {
          article.style.transform = "";
        }, 700);

      });


      searchResults.appendChild(result);

    });

  }


  if (searchForm) {

    searchForm.addEventListener("submit", event => {

      event.preventDefault();

      searchArticles(searchInput.value);

    });

  }


  if (searchInput) {

    searchInput.addEventListener("input", () => {

      searchArticles(searchInput.value);

    });

  }


  function clearSearch() {

    if (searchInput) {
      searchInput.value = "";
    }

    if (searchResults) {
      searchResults.innerHTML = "";
    }

  }


  /* =======================================================
     ESCAPE HTML
     ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     ARTICLE FILTERING
     ======================================================= */

  function filterArticles(category) {

    const normalizedCategory =
      category.toLowerCase().trim();


    articleCards.forEach(article => {

      const articleCategory = (
        article.dataset.category || ""
      ).toLowerCase().trim();


      if (
        !normalizedCategory ||
        normalizedCategory === "all" ||
        articleCategory === normalizedCategory
      ) {

        article.style.display = "";

      } else {

        article.style.display = "none";

      }

    });

  }


  /*
     The page currently uses navigation links to sections.
     This also allows filtering through URLs such as:

     index.html?category=sports
     index.html?category=tech
  */

  const urlParams = new URLSearchParams(
    window.location.search
  );

  const requestedCategory =
    urlParams.get("category");


  if (requestedCategory) {

    filterArticles(requestedCategory);

  }


  /* =======================================================
     CATEGORY LINK SUPPORT
     ======================================================= */

  const categoryLinks = document.querySelectorAll(
    '[data-filter]'
  );


  categoryLinks.forEach(link => {

    link.addEventListener("click", event => {

      event.preventDefault();

      const category =
        link.dataset.filter || "all";

      filterArticles(category);

      const target =
        document.querySelector("#news");

      if (target) {

        target.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  });


  /* =======================================================
     TRENDING LINKS
     ======================================================= */

  const trendingLinks =
    document.querySelectorAll(".trending-list a");


  trendingLinks.forEach(link => {

    link.addEventListener("click", event => {

      event.preventDefault();

      const text =
        link.textContent.toLowerCase();

      if (
        text.includes("football") ||
        text.includes("black stars") ||
        text.includes("transfer")
      ) {

        const sportsSection =
          document.querySelector("#sports");

        if (sportsSection) {

          sportsSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }

      else if (
        text.includes("music") ||
        text.includes("entertainment")
      ) {

        const entertainmentSection =
          document.querySelector("#entertainment");

        if (entertainmentSection) {

          entertainmentSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }

      else if (
        text.includes("ai") ||
        text.includes("tech")
      ) {

        const techSection =
          document.querySelector("#tech");

        if (techSection) {

          techSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }

      else {

        const newsSection =
          document.querySelector("#news");

        if (newsSection) {

          newsSection.scrollIntoView({
            behavior: "smooth"
          });

        }

      }

    });

  });


  /* =======================================================
     NEWSLETTER SIGNUP
     ======================================================= */

  const NEWSLETTER_KEY =
    "vimbuzz_newsletter_subscribers";


  function getSubscribers() {

    try {

      return JSON.parse(
        localStorage.getItem(NEWSLETTER_KEY)
      ) || [];

    } catch (error) {

      return [];

    }

  }


  function saveSubscribers(subscribers) {

    localStorage.setItem(
      NEWSLETTER_KEY,
      JSON.stringify(subscribers)
    );

  }


  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }


  if (newsletterForm) {

    newsletterForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const email =
          newsletterEmail.value
            .trim()
            .toLowerCase();


        if (!isValidEmail(email)) {

          showNewsletterMessage(
            "Please enter a valid email address."
          );

          return;

        }


        const subscribers =
          getSubscribers();


        if (subscribers.includes(email)) {

          showNewsletterMessage(
            "This email is already subscribed."
          );

          return;

        }


        subscribers.push(email);

        saveSubscribers(subscribers);


        newsletterEmail.value = "";


        showNewsletterMessage(
          "🎉 You're subscribed to VimBuzz Daily!"
        );


        console.log(
          "VimBuzz subscribers:",
          subscribers
        );

      }
    );

  }


  function showNewsletterMessage(message) {

    if (!newsletterMessage) {
      return;
    }

    newsletterMessage.textContent = message;

    setTimeout(() => {

      newsletterMessage.textContent = "";

    }, 5000);

  }


  /* =======================================================
     SCROLL TO TOP
     ======================================================= */

  function updateScrollButton() {

    if (!scrollTopBtn) {
      return;
    }


    if (window.scrollY > 500) {

      scrollTopBtn.classList.add("show");

    } else {

      scrollTopBtn.classList.remove("show");

    }

  }


  window.addEventListener(
    "scroll",
    updateScrollButton,
    { passive: true }
  );


  if (scrollTopBtn) {

    scrollTopBtn.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  updateScrollButton();


  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const sections = Array.from(
    document.querySelectorAll(
      "main section[id]"
    )
  );


  function updateActiveNavigation() {

    const scrollPosition =
      window.scrollY + 140;


    let currentSection = "home";


    sections.forEach(section => {

      const sectionTop =
        section.offsetTop;

      const sectionHeight =
        section.offsetHeight;


      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {

        currentSection =
          section.getAttribute("id");

      }

    });


    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");


      link.classList.remove("active");


      if (
        href === `#${currentSection}`
      ) {

        link.classList.add("active");

      }

    });

  }


  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );


  updateActiveNavigation();


  /* =======================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
     ======================================================= */

  document.addEventListener(
    "click",
    event => {

      if (
        searchPanel &&
        searchBtn &&
        searchPanel.classList.contains("show")
      ) {

        const clickedInsideSearch =
          searchPanel.contains(event.target);

        const clickedSearchButton =
          searchBtn.contains(event.target);


        if (
          !clickedInsideSearch &&
          !clickedSearchButton
        ) {

          searchPanel.classList.remove("show");

          clearSearch();

        }

      }

    }
  );


  /* =======================================================
     ESC KEY
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Escape") {
        return;
      }


      // Close mobile menu

      if (
        mobileNav &&
        mobileNav.classList.contains("show")
      ) {

        mobileNav.classList.remove("show");

        if (menuBtn) {

          menuBtn.textContent = "☰";

          menuBtn.setAttribute(
            "aria-expanded",
            "false"
          );

        }

      }


      // Close search

      if (
        searchPanel &&
        searchPanel.classList.contains("show")
      ) {

        searchPanel.classList.remove("show");

        clearSearch();

      }

    }
  );


  /* =======================================================
     ARTICLE CLICK EFFECT
     ======================================================= */

  articleCards.forEach(article => {

    article.addEventListener("click", event => {

      /*
        Don't interfere with real links/buttons
        if they are added later.
      */

      if (
        event.target.closest("a") ||
        event.target.closest("button")
      ) {

        return;

      }


      article.classList.add("article-selected");


      setTimeout(() => {

        article.classList.remove(
          "article-selected"
        );

      }, 500);

    });

  });


  /* =======================================================
     VIEW ALL BUTTONS
     ======================================================= */

  const viewAllLinks =
    document.querySelectorAll(".view-all");


  viewAllLinks.forEach(link => {

    link.addEventListener("click", event => {

      const href =
        link.getAttribute("href");


      if (
        !href ||
        href === "#"
      ) {

        event.preventDefault();

        const parentSection =
          link.closest("section");


        if (parentSection) {

          const cards =
            parentSection.querySelectorAll(
              ".article-card"
            );


          cards.forEach(card => {

            card.style.display = "";

          });

        }

      }

    });

  });


  /* =======================================================
     SMOOTH INTERNAL LINKS
     ======================================================= */

  const internalLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  internalLinks.forEach(link => {

    link.addEventListener("click", event => {

      const href =
        link.getAttribute("href");


      if (
        !href ||
        href === "#"
      ) {

        return;

      }


      const target =
        document.querySelector(href);


      if (!target) {
        return;
      }


      event.preventDefault();


      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     IMAGE ERROR FALLBACK
     ======================================================= */

  const images =
    document.querySelectorAll("img");


  images.forEach(img => {

    img.addEventListener("error", () => {

      img.style.display = "none";

      const parent =
        img.parentElement;


      if (
        parent &&
        !parent.querySelector(".image-fallback")
      ) {

        const fallback =
          document.createElement("div");

        fallback.className =
          "image-fallback";

        fallback.textContent =
          "VimBuzz";

        fallback.style.cssText = `
          width: 100%;
          height: 100%;
          min-height: 120px;
          display: grid;
          place-items: center;
          background: #e5e7eb;
          color: #6b7280;
          font-weight: 900;
        `;

        parent.appendChild(fallback);

      }

    });

  });


  /* =======================================================
     ONLINE / OFFLINE STATUS
     ======================================================= */

  function updateConnectionStatus() {

    if (!navigator.onLine) {

      console.log(
        "VimBuzz is currently offline."
      );

    } else {

      console.log(
        "VimBuzz is online."
      );

    }

  }


  window.addEventListener(
    "online",
    updateConnectionStatus
  );

  window.addEventListener(
    "offline",
    updateConnectionStatus
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  console.log(
    "🔥 VimBuzz V1 loaded successfully."
  );

  console.log(
    `📚 Articles detected: ${articleCards.length}`
  );

  console.log(
    `📧 Newsletter subscribers: ${getSubscribers().length}`
  );

});