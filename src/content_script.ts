const FIXED_TRADITIONAL = "[修復] 中文（繁體）";
const TRADITIONAL = "中文（繁體）";
const TO = ">> ";

/**
 * Inject interception function into the website.
 */
const setIntercept = () => {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("js/injected.js");
  s.type = "module";

  s.onload = async function () {
    (this as any).remove();
  };
  (document.head || document.documentElement).appendChild(s);
};
setIntercept();

/**
 * Modify website button labels.
 */
const addObserver = () => {
  const menu = document.querySelector(".ytp-settings-menu");

  if (!menu) {
    // Check again after 100ms until the menu is in the DOM.
    setTimeout(addObserver, 100);
    return;
  }

  const observer = new MutationObserver(changeText);

  observer.observe(menu, {
    childList: true,
    attributeFilter: ["style"],
  });
};

window.onload = addObserver;

const changeText = () => {
  const menu = document.querySelector(".ytp-settings-menu");
  if (!menu) return;

  const items = menu.querySelectorAll(".ytp-menuitem");

  Array.from(items).some((item) => {
    const elements = [
      item.querySelector(".ytp-menuitem-content"),
      item.querySelector(".ytp-menuitem-label"),
    ];

    for (const element of elements) {
      if (!element) continue;

      if (isModified(element.textContent)) return true;

      if (isCanBeModified(element.textContent)) {
        element.textContent = addTag(element.textContent);
        return true;
      }
    }
  });
};

const isModified = (text: string | null) => {
  if (text === null) return false;
  return text === FIXED_TRADITIONAL || text.includes(TO + FIXED_TRADITIONAL);
};

const isCanBeModified = (text: string | null) => {
  if (text === null) return false;
  return text === TRADITIONAL || text.includes(TO + TRADITIONAL);
};

const addTag = (text: string | null) => {
  if (text === null) return null;
  if (text === TRADITIONAL) return FIXED_TRADITIONAL;
  return text.replace(TO + TRADITIONAL, TO + FIXED_TRADITIONAL);
};

console.log("[fix-yt-traditional-chinese-subtitle]: Loaded successfully");
