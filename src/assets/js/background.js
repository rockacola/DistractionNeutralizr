// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Touching [' + tab.url + '] !');
  
    chrome.tabs.insertCSS(tab.id, {
        file: "css/main.css"
    });
        
    chrome.tabs.executeScript(null, { file: "js/app.js" });
});