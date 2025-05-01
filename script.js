document.addEventListener("DOMContentLoaded", function () {
  try {
    // DOM Elements with null checks
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Check if essential elements exist
    if (!menuToggle || !sidebar || !mainContent || !themeToggle) {
      throw new Error("Essential elements not found in DOM");
    }

    // Theme Management
    function applyTheme(theme) {
      body.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }

    function getPreferredTheme() {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) return storedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // User profile dropdown
    const userProfile = document.getElementById("userProfile");
    if (userProfile) {
      userProfile.addEventListener("click", function (e) {
        // Prevent closing when clicking inside dropdown
        if (e.target.closest(".profile-dropdown")) return;

        this.classList.toggle("active");
      });

      // Close when clicking outside
      document.addEventListener("click", function (e) {
        if (!userProfile.contains(e.target)) {
          userProfile.classList.remove("active");
        }
      });
    }

    // Initialize theme
    applyTheme(getPreferredTheme());

    // Toggle sidebar
    function toggleSidebar() {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");

      // Mobile behavior
      if (window.innerWidth <= 992) {
        sidebar.classList.toggle("show");
      }
    }

    menuToggle.addEventListener("click", toggleSidebar);

    // Toggle theme
    themeToggle.addEventListener("click", function () {
      const currentTheme = body.getAttribute("data-theme") || "light";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    // Submenu handling
    const submenuItems = document.querySelectorAll(".has-submenu");

    function closeAllSubmenus() {
      submenuItems.forEach((item) => {
        item.classList.remove("open");
      });
    }

    submenuItems.forEach((item) => {
      const link = item.querySelector("a");

      if (!link) return;

      link.addEventListener("click", function (e) {
        // Prevent default only if on mobile or sidebar is collapsed
        if (
          window.innerWidth <= 992 ||
          sidebar.classList.contains("collapsed")
        ) {
          e.preventDefault();
        }

        // Close others if this one isn't open
        if (!item.classList.contains("open")) {
          closeAllSubmenus();
        }

        // Toggle current
        item.classList.toggle("open");
      });
    });

    // Close submenus when clicking outside on mobile
    document.addEventListener("click", function (e) {
      if (
        window.innerWidth <= 992 &&
        !sidebar.contains(e.target) &&
        !e.target.closest(".has-submenu")
      ) {
        closeAllSubmenus();
      }
    });

    // Close sidebar when clicking a non-submenu link (mobile)
    const menuLinks = document.querySelectorAll(
      ".menu-item:not(.has-submenu) a"
    );
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 992) {
          sidebar.classList.remove("show");
        }
      });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 992) {
          sidebar.classList.remove("show");
        }
      }, 250);
    });

    console.log("Sidebar initialized successfully");
  } catch (error) {
    console.error("Error initializing sidebar:", error);
  }
});
