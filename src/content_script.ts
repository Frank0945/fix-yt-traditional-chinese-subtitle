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
    console.log("[fix-yt-traditional-chinese-subtitle]: MutationObserver");
    hideAndAddMenuItems();
    changeSubtitleReminder();
    changeMenuReminder();
    changeMenuItemAutoTranslate();
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
  });
});

const hideAndAddMenuItems = () => {
  const menu = document.querySelector(".ytp-panel-menu");

  if (!menu) return;

  const items = menu.querySelectorAll(".ytp-menuitem");
  items.forEach((item) => {
    const span = item.querySelector(".ytp-menuitem-label")!;

    if (span.textContent === "中文（繁體）") {
      (item as HTMLElement).style.display = "none";
    }
    if (span.textContent === "中文（簡體）") {
      span.textContent = "[修復] 中文（繁體）";
    }
  });
};

const changeSubtitleReminder = () => {
  const segments = document.querySelectorAll(".ytp-caption-segment");

  if (!segments) return;

  segments.forEach((segment) => {
    if (!segment.textContent) return;
    segment.textContent = replaceReminder(segment.textContent);
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

const reminder = ">> 中文（簡體）";

const replaceReminder = <T>(str: T) => {
  if (typeof str !== "string") return str;

  if (str.includes(reminder)) {
    return str.replace(reminder, ">> [修復] 中文（繁體）");
  }
  return str;
};

console.log("[fix-yt-traditional-chinese-subtitle]: Loaded successfully");
