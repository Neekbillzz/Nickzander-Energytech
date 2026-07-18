let globalCatalogData = [];

// Client-Side Micro Routing Engine
function navigateTo(viewName) {
  document
    .querySelectorAll(".page-view")
    .forEach((view) => view.classList.add("hidden"));
  const activeView = document.getElementById(`view-${viewName}`);
  if (activeView) activeView.classList.remove("hidden");

  // Update Navigation Styling
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("text-amber-500", "border-b-2", "border-amber-500");
    link.classList.add("text-slate-600");
  });
  const currentActiveTab = document.getElementById(`nav-${viewName}`);
  if (currentActiveTab) {
    currentActiveTab.classList.remove("text-slate-600");
    currentActiveTab.classList.add(
      "text-amber-500",
      "border-b-2",
      "border-amber-500",
    );
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menu-icon");
  menu.classList.toggle("hidden");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-xmark");
}

// Dynamic UI Card Grid Rendering Engine
async function loadCatalogEngine() {
  try {
    const response = await fetch("products.json");
    globalCatalogData = await response.json();
    renderCatalogGrid(globalCatalogData);
  } catch (err) {
    console.error(
      "Critical: Could not read local products.json configuration file setup.",
      err,
    );
    document.getElementById("catalog-grid").innerHTML = `
          <div class="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <i class="fa-solid fa-triangle-exclamation text-amber-500 text-3xl mb-2"></i>
            <p class="font-bold text-slate-800">Unable to load the catalog items.</p>
            <p class="text-xs text-slate-400 mt-1">Make sure you created 'products.json' in the same folder and are running via a local test environment.</p>
          </div>`;
  }
}

function renderCatalogGrid(items) {
  const targetGrid = document.getElementById("catalog-grid");
  targetGrid.innerHTML = "";

  if (items.length === 0) {
    targetGrid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400">No units match the chosen filter.</div>`;
    return;
  }

  items.forEach((product) => {
    // Build customized inquiry text context for explicit conversion routing
    const whatsappText = encodeURIComponent(
      `Hello Nickzander Energy Techsolutions, I am looking at your catalog and would love to get more details and a delivery/installation profile for the "${product.title}" listed at ${product.price}.`,
    );
    const whatsappLink = `https://wa.me/2348056968084?text=${whatsappText}`;

    let specificationListItems = "";
    product.specs.forEach((spec) => {
      specificationListItems += `<li class="flex items-start gap-2 text-slate-600"><i class="fa-solid fa-circle text-[6px] text-amber-500 mt-2 flex-shrink-0"></i><span>${spec}</span></li>`;
    });

    const cardDom = `
          <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition duration-300">
            <div class="relative h-48 overflow-hidden bg-slate-100">
              <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-102 transition duration-500">
              <span class="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm ${product.badgeColor}">${product.badge}</span>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h3 class="text-lg font-black text-slate-900 group-hover:text-amber-600 transition duration-200">${product.title}</h3>
              <ul class="text-sm space-y-2 mt-4 mb-6 flex-grow">
                ${specificationListItems}
              </ul>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                <div class="flex flex-col">
                  <span class="text-xs uppercase font-bold tracking-wider text-slate-400">Total Outlay</span>
                  <span class="text-xl font-black text-slate-900">${product.price}</span>
                </div>
                <a href="${whatsappLink}" target="_blank" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl shadow-sm transition">
                  <i class="fa-brands fa-whatsapp text-sm"></i>Enquire
                </a>
              </div>
            </div>
          </div>`;
    targetGrid.innerHTML += cardDom;
  });
}

function filterCatalog(category) {
  // Toggle CSS styling configurations across interactive tab states
  ["all", "combos", "individual"].forEach((id) => {
    const targetBtn = document.getElementById(`filter-${id}`);
    targetBtn.className =
      "px-5 py-2.5 rounded-lg font-bold text-sm transition-all text-slate-600 hover:text-slate-900";
  });

  const activeTab = document.getElementById(`filter-${category}`);
  activeTab.className =
    "px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm bg-white text-slate-900";

  if (category === "all") {
    renderCatalogGrid(globalCatalogData);
  } else {
    const filtered = globalCatalogData.filter(
      (item) => item.category === category,
    );
    renderCatalogGrid(filtered);
  }
}

const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Gather data from the form inputs
  const formData = new FormData(form);

  try {
    // Send data to the form endpoint service
    const response = await fetch("https://formspree.io/f/xojgdwjl", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      alert(
        "Success! The quote details have been sent straight to our sales inbox.",
      );
      form.reset(); // Clears the form fields
    } else {
      const errorData = await response.json();
      console.log(errorData);
      alert("Oops! There was a problem submitting your form.");
    }
  } catch (error) {
    alert("Network error. Please check your internet connection.");
  }
});

// Initialize Global App State Context
window.addEventListener("DOMContentLoaded", () => {
  navigateTo("home");
  loadCatalogEngine();
});
