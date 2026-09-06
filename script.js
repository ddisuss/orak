(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      mobileNav.hidden = !isOpen;
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        mobileNav.hidden = true;
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var tbody = document.getElementById("projBody");
  var searchInput = document.getElementById("projSearch");
  var yearSelect = document.getElementById("projYear");
  var countEl = document.getElementById("projCount");
  var noResults = document.getElementById("noResults");

  // PROJECTS comes from projects-data.js, sorted newest-first for display
  var projects = PROJECTS.slice().sort(function (a, b) {
    return (b.year || 0) - (a.year || 0) || b.num - a.num;
  });

  // populate year filter
  var years = Array.from(new Set(projects.map(function (p) { return p.year; })))
    .filter(Boolean)
    .sort(function (a, b) { return b - a; });

  years.forEach(function (y) {
    var opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function render() {
    var q = searchInput.value.trim().toLowerCase();
    var y = yearSelect.value;

    var filtered = projects.filter(function (p) {
      var matchesQuery = !q || (p.name + " " + p.customer).toLowerCase().indexOf(q) !== -1;
      var matchesYear = !y || String(p.year) === y;
      return matchesQuery && matchesYear;
    });

    tbody.innerHTML = filtered.map(function (p) {
      return (
        "<tr>" +
        '<td class="col-num">' + p.num + "</td>" +
        "<td>" + escapeHtml(p.name) + "</td>" +
        '<td class="col-customer">' + escapeHtml(p.customer) + "</td>" +
        '<td class="col-year">' + escapeHtml(p.date) + "</td>" +
        "</tr>"
      );
    }).join("");

    countEl.textContent = filtered.length + " из " + projects.length;
    noResults.style.display = filtered.length === 0 ? "block" : "none";
  }

  searchInput.addEventListener("input", render);
  yearSelect.addEventListener("change", render);

  render();
})();
