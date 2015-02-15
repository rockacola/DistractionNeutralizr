// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Touching [' + tab.url + '] !');
  
    chrome.tabs.insertCSS(tab.id, {
        file: "src/bg/background-style.css"
    });
        
    chrome.tabs.executeScript(null, { file: "js/jquery/jquery.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "src/bg/background-script.js" });
    });
});