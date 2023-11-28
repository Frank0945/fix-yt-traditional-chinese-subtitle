# fix-yt-traditional-chinese-subtitle

Corrected the issue that prevented the proper display of YouTube's automatic translation in Traditional Chinese.

The options in the subtitles menu will be modified to "[Fix] Chinese (Traditional)" when your YouTube language is set to Chinese (Traditional). However, the modification will still take effect without the "[Fix]" tag.

### What did I do?

After my investigation, I found out that the timestamps in the sources for Traditional Chinese subtitles were completely wrong, and some video subtitles couldn't be segmented correctly. So, I intercepted the web request/response to make modifications and converted the Simplified Chinese subtitles into Traditional Chinese.

### Package for translate

- [opencc-js](https://github.com/nk2028/opencc-js)
