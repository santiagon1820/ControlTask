const NAV_BY_ROLE = {
    admin: [
      { key: "adminpanel", label: "Dashboard", href: "./adminpanel.html", icon: "fa-table" },
      { key: "empresas", label: "Empresas", href: "./empresas.html", icon: "fa-building" },
      { key: "users", label: "Usuarios", href: "./users.html", icon: "fa-users" },
      { key: "conf", label: "Configuración", href: "./conf.html", icon: "fa-cog" },
    ],
    user: [
      { key: "paneluser", label: "Mis reportes", href: "./paneluser.html", icon: "fa-file-lines" },
      { key: "empresas", label: "Empresas", href: "./empresas.html", icon: "fa-building" },
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
        <li>
          <a href="${item.href}"
             class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                    ${active
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"}">
            <i class="fas ${item.icon} w-5 text-center"></i>
            <span class="nav-text">${item.label}</span>
          </a>
        </li>
      `;
    }).join("");
  }
  
  function buildHeader(role) {
    return `
      <header class="main-header border-b border-slate-200 bg-white shadow-sm">
        <div class="flex items-center gap-3">
          <button id="sidebarToggle"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            type="button"
            aria-label="Abrir o cerrar menú lateral">
            <i class="fas fa-bars"></i>
          </button>
  
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              CT
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-800">ControlTask</h1>
              <p class="text-xs text-slate-500">${getUserLabel(role)}</p>
            </div>
          </div>
        </div>
  
        <div class="flex items-center gap-3">
          <span class="hidden rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 md:inline-flex">
            <i class="fas fa-user mr-2"></i>${getUserLabel(role)}
          </span>
  
          <a href="./login/login.html"
             id="logoutBtn"
             class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
            <i class="fas fa-sign-out-alt"></i>
            <span>Salir</span>
          </a>
        </div>
      </header>
    `;
  }
  
  function buildSidebar(role, currentPage) {
    return `
      <aside id="appSidebar"
        class="sidebar w-72 shrink-0 border-r border-slate-700 bg-slate-800 text-white transition-all duration-300">
        <div class="flex h-full flex-col">
          <div class="border-b border-white/10 px-4 py-5">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Navegación</p>
          </div>
  
          <nav class="flex-1 overflow-y-auto px-3 py-4">
            <ul class="space-y-2">
              ${buildNavItems(role, currentPage)}
            </ul>
          </nav>
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
        sidebar.classList.toggle("collapsed");
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
    wrapper.className = "min-h-screen bg-slate-50 text-slate-800";
  
    wrapper.innerHTML = `
      ${buildHeader(role)}
      <div class="main-layout flex min-h-[calc(100vh-73px)]">
        ${buildSidebar(role, currentPage)}
        <section class="flex-1 overflow-x-hidden">
        </section>
      </div>
    `;
  
    pageContent.parentNode.insertBefore(wrapper, pageContent);
    wrapper.querySelector("section").appendChild(pageContent);
  
    applyPermissions(role);
    bindLayoutEvents();
  }
  
  document.addEventListener("DOMContentLoaded", injectLayout);