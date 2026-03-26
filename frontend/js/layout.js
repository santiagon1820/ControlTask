const NAV_BY_ROLE = {
  admin: [
    { key: "fisicas", label: "Personas Físicas", href: "./fisicas.html", icon: "fa-user-tie" },
    { key: "morales", label: "Personas Morales", href: "./morales.html", icon: "fa-user-tie" },
    { key: "Clientes", label: "Clientes", href: "./Clientes.html", icon: "fa-address-book" },
    { key: "users", label: "Usuarios", href: "./users.html", icon: "fa-users" },
  ],
  user: [
    { key: "fisicas", label: "Personas Físicas", href: "./fisicas.html", icon: "fa-user-tie" },
    { key: "morales", label: "Personas Morales", href: "./morales.html", icon: "fa-user-tie" },
    { key: "Clientes", label: "Clientes", href: "./Clientes.html", icon: "fa-address-book" },
  ],
};

function getRole() {
  return document.body.dataset.role || localStorage.getItem("role") || "admin";
}

function getPage() {
  return document.body.dataset.page || "";
}

function getUserLabel(role) {
  return role === "admin" ? "Administrador" : "Usuario";
}

function buildNavItems(role, currentPage) {
  const nav = NAV_BY_ROLE[role] || NAV_BY_ROLE.admin;

  return nav.map(item => {
    const active = item.key === currentPage;
    return `
      <li class="mb-2">
        <a href="${item.href}"
           class="group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${active 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-white hover:bg-slate-700 hover:text-white"}">
          <i class="fas ${item.icon} w-6 text-center text-lg"></i>
          <span class="nav-text transition-opacity duration-200 whitespace-nowrap">${item.label}</span>
        </a>
      </li>
    `;
  }).join("");
}

function buildHeader(role) {
  return `
    <header class="bg-slate-900 border-b border-slate-800 shadow-sm sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button id="sidebarToggle" class="text-white hover:bg-slate-800 rounded-lg p-2 transition-colors">
          <i class="fas fa-bars text-xl"></i>
        </button>
        
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-sm">
            CT
          </div>
          <div class="hidden sm:block">
            <h1 class="text-lg font-bold text-white leading-tight">ControlTask</h1>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-6">



        <a href="./cuenta.html" target="_blank"  class="hidden rounded-full bg-slate-800 border border-slate-700 px-4 py-1.5 text-sm font-medium text-white md:inline-flex items-center gap-2">
          <i class="fas fa-user-shield text-indigo-400"></i> ${getUserLabel(role)}
        </a>
        

        <a href="./login/login.html" id="logoutBtn" class="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 hover:shadow-md">
          <i class="fas fa-sign-out-alt text-white"></i>
          <span class="hidden sm:inline">Salir</span>
        </a>
      </div>
    </header>
  `;
}

function buildSidebar(role, currentPage) {
  return `
    <aside id="appSidebar" class="w-64 flex-shrink-0 border-r border-slate-700 bg-slate-800 transition-all duration-300 overflow-hidden sticky top-[69px] h-[calc(100vh-69px)] flex flex-col">
      <div class="px-4 py-6 flex-1 overflow-y-auto">
        <p class="text-xs uppercase tracking-[0.2em] text-white mb-4 px-2 font-semibold">Navegación</p>
        <ul>
          ${buildNavItems(role, currentPage)}
        </ul>
      </div>
    </aside>
  `;
}

function applyPermissions(role) {
  if (role !== "user") return;
  document.querySelectorAll(".admin-only").forEach(el => el.remove());
  document.querySelectorAll(".btn-danger").forEach(el => el.remove());
}

function bindLayoutEvents() {
  const sidebar = document.getElementById("appSidebar");
  const toggle = document.getElementById("sidebarToggle");
  const logoutBtn = document.getElementById("logoutBtn");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("w-64");
      sidebar.classList.toggle("w-20");
      
      const navTexts = sidebar.querySelectorAll(".nav-text");
      navTexts.forEach(text => {
        text.classList.toggle("hidden");
      });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    });
  }
}

function injectLayout() {
  const role = getRole();
  const currentPage = getPage();
  const pageContent = document.getElementById("page-content");

  if (!pageContent) return;
  if (document.querySelector("[data-layout-mounted='true']")) return;

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-layout-mounted", "true");
  wrapper.className = "min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans";

  wrapper.innerHTML = `
    ${buildHeader(role)}
    <div class="flex flex-1 relative">
      ${buildSidebar(role, currentPage)}
      <section class="flex-1 overflow-x-hidden p-6">
      </section>
    </div>
  `;

  pageContent.parentNode.insertBefore(wrapper, pageContent);
  wrapper.querySelector("section").appendChild(pageContent);

  pageContent.classList.add("w-full", "max-w-7xl", "mx-auto");

  applyPermissions(role);
  bindLayoutEvents();
}

document.addEventListener("DOMContentLoaded", injectLayout);