let buttons = document.getElementById("buttons");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  let currentTabUrl = tabs[0].url;

  chrome.storage.sync.get("config", function (data) {
    if (!data.config || !data.config.token) {
      buttons.innerText = "No token set. Open options";
      return;
    } else {
      if (!data.config.snippets || data.config.snippets.length < 1) {
        buttons.innerText = "No snippets set";
        return;
      }
    }

    // Filter snippets based on the current tab's URL
    let filteredSnippets = data.config.snippets.filter((s) =>
      currentTabUrl.includes(s.id)
    );

    // If no matching snippets, display all snippets
    if (filteredSnippets.length < 1) {
      filteredSnippets = data.config.snippets;
    }

    filteredSnippets.map((s) => {
      console.log(s);
      buttons.appendChild(buttonTemplate(s));
    });
  });
});

buttons.addEventListener("click", function (e) {
  chrome.storage.sync.get("config", function (data) {
    if (!data.config) {
      return;
    }

    console.log("config", data.config);

    let server = data.config.server || "localhost";
    let token = data.config.token || "notoken";
    let snippet = e.target.dataset.code;
    let postSnippet = e.target.dataset.onsuccess;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        { code: snippet },

        function (results) {
          console.log("results", results);

          fetch(server, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: token,
              lines: results[0],
            }),
          })
            .then(() => {
              chrome.tabs.executeScript(tabs[0].id, { code: postSnippet });
            })
            .catch((err) => {
              alert(
                "Failed to send to terminal. Check webpaste terminal app is running on " +
                  server +
                  "\n\nError: " +
                  err
              );
            });
        }
      );
    });
  });
});

function buttonTemplate(data) {
  let dp = new DOMParser();
  let button = dp
    .parseFromString(
      `
        <button></button>
    `,
      "text/html"
    )
    .querySelector("button");

  button.innerText = data.name;
  button.value = data.name;
  button.dataset.code = data.code;
  button.dataset.onsuccess = data.onsuccess;

  return button;
}
