const styleId = "dyslexia-helper-style";

function applyStyles(font, spacing, bgColor, textColor) {
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      body {
        font-family: ${font || "inherit"} !important;
        letter-spacing: ${spacing ? spacing + "px" : "normal"} !important;
        background-color: ${bgColor || "#ffffff"} !important;
        color: ${textColor || "#000000"} !important;
      }
  `;
}

// Get the current domain
const domain = window.location.hostname;

// Load settings for this domain only
chrome.storage.sync.get(domain, (data) => {
  if (data[domain]) {
    const { font, spacing, bgColor, textColor } = data[domain];
    applyStyles(font, spacing, bgColor, textColor);
  }
});

// Listen for changes from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apply") {
    applyStyles(request.font, request.spacing, request.bgColor, request.textColor);
  } else if (request.action === "reset") {
    const styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove();
    sendResponse({ status: "reset done" });
  }
});
