document.getElementById('translateButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: translatePage,
  });
});

function translatePage() {
 console.log('Traduzindo página...');
}