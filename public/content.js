const styleId = "dyslexia-helper-style"; // Unique ID for the style tag

function applyStyles(font, spacing, bgColor) {
  let styleTag = document.getElementById("dyslexia-helper-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dyslexia-helper-style";
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      body {
        font-family: ${font || "inherit"} !important;
        letter-spacing: ${spacing ? spacing + "px" : "normal"} !important;
        background-color: ${
          bgColor || "#ffffff"
        } !important; /* Default to white */
      }
    `;
}

// Load settings from storage and apply them
chrome.storage.sync.get(
  ["font", "spacing", "bgColor"],
  ({ font, spacing, bgColor }) => {
    applyStyles(font, spacing, bgColor);
  }
);

// Listen for changes from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "apply") {
    applyStyles(request.font, request.spacing, request.bgColor);
  } else if (request.action === "reset") {
    const styleTag = document.getElementById(styleId);
    if (styleTag) styleTag.remove(); // Remove injected styles
    sendResponse({ status: "reset done" });
  }
});
