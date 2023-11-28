import * as OpenCC from "opencc-js";

const converter = OpenCC.Converter({ from: "cn", to: "twp" });

const FILTER = "tlang=zh-Hans";

const XHR = XMLHttpRequest.prototype;

const open = XHR.open;
const send = XHR.send;
const setRequestHeader = XHR.setRequestHeader;

XHR.open = function () {
  this._requestHeaders = {};

  return open.apply(this, arguments);
};

XHR.setRequestHeader = function (header, value) {
  this._requestHeaders[header] = value;
  return setRequestHeader.apply(this, arguments);
};

XHR.send = function () {
  this.addEventListener("load", function () {
    const url = this.responseURL;

    if (url.indexOf(FILTER) > -1) {
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
