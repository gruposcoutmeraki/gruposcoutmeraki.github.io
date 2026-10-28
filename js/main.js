(function () {
  "use strict";

  const DEFAULT_LANG = "es";
  const STORAGE_KEY = "meraki-lang";

  /* ---------- Helpers de localStorage seguros ---------- */
  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn("[Meraki] localStorage no disponible:", e.message);
      return null;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* Silencioso: si falla, la traducción funciona igual, solo no se recuerda */
    }
  }

  /* ---------- Traducción ---------- */
  function applyLanguage(lang) {
    if (typeof TRANSLATIONS === "undefined") {
      console.error("[Meraki] TRANSLATIONS no está definido. ¿Cargaste js/translations.js antes que main.js?");
      return;
    }

    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];
    if (!dict) {
      console.error("[Meraki] No hay diccionario para el idioma:", lang);
      return;
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      } else {
        console.warn("[Meraki] Falta la clave:", key, "en el idioma:", lang);
      }
    });

    document.documentElement.lang = lang;
    saveLang(lang);

    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });

    console.log("[Meraki] Idioma aplicado:", lang);
  }

  function initLanguage() {
    const saved = getSavedLang() || DEFAULT_LANG;
    applyLanguage(saved);

    const buttons = document.querySelectorAll(".lang-btn");
    if (!buttons.length) {
      console.warn("[Meraki] No se encontraron botones .lang-btn en el HTML");
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        applyLanguage(btn.dataset.lang);
      });
    });
  }

  /* ---------- Menú móvil ---------- */
  function initBurger() {
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Año footer ---------- */
  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Arranque ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Meraki] Iniciando scripts...");
    initLanguage();
    initBurger();
    initYear();
  });
})();