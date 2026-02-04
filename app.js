const BACKEND_URL = "https://script.google.com/macros/s/AKfycby2vXNNjbTZFBy5mvj6eRy48ig0JT4dx6sggp9FGeDpR-VCJem8AIDLCKLeEIDz7HsR/exec";

let currentEmail = "";

function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const accessCode = document.getElementById("accessCode").value.trim();

  fetch(`${BACKEND_URL}?action=login&email=${email}&access_code=${accessCode}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentEmail = email;
        loadDashboard();
      } else {
        document.getElementById("loginMessage").innerText = data.message;
      }
    });
}

function loadDashboard() {
  fetch(`${BACKEND_URL}?action=dashboard&email=${currentEmail}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      document.getElementById("loginSection").classList.add("d-none");
      document.getElementById("dashboardSection").classList.remove("d-none");

      renderRanking(data.ranking);
      renderMyDetail(data.myData);
    });
}

function renderRanking(ranking) {
  const tbody = document.getElementById("rankingTable");
  tbody.innerHTML = "";

  ranking.forEach(row => {
    const tr = document.createElement("tr");

    if (row.email === currentEmail) {
      tr.classList.add("table-warning");
    }

    tr.innerHTML = `
      <td>${row.rank}</td>
      <td>${row.name}</td>
      <td>${row.total}</td>
    `;

    tbody.appendChild(tr);
  });
}

function renderMyDetail(detail) {
  const tbody = document.getElementById("myDetail");
  tbody.innerHTML = "";

  for (const key in detail) {
    if (key === "Alamat Email") continue;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th>${key}</th>
      <td>${detail[key]}</td>
    `;
    tbody.appendChild(tr);
  }
}
