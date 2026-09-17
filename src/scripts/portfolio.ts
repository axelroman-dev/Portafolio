// Client-side state for the portfolio: language switch, theme switch,
// project filters and contact form. All content is driven by
// data attributes on the rendered HTML — the JSON is the single source
// of truth on the server.

type Lang = "es" | "en";

function $(sel: string, root: ParentNode = document): HTMLElement | null {
    return root.querySelector(sel);
}
function $$(sel: string, root: ParentNode = document): HTMLElement[] {
    return Array.from(root.querySelectorAll(sel));
}

function getLang(): Lang {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es") return stored;
    return "es";
}

function setLang(lang: Lang) {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const value = el.getAttribute(`data-i18n-${lang}`);
        if (value !== null) el.textContent = value;
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
        const value = el.getAttribute(`data-i18n-placeholder-${lang}`);
        if (value !== null) (el as HTMLInputElement).placeholder = value;
    });
    $$("[data-i18n-attr]").forEach((el) => {
        const spec = el.getAttribute("data-i18n-attr");
        if (!spec) return;
        spec.split(";").forEach((pair) => {
            const [attr, key] = pair.split(":").map((s) => s.trim());
            if (!attr || !key) return;
            const value = el.getAttribute(`data-i18n-${attr}-${lang}`);
            if (value !== null) el.setAttribute(attr, value);
        });
    });
    document.dispatchEvent(new CustomEvent("lang:changed", { detail: { lang } }));
}

function getTheme(): "light" | "dark" {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme: "light" | "dark") {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    $$("[data-theme-glyph]").forEach((el) => {
        el.textContent = theme === "dark" ? "☀" : "☾";
    });
    $$("[data-theme-label]").forEach((el) => {
        el.setAttribute(
            "aria-label",
            theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
        );
    });
    $$("[data-lang-label]").forEach((el) => {
        const lang = getLang();
        el.textContent = lang === "es" ? "ES / EN" : "EN / ES";
    });
}

function setupTheme() {
    document.documentElement.setAttribute("data-theme", getTheme());
    $$('[data-action="toggle-theme"]').forEach((btn) => {
        btn.addEventListener("click", () => {
            setTheme(getTheme() === "dark" ? "light" : "dark");
        });
    });
}

function setupLang() {
    $$('[data-action="toggle-lang"]').forEach((btn) => {
        btn.addEventListener("click", () => {
            setLang(getLang() === "es" ? "en" : "es");
        });
    });
    // Apply current lang on first load so labels are in sync.
    setLang(getLang());
}

function setupFilters() {
    const buttons = $$("[data-filter]");
    const cards = $$("[data-project]");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const f = btn.getAttribute("data-filter") || "all";
            buttons.forEach((b) => b.classList.toggle("active", b === btn));
            cards.forEach((card) => {
                const tags = (card.getAttribute("data-tags") || "").split("|").filter(Boolean);
                const show = f === "all" || tags.includes(f);
                card.style.display = show ? "" : "none";
            });
            // Empty state if nothing matches.
            const grid = $(".projects-grid");
            const empty = $(".projects-empty");
            if (grid && empty) {
                const anyVisible = cards.some((c) => c.style.display !== "none");
                empty.style.display = anyVisible ? "none" : "";
            }
        });
    });
}

function setupContactForm() {
    const form = $("[data-contact-form]") as HTMLFormElement | null;
    const sent = $("[data-sent]") as HTMLElement | null;
    const errorEl = $("[data-error]") as HTMLElement | null;
    const submit = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (!form || !sent || !errorEl || !submit) return;

    const accessKey =
        import.meta.env.PUBLIC_WEB3FORMS_KEY ?? "replace-with-your-web3forms-access-key";

    const setStatus = (el: HTMLElement, key: "sent" | "error") => {
        const lang = getLang();
        const value = el.getAttribute(`data-i18n-${key}-${lang}`);
        if (value !== null) el.textContent = value;
        el.style.display = "";
    };

    const setSendingLabel = () => {
        const lang = getLang();
        submit.textContent =
            submit.getAttribute(`data-i18n-sending-${lang}`) ?? submit.textContent ?? "";
    };

    const restoreLabel = () => {
        const lang = getLang();
        const value = submit.getAttribute(`data-i18n-${lang}`);
        if (value !== null) submit.textContent = value;
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        sent.style.display = "none";
        errorEl.style.display = "none";
        submit.disabled = true;
        setSendingLabel();

        try {
            const payload = Object.fromEntries(new FormData(form));
            const body = JSON.stringify({
                access_key: accessKey,
                subject: `Nuevo mensaje de ${String(payload.name ?? "")}`,
                from_name: "Portafolio Web",
                ...payload,
            });

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body,
            });
            const data = (await response.json()) as { success?: boolean };
            if (data.success) {
                setStatus(sent, "sent");
                form.reset();
            } else {
                setStatus(errorEl, "error");
            }
        } catch {
            setStatus(errorEl, "error");
        } finally {
            submit.disabled = false;
            restoreLabel();
        }
    });
}

function setupTweaksPanel() {
    const root = $("[data-tweaks]");
    const btn = $("[data-tweaks-toggle]") as HTMLButtonElement | null;
    const panel = $("#tweaks-panel") as HTMLElement | null;
    if (!root || !btn || !panel) return;

    const setOpen = (open: boolean) => {
        btn.setAttribute("aria-expanded", String(open));
        panel.hidden = !open;
    };

    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        setOpen(btn.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("click", (event) => {
        if (panel.hidden) return;
        const target = event.target as Node | null;
        if (target && !root.contains(target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) setOpen(false);
    });
}

export function initPortfolio() {
    setupTheme();
    setupLang();
    setupFilters();
    setupContactForm();
    setupTweaksPanel();
}
