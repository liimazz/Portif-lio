/* JavaScript puro — personalize GITHUB_USERNAME com seu usuário do GitHub. */
"use strict";

// IMPORTANTE: troque "SEU_USUARIO_AQUI" pelo nome de usuário do seu GitHub.
const GITHUB_USERNAME = "liimazz";

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// Alternância de tema e preferência salva no navegador.
function setTheme(theme) {
  const light = theme === "light";
  root.classList.toggle("light-theme", light);
  themeToggle.setAttribute("aria-label", light ? "Ativar modo escuro" : "Ativar modo claro");
  themeToggle.querySelector(".theme-icon").textContent = light ? "☾" : "☼";
  try { localStorage.setItem("portfolio-theme", light ? "light" : "dark"); } catch (error) {}
}
let initialTheme = "dark";
try { initialTheme = localStorage.getItem("portfolio-theme") || "dark"; } catch (error) {}
setTheme(initialTheme);
themeToggle.addEventListener("click", () => setTheme(root.classList.contains("light-theme") ? "dark" : "light"));

// Menu hambúrguer e navegação acessível.
function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("open", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
});
navLinks.forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });

// Texto dinâmico no início.
const typingText = document.querySelector("#typing-text");
const phrases = ["em formação", "criando projetos", "sempre aprendendo"];
let phraseIndex = 0, charIndex = phrases[0].length, deleting = false;
function typePhrase() {
  if (!typingText) return;
  const phrase = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typingText.textContent = phrase.slice(0, charIndex);
    if (charIndex >= phrase.length) {
      deleting = true;
      window.setTimeout(typePhrase, 1450);
      return;
    }
  } else {
    charIndex--;
    typingText.textContent = phrase.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  }
  window.setTimeout(typePhrase, deleting ? 38 : 72);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) window.setTimeout(typePhrase, 1600);

// Animação de entrada respeitando as preferências de acessibilidade.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

// Marca no menu a seção que está sendo visualizada.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => sectionObserver.observe(section));
}

// Ano automático.
document.querySelector("#current-year").textContent = new Date().getFullYear();

// Projetos selecionados do portfólio: exatamente estes quatro sites.
const projectsGrid = document.querySelector("#projects-grid");
const projectsNote = document.querySelector("#projects-note");
const githubProfileLink = document.querySelector("#github-profile-link");

const portfolioProjects = [
  {
    name: "NexTech Store",
    repo: "nextech-store",
    description: "Loja virtual com temática gamer, criada para apresentar produtos em uma interface moderna e interativa.",
    language: "HTML · CSS · JavaScript",
    symbol: "NX",
    live: "https://liimazz.pythonanywhere.com/"
  }
];

githubProfileLink.href = `https://github.com/${GITHUB_USERNAME}`;

function makeProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = "project-card reveal visible";

  const art = document.createElement("div");
  art.className = `project-art project-art-${index + 1}`;
  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = String(index + 1).padStart(2, "0");
  const symbol = document.createElement("span");
  symbol.className = "project-art-symbol";
  symbol.textContent = project.symbol;
  art.append(number, symbol);

  const body = document.createElement("div");
  body.className = "project-body";
  const language = document.createElement("span");
  language.className = "project-language";
  language.textContent = project.language;
  const title = document.createElement("h3");
  title.textContent = project.name;
  const description = document.createElement("p");
  description.textContent = project.description;

  const actions = document.createElement("div");
  actions.className = "project-actions";

  const liveLink = document.createElement("a");
  liveLink.className = "project-link project-link-primary";
  liveLink.href = project.live;
  liveLink.target = "_blank";
  liveLink.rel = "noopener noreferrer";
  liveLink.append(document.createTextNode("Abrir site "));
  const liveArrow = document.createElement("span");
  liveArrow.textContent = "↗";
  liveLink.append(liveArrow);

  const repoLink = document.createElement("a");
  repoLink.className = "project-link";
  repoLink.href = `https://github.com/${GITHUB_USERNAME}/${project.repo}`;
  repoLink.target = "_blank";
  repoLink.rel = "noopener noreferrer";
  repoLink.append(document.createTextNode("Ver código "));
  const repoArrow = document.createElement("span");
  repoArrow.textContent = "↗";
  repoLink.append(repoArrow);

  actions.append(liveLink, repoLink);
  body.append(language, title, description, actions);
  article.append(art, body);
  return article;
}

function renderPortfolioProjects() {
  projectsGrid.replaceChildren();
  portfolioProjects.forEach((project, index) => {
    projectsGrid.append(makeProjectCard(project, index));
  });
  projectsNote.textContent = "Um projeto em destaque: NexTech Store, publicado no PythonAnywhere. Use “Visitar site” para abrir a versão online.";
}
renderPortfolioProjects();

// Validação do formulário; não envia os dados a um servidor.
const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
const fields = {
  nome: document.querySelector("#nome"),
  email: document.querySelector("#email"),
  mensagem: document.querySelector("#mensagem"),
  consentimento: document.querySelector("#consentimento")
};

function setError(name, message) {
  const field = fields[name];
  const error = document.querySelector(`#${name}-error`);
  if (error) error.textContent = message;
  if (name !== "consentimento") {
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }
}
function validateForm() {
  const name = fields.nome.value.trim();
  const email = fields.email.value.trim();
  const message = fields.mensagem.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    nome: name.length < 2 ? "Digite seu nome (pelo menos 2 caracteres)." : "",
    email: !emailPattern.test(email) ? "Digite um e-mail válido." : "",
    mensagem: message.length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : "",
    consentimento: !fields.consentimento.checked ? "Marque o consentimento para continuar." : ""
  };
  let valid = true;
  Object.entries(errors).forEach(([name, message]) => {
    setError(name, message);
    if (message) valid = false;
  });
  return valid;
}
Object.entries(fields).forEach(([name, field]) => {
  field.addEventListener(name === "consentimento" ? "change" : "input", () => {
    setError(name, "");
    feedback.textContent = "";
  });
});
form.addEventListener("submit", event => {
  event.preventDefault();
  feedback.textContent = "";
  if (!validateForm()) {
    const invalid = form.querySelector(".invalid");
    if (invalid) invalid.focus();
    else if (!fields.consentimento.checked) fields.consentimento.focus();
    return;
  }
  feedback.textContent = "Validação concluída! Este formulário é demonstrativo e ainda não envia mensagens.";
  form.reset();
  Object.keys(fields).forEach(name => setError(name, ""));
});
