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
  this._requestHeaders = {};

  /**
   * Convert traditional Chinese subtitles to simplified Chinese,
   * and append new payload to conducive to the following conversion.
   */
  if (arguments[1].indexOf(FILTER.HANT) > -1) {
    arguments[1] =
      arguments[1].replace(FILTER.HANT, FILTER.HANS) + "&" + ORIGIN_TLANG;
  }

  return open.apply(this, arguments);
};

XHR.setRequestHeader = function (header, value) {
  this._requestHeaders[header] = value;
  return setRequestHeader.apply(this, arguments);
};

XHR.send = function () {
  this.addEventListener("load", function () {
    const url = this.responseURL;

    // Convert simplified Chinese subtitles to traditional Chinese.
    if (url.indexOf(FILTER.HANS) > -1 && url.indexOf(ORIGIN_TLANG) > -1) {
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
  return send.apply(this, arguments);
};
