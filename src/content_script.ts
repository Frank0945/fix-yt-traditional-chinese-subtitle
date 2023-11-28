/**
 * Injects the response interception function into the page.
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
 * Modify the text of the website.
 */
window.addEventListener("load", () => {
  const observer = new MutationObserver(() => {
    changeMenuItem();
    changeMenuItemAutoTranslate();
    changeMenuReminder();
  });
  const menu = document.querySelector(".ytp-settings-menu");

  if (!menu) return;
  observer.observe(menu, {
    subtree: true,
    childList: true,
  });
});

const changeMenuItem = () => {
  const menu = document.querySelector(".ytp-panel-menu");

  if (!menu) return;

  const items = menu.querySelectorAll(".ytp-menuitem");
  items.forEach((item) => {
    const span = item.querySelector(".ytp-menuitem-label")!;
    if (span.textContent === "中文（繁體）") {
      span.textContent = "[修復] 中文（繁體）";
    }
  });
};

const changeMenuReminder = () => {
  const contents = document.querySelectorAll(".ytp-menuitem-content");
  if (!contents) return;

  contents.forEach((content) => {
    content.textContent = replaceReminder(content.textContent);
  });
};

const changeMenuItemAutoTranslate = () => {
  const menu = document.querySelector(".ytp-panel-menu");

  if (!menu) return;

  const items = menu.querySelectorAll(".ytp-menuitem")!;
  items.forEach((item) => {
    const span = item.querySelector(".ytp-menuitem-label")!;

    span.textContent = replaceReminder(span.textContent);
  });
};

const reminder = ">> 中文（繁體）";

const replaceReminder = <T>(str: T) => {
  if (typeof str !== "string") return str;

  if (str.includes(reminder)) {
    return str.replace(reminder, ">> [修復] 中文（繁體）");
  }
  return str;
};

console.log("[fix-yt-traditional-chinese-subtitle]: Loaded successfully");
