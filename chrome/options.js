var server = document.getElementById("server");
var token = document.getElementById("token");
var add = document.getElementById("add");
var save = document.getElementById("save");
let snippets = document.getElementById("snippets");

function saveSettings() {
  let snipData = [...snippets.querySelectorAll("div.snippet")]
    .map((el) => {
      return {
        name: el.querySelector(".name").value,
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
          code: "[...document.querySelectorAll('a')].map(n => n.href).filter(url => !url.includes('.google')).filter(url => !url=='');",
          onsuccess:
            "Array.from(document.querySelectorAll('span')).find(el => el.innerHTML.includes('More results')).click();",
        },
        {
          name: "Bing URLs",
          code: "[...document.querySelectorAll('h2 > a')].map(n => n.href).filter(url => !url.includes('.bing')).filter(url => !url=='');",
          onsuccess:
            "next = document.querySelector('a[title='Next page']'); document.location = next.href;",
        },
      ],
    };
  } else {
    if (!data.config.server) {
      data.config.server = "http://localhost:8082";
    }

    if (!data.config.snippets) {
      data.config.snippets = [{ name: "", code: "", onsuccess: "" }];
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
  snippet.querySelector(".code").value = data.code || "";
  snippet.querySelector(".onsuccess").value = data.onsuccess || "";
  snippet.querySelector(".delete").addEventListener("click", (e) => {
    let snip = e.target.parentNode.parentNode;
    snip.parentNode.removeChild(snip);
  });

  return snippet.querySelector(".snippet");
}
