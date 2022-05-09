import { useState, useEffect, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";

// import { webkit } from "playwright";

function App() {
  // state
  const [count, setCount] = useState(0);
  const [tabId, setTabId] = useState(0);
  const [charaId, setCharaId] = useState(0);
  const [charaName, setCharaName] = useState(0);
  const [blogUrls, setblogUrls] = useState<string[]>([]);

  // mounted
  useEffect(() => {
    if (tabId > 0) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("request", request);
        switch (request.name) {
          case "export_top_res":
            setCharaId(request.param.charaId);
            setCharaName(request.param.charaName);

            exportBlog(request.param.charaId);
            break;

          case "export_blog_res":
            const newBlogUrls = [...blogUrls, ...request.param.blogUrls];
            setblogUrls(newBlogUrls);
            if (request.param.nextUrl === "") {
              // download(JSON.stringify(blogUrls, null, 2));
              download("hoge");
            } else {
              exportBlog(request.param.charaId);
            }

            break;
        }

        return true;
      });
    }
  }, [tabId]);

  const wait = async (ms: number) => {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  };

  const download = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const aTag = document.createElement("a");
    aTag.href = URL.createObjectURL(blob);
    aTag.target = "_blank";
    aTag.download = "hoge.json";
    aTag.click();
    URL.revokeObjectURL(aTag.href);
  };

  // callback
  const exportTop = useCallback(() => {
    console.log("exportTop");

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let tempTabId = 0;
      console.log("tabs", tabs);
      if (tabs && tabs.length > 0) {
        tempTabId = tabs[0].id;
        setTabId(tempTabId);
      }

      console.log("tempTabId", tempTabId);
      if (tempTabId > 0) {
        chrome.tabs.sendMessage(tempTabId, { name: "export_top" });
      }
    });
  }, []);

  const exportBlog = useCallback(
    async (charaId) => {
      console.log("exportBlog");

      // console.log(0);
      await wait(3000);
      // console.log(10000);

      console.log("tabId", tabId);
      if (tabId > 0) {
        chrome.tabs.sendMessage(tabId, { name: "export_blog", param: { charaId } });
      }
    },
    [tabId]
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
          <button type="button" onClick={exportTop}>
            Export!
          </button>
          <div>{tabId}</div>
          <div>{charaId}</div>
          <div>{charaName}</div>
          <div>{JSON.stringify(blogUrls, null, 2)}</div>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
