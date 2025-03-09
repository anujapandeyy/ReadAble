chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const url = new URL(tab.url);
    const domain = url.hostname;

    chrome.storage.sync.get(domain, (data) => {
      if (data[domain]) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (settings) => {
            const styleId = "dyslexia-helper-style";
            let styleTag = document.getElementById(styleId);
            if (!styleTag) {
              styleTag = document.createElement("style");
              styleTag.id = styleId;
              document.head.appendChild(styleTag);
            }

            styleTag.innerHTML = `
              body {
                font-family: ${settings.font || "inherit"} !important;
                letter-spacing: ${settings.spacing ? settings.spacing + "px" : "normal"} !important;
                background-color: ${settings.bgColor || "#ffffff"} !important;
                color: ${settings.textColor || "#000000"} !important;
              }
            `;
          },
          args: [data[domain]],
        });
      }
    });
  }
});
