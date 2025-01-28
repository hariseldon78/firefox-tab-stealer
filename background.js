
async function closeDuplicateTabs(tabId, changeInfo, tab) {
  if (changeInfo.url && tab.cookieStoreId) {
    const tabs = await browser.tabs.query({
      cookieStoreId: tab.cookieStoreId
    });

    for (const otherTab of tabs) {
      if (
        otherTab.id !== tabId &&
        otherTab.url === changeInfo.url
      ) {
        await browser.tabs.remove(otherTab.id);
      }
    }
  }
}

browser.tabs.onUpdated.addListener(closeDuplicateTabs);

