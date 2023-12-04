import * as OpenCC from "opencc-js";

const converter = OpenCC.Converter({ from: "cn", to: "twp" });

const FILTER = {
  /**
   * Simplified Chinese payload.
   */
  HANS: "tlang=zh-Hans",

  /**
   * Traditional Chinese payload.
   */
  HANT: "tlang=zh-Hant",
};
const ORIGIN_TLANG = "origin_tlang=zh-Hant";

const XHR = XMLHttpRequest.prototype;

const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

XHR.open = function () {
  // @ts-ignore
  this._requestHeaders = {};

  /**
   * Convert traditional Chinese subtitles to simplified Chinese,
   * and append new payload to conducive to the following conversion.
   */
  if (arguments[1].includes(FILTER.HANT)) {
    arguments[1] =
      arguments[1].replace(FILTER.HANT, FILTER.HANS) + "&" + ORIGIN_TLANG;
  }

  return open.apply(this, arguments as any);
};

XHR.setRequestHeader = function (header, value) {
  // @ts-ignore
  this._requestHeaders[header] = value;
  return setRequestHeader.apply(this, arguments as any);
};

XHR.send = function () {
  this.addEventListener("load", function () {
    const url = this.responseURL;

    // Convert simplified Chinese subtitles to traditional Chinese.
    if (url.includes(FILTER.HANS) && url.includes(ORIGIN_TLANG)) {
      const converted = converter(this.responseText);

      Object.defineProperty(this, "responseText", {
        writable: true,
        value: converted,
      });

      console.log(
        "[fix-yt-traditional-chinese-subtitle]: Converted successfully"
      );
    }
  });

  /**
   * Since the request is wrapped and send out on this line,
   * if any error occurs, it will be thrown here.
   */
  return send.apply(this, arguments as any);
};
