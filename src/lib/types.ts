// Types for the portfolio JSON shape. Keep this file in sync with
// src/data/portfolio.json so editors get autocomplete on the data.

export type Localized = { es: string; en: string };

export interface Site {
    brand: string;
    year: number;
    owner: string;
}

export interface Profile {
    title: string;
    kicker: Localized;
    role: Localized;
    tagline: Localized;
}

export interface Stats {
    years: number;
}

export interface About {
    kicker: Localized;
    title: Localized;
    paragraphs: { es: string[]; en: string[] };
}

export interface LinkItem {
    id: string;
    label: string;
    meta: string;
    href: string;
}

export interface Links {
    kicker: Localized;
    items: LinkItem[];
}

export interface StackGroup {
    id: string;
    title: Localized;
    items: string[];
}

export interface ProjectItem {
    id: string;
    initials: string;
    name: string;
    category: Localized;
    tags: string[];
    desc: Localized;
    repo: string | null;
    url: string | null;
}

export interface Projects {
    kicker: Localized;
    title: Localized;
    filters: string[];
    items: ProjectItem[];
}

export interface ExperienceRow {
    year: string;
    role: Localized;
    where: Localized;
}

export interface Experience {
    kicker: Localized;
    title: Localized;
    items: ExperienceRow[];
}

export interface Contact {
    kicker: Localized;
    title: Localized;
    body: Localized;
    email: string;
}

export interface Footer {
    tagline: Localized;
}

export interface NavLang {
    projects: string;
    stack: string;
    contact: string;
}

export interface Nav {
    es: NavLang;
    en: NavLang;
}

export type UiKey =
    | "all"
    | "ctaWork"
    | "ctaHire"
    | "statYears"
    | "statProjects"
    | "statLangs"
    | "expColYear"
    | "expColRole"
    | "expColWhere"
    | "repo"
    | "web"
    | "fName"
    | "fNamePh"
    | "fEmail"
    | "fEmailPh"
    | "fSubject"
    | "fSubjectPh"
    | "fMessage"
    | "fMessagePh"
    | "fSend"
    | "sent"
    | "sending"
    | "error";

export type Ui = Record<UiKey, Localized>;

export interface Portfolio {
    site: Site;
    profile: Profile;
    stats: Stats;
    about: About;
    links: Links;
    stack: StackGroup[];
    projects: Projects;
    experience: Experience;
    contact: Contact;
    footer: Footer;
    nav: Nav;
    ui: Ui;
}
