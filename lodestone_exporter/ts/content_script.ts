console.log("content_script start.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request", request);
  console.log("sender", sender);
  console.log("sendResponse", sendResponse);
  switch (request.name) {
    case "export_top":
      exportTop();
      break;

    case "export_blog":
      exportBlog(request.param.charaId);
      break;
  }

  return true;
});

// switch (true) {
//   case location.href === "https://jp.finalfantasyxiv.com/lodestone/":
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       if (request == "export_top") {
//         exportTop();
//       }
//     });
//   case location.href === "https://jp.finalfantasyxiv.com/lodestone/character/39124727/blog/":
//     chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       if (request == "export_blog") {
//         exportBlog();
//       }
//     });
// }

const exportTop = () => {
  console.log("exportTop");
  // https://jp.finalfantasyxiv.com/lodestone/

  // <a href="/lodestone/character/39124727/" onclick="ldst_ga('send', 'event', 'lodestone_li', 'pc_column', 'ja_mychr');" class="heading--side__icon icon-list__side js__tooltip" data-tooltip="もっと見る"></a>
  let charaId = "";
  const charaIdEle = document.querySelector(".heading--side__icon") as HTMLLinkElement;
  const m = charaIdEle.href.match(/\/([0-9]+)\//);
  if (m && m.length > 1) {
    charaId = m[1];
  }
  console.log(charaId);

  // <p class="frame__chara__name frame__chara__name--side">Kako Jun</p>
  const charaNameEle = document.querySelector(".frame__chara__name");
  const charaName = charaNameEle.innerHTML;
  console.log(charaName);

  chrome.runtime.sendMessage({ name: "export_top_res", param: { charaId, charaName } });

  // <a href="/lodestone/character/39124727/blog/" onclick="ldst_ga('send', 'event', 'lodestone_li', 'pc_mymenu', 'ja_myblog');">日記</a>
  const blogUrl = `/lodestone/character/${charaId}/blog/`;
  location.href = blogUrl;
};

const exportBlog = (charaId) => {
  console.log("exportBlog");

  // <a href="/lodestone/character/39124727/blog/5001098/" class="entry__blog__link">
  const blogUrls = [];
  const blogEles = document.querySelectorAll(".entry__blog__link") as NodeListOf<HTMLLinkElement>;
  for (const blogEle of blogEles) {
    blogUrls.push(blogEle.href);
  }

  console.log("blogUrls", blogUrls);

  // <a href="https://jp.finalfantasyxiv.com/lodestone/character/39124727/blog/?page=2" class="icon-list__pager btn__pager__next js__tooltip" data-tooltip="次へ"></a>
  // <a href="javascript:void(0);" class="icon-list__pager btn__pager__next btn__pager__no"></a>
  let nextUrl = "";
  const nextEle = document.querySelector(".btn__pager__next") as HTMLLinkElement;
  const m = nextEle.href.match(/https/);
  if (m && m.length > 0) {
    nextUrl = m.input;
  }
  console.log(nextUrl);

  chrome.runtime.sendMessage({ name: "export_blog_res", param: { blogUrls, nextUrl } });
  if (nextUrl !== "") {
    location.href = nextUrl;
  }
};
