
async function closeDuplicateTabs(tabId, changeInfo, tab) {
    const { exclusions } = await browser.storage.local.get({ exclusions: [] });

    // Check if URL matches any exclusion regex
    if (exclusions.some((pattern) => new RegExp(pattern).test(changeInfo.url))) {
      return; // Skip processing for excluded URLs
    }

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

