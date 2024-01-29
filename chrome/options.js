var server = document.getElementById("server");
var token = document.getElementById("token");
var add = document.getElementById("add");
var save = document.getElementById("save");
let snippets = document.getElementById("snippets");

// Snippet examples

// Google
googleId = "google";
googleSnippet =
  "[...document.querySelectorAll('a')].map(n => n.href).filter(url => !url.includes('.google') && !url.startsWith('javascript:') && url !== '');";
googlePostSnippet =
  "Array.from(document.querySelectorAll('span')).find(el => el.innerHTML.includes('More results')).click();";

// Bing
bingId = "bing";
bingSnippet =
  "[...document.querySelectorAll('h2 > a')].map(n => n.href).filter(url => !url.includes('.bing') && url !== '');";
bingPostSnippet =
  "next = document.querySelector('a[title=\"Next page\"]'); document.location = next.href;";

// Duckduckgo
duckduckgoId = "duckduckgo";
duckduckgoSnippet =
  "[...document.querySelectorAll('a')].map(n => n.href).filter(url => !url.toLowerCase().includes('duckduckgo') && !url.toLowerCase().startsWith('javascript:') && url !== '');";
duckduckgoPostSnippet =
  "document.querySelector('button[id=\"more-results\"]').click();";

// Yahoo
yahooId = "yahoo";
yahooSnippet =
  "[...document.querySelectorAll('a')].map(n => n.href).filter(url => !url.toLowerCase().includes('yahoo') && !url.toLowerCase().includes('.bingj') && !url.toLowerCase().startsWith('javascript:') && url !== '');";
yahooPostSnippet =
  "next = document.querySelector('a[class=\"next\"]'); document.location = next.href;";

// StartPage
startpageId = "startpage";
startpageSnippet =
  "[...document.querySelectorAll('a')].map(n => n.href).filter(url => !url.toLowerCase().includes('startpage') && !url.toLowerCase().startsWith('javascript:') && url !== '');";
startpagePostSnippet =
  "document.querySelector('button[class=\"pagination__next-prev-button next\"]').click();";

function saveSettings() {
  let snipData = [...snippets.querySelectorAll("div.snippet")]
    .map((el) => {
      return {
        name: el.querySelector(".name").value,
        id: el.querySelector(".id").value,
        code: el.querySelector(".code").value,
        onsuccess: el.querySelector(".onsuccess").value,
      };
    })
    .filter((s) => s.name && s.code);

  chrome.storage.sync.set(
    {
      config: {
        server: server.value,
        token: token.value,
        snippets: snipData,
      },
    },
    function () {
      console.log("saved:", server.value, token.value);
      save.innerText = "Saved!";
      setTimeout(() => {
        save.innerText = "Save";
      }, 1000);
    }
  );

  // Save server and token values to local storage
  localStorage.setItem("server", server.value);
  localStorage.setItem("token", token.value);
}

chrome.storage.sync.get("config", function (data) {
  if (!data.config) {
    data.config = {
      server: "http://localhost:8082",
      token: "",
      snippets: [
        {
          name: "Google URLs",
          id: googleId,
          code: googleSnippet,
          onsuccess: googlePostSnippet,
        },
        {
          name: "Bing URLs",
          id: bingId,
          code: bingSnippet,
          onsuccess: bingPostSnippet,
        },
        {
          name: "DuckDuckGo URLs",
          id: duckduckgoId,
          code: duckduckgoSnippet,
          onsuccess: duckduckgoPostSnippet,
        },
        {
          name: "Yahoo URLs",
          id: yahooId,
          code: yahooSnippet,
          onsuccess: yahooPostSnippet,
        },
        {
          name: "StartPage URLs",
          id: startpageId,
          code: startpageSnippet,
          onsuccess: startpagePostSnippet,
        },
      ],
    };
  } else {
    if (!data.config.server) {
      data.config.server = "http://localhost:8082";
    }
    if (!data.config.token) {
      data.config.token = "";
    }
    if (!data.config.snippets) {
      data.config.snippets = [{ name: "", id: "", code: "", onsuccess: "" }];
    }
  }

  server.value = data.config.server;
  token.value = data.config.token;

  data.config.snippets.map((s) => {
    snippets.appendChild(snippetTemplate(s));
  });
});

add.addEventListener("click", () => {
  snippets.appendChild(snippetTemplate({}));
});

save.addEventListener("click", () => {
  saveSettings();
});

function snippetTemplate(data) {
  let dp = new DOMParser();
  let snippet = dp.parseFromString(
    `
        <div class=snippet>
            <label>Name:</label>
            <input type=text class=name>

            <label>Identifier (a string in the URL that will identify the snippet target):</label>
            <input type=text class=id>

            <label>Code (should return an array of strings):</label>
            <textarea class=code></textarea>

            <label>On Success (code to run after data has been sent):</label>
            <textarea class=onsuccess></textarea>

            <div> <button class=delete>Delete</button> </div>
        </div>
    `,
    "text/html"
  );

  snippet.querySelector(".name").value = data.name || "";
  snippet.querySelector(".id").value = data.id || "";
  snippet.querySelector(".code").value = data.code || "";
  snippet.querySelector(".onsuccess").value = data.onsuccess || "";
  snippet.querySelector(".delete").addEventListener("click", (e) => {
    let snip = e.target.parentNode.parentNode;
    snip.parentNode.removeChild(snip);
  });

  return snippet.querySelector(".snippet");
}
