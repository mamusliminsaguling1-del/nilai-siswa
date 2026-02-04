const BACKEND_URL = "https://script.google.com/macros/s/AKfycby2vXNNjbTZFBy5mvj6eRy48ig0JT4dx6sggp9FGeDpR-VCJem8AIDLCKLeEIDz7HsR/exec";

function login() {
  const email = document.getElementById("email").value.trim();
  const accessCode = document.getElementById("accessCode").value.trim();
  const messageEl = document.getElementById("loginMessage");

  messageEl.textContent = "";

  if (!email || !accessCode) {
    messageEl.textContent = "Email and access code are required.";
    return;
  }

  fetch(`${BACKEND_URL}?action=login&email=${encodeURIComponent(email)}&access_code=${encodeURIComponent(accessCode)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        messageEl.textContent = "Login failed.";
        return;
      }

      showDashboard(data, email);
    })
    .catch(() => {
      messageEl.textContent = "Connection error.";
    });
}

function showDashboard(data, myEmail) {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("dashboardSection").classList.remove("hidden");

  // Fill summary
  document.getElementById("myName").textContent =
    `${data.myData["Nama Depan"]} ${data.myData["Nama akhir"]}`;

  document.getElementById("myTotal").textContent =
    data.myData["Total kursus (Riil)"];

  const myRankObj = data.ranking.find(r => r.email.toLowerCase() === myEmail.toLowerCase());
  document.getElementById("myRank").textContent = myRankObj ? myRankObj.rank : "-";

  // Fill ranking table
  const table = document.getElementById("rankingTable");
  table.innerHTML = "";

  data.ranking.forEach(item => {
    const tr = document.createElement("tr");

    if (item.email.toLowerCase() === myEmail.toLowerCase()) {
      tr.classList.add("highlight-row");
    }

    tr.innerHTML = `
      <td>${item.rank}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>${item.total}</td>
    `;

    table.appendChild(tr);
  });
}
