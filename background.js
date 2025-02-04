async function closeDuplicateTabs(tabId, changeInfo, tab) {
    if (changeInfo.url && tab.cookieStoreId) {
        const { exclusions } = await browser.storage.local.get({ exclusions: [] });

        // Check if URL matches any exclusion regex
        if (exclusions.some((pattern) => new RegExp(pattern).test(changeInfo.url))) {
            return; // Skip processing for excluded URLs
        }

        const tabs = await browser.tabs.query({ cookieStoreId: tab.cookieStoreId });
        for (const otherTab of tabs) {
            if (otherTab.id !== tabId && otherTab.url === changeInfo.url) {
                await browser.tabs.remove(otherTab.id);

                // Show non-intrusive notification
                browser.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Tab Stolen!',
                    message: `Closed duplicate tab: ${changeInfo.url}`,
                    requireInteraction: true,
                });
                console.log(`Closed duplicate tab: ${changeInfo.url}`);
                break; // Only remove one duplicate
            }
        }
    }
}

browser.tabs.onUpdated.addListener(closeDuplicateTabs);
