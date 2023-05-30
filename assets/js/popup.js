const API = "https://sapi.deta.dev";

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function getToday() {
  let result = document.querySelector("#home_today");

  let api_url = `${API}/date/today`;
  result.innerHTML = "fetching today's date...";
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        result.innerHTML = "Something went wrong!";
      } else {
        result.innerHTML = `${data.full_nep_date_nep}(${data.full_int_date})`;
      }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  getToday();
});
