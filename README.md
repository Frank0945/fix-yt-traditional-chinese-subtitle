# fix-yt-traditional-chinese-subtitle

Corrected the issue that prevented the proper display of YouTube's automatic translation in Traditional Chinese.

The options in the subtitles menu will be modified to "[Fix] Chinese (Traditional)" when your YouTube language is set to Chinese (Traditional). However, the modification will still take effect without the "[Fix]" tag.

## What did I do?

After my investigation, I found out that the timestamps in the sources for Traditional Chinese subtitles were completely wrong, and some video subtitles couldn't be segmented correctly. So, I intercepted the web request/response to make modifications and converted the Simplified Chinese subtitles into Traditional Chinese.

## Download extension

- [Chrome](https://chromewebstore.google.com/detail/youtube-%E7%B9%81%E9%AB%94%E8%87%AA%E5%8B%95%E7%BF%BB%E8%AD%AF%E4%BF%AE%E6%AD%A3/nghlhmhjdlbcgnmjffpeialapbcnajig?hl=zh-TW)
- [Firefox](https://addons.mozilla.org/zh-TW/firefox/addon/youtube-繁體自動翻譯修正/)

## Package for translate

- [opencc-js](https://github.com/nk2028/opencc-js)
