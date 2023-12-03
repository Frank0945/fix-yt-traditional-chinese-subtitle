const FIXED_TAG_TRADITIONAL = `<span title="Fixed by 擴充「YouTube 繁體自動翻譯修正」" style="
  background: rgb(125 125 125 / 50%);
  margin-right: 3px;
  border-radius: 4px;
  padding: 2px 5px;
">修復</span>中文（繁體）`;
const FIXED_TRADITIONAL = "修復中文（繁體）";
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
  const menu = document.querySelector("#movie_player .ytp-settings-menu");

  if (!menu) {
    // Check again after 100ms until the menu is in the DOM.
    setTimeout(addObserver, 100);
    return;
  }

  const observer = new MutationObserver(() => changeText(menu));

  observer.observe(menu, {
    childList: true,
    attributeFilter: ["style"],
  });
};

window.onload = addObserver;

const changeText = (menu: Element) => {
  const title = menu.querySelector(".ytp-panel-title");
  const items = menu.querySelectorAll(".ytp-menuitem");

  const isAutoPrefix = title?.textContent !== "自動翻譯";

  for (const item of items) {
    const elements = [
      item.querySelector(".ytp-menuitem-content"),
      item.querySelector(".ytp-menuitem-label"),
    ];

    for (const element of elements) {
      if (!element?.textContent) continue;

      if (isModified(element.textContent)) return;

      if (isCanBeModified(isAutoPrefix, element.textContent)) {
        element.innerHTML = addTag(element.textContent);
        return;
      }
    }
  }
};

const isModified = (text: string) => {
  return text === FIXED_TRADITIONAL || text.includes(TO + FIXED_TRADITIONAL);
};

/**
 * @param isAutoPrefix If true, the `text` should have a ">> " prefix.
 */
const isCanBeModified = (isAutoPrefix: boolean, text: string) => {
  return (
    (text === TRADITIONAL && !isAutoPrefix) || text.includes(TO + TRADITIONAL)
  );
};

const addTag = (text: string) => {
  return text === TRADITIONAL
    ? FIXED_TAG_TRADITIONAL
    : text.replace(TO + TRADITIONAL, TO + FIXED_TAG_TRADITIONAL);
};

console.log("[fix-yt-traditional-chinese-subtitle]: Loaded successfully");
