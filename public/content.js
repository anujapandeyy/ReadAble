const styleId = "dyslexia-helper-style"; // Unique ID for the style tag

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
        color: ${textColor || "#000000"} !important; /* Default to black */
      }
    `;
}

// Load settings from storage and apply them
chrome.storage.sync.get(
  ["font", "spacing", "bgColor", "textColor"], // Include textColor
  ({ font, spacing, bgColor, textColor }) => {
    applyStyles(font, spacing, bgColor, textColor);
  }
);

// Listen for changes from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apply") {
    applyStyles(request.font, request.spacing, request.bgColor, request.textColor);
  } else if (request.action === "reset") {
    const styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove(); // Remove injected styles
    sendResponse({ status: "reset done" });
  }
});
