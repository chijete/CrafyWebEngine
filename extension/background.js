var extension_global_config = {
  'ChatGPTLink': 'https://chatgpt.com/?crafyEngineFirstTime=1',
  'ChatGPTFocusTab': false,
  'GeminiLink': 'https://gemini.google.com/app?crafyEngineFirstTime=1',
  'GeminiFocusTab': true,
  'GoogleImagesLink': 'https://www.google.com/search?q={query}&tbm=isch#crafyEngineFirstTime=1',
  'GoogleImagesFocusTab': false,
  'CopilotDesignerLink': 'https://www.bing.com/images/create?crafyEngineFirstTime=1',
  'CopilotDesignerFocusTab': false,
  'CopilotDesignerBaseLink': 'bing.com/images/create',
  'CopilotLink': 'https://copilot.microsoft.com/?crafyEngineFirstTime=1',
  'CopilotFocusTab': false,
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Crafy Web Engine] Extension instalada');
});

// Función para abrir la URL, rellenar el formulario y leer el HTML en segundo plano
function accessAndFillForm(queryId, instructions, targetURL, activeTab = false) {
  chrome.tabs.create({ url: targetURL, active: activeTab }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (info.status === 'complete' && tabId === tab.id) {
        var executeScriptParams = {
          target: { tabId: tab.id }
        };
        if (
          !targetURL.includes(extension_global_config['CopilotDesignerBaseLink'])
        ) {
          executeScriptParams.files = ['content.js'];
        }
        chrome.scripting.executeScript(executeScriptParams, () => {
          // Leer el HTML después de que el formulario haya sido enviado y procesado
          chrome.tabs.sendMessage(tab.id, {
            action: 'readHtml',
            tabId: tab.id,
            queryId: queryId,
            instructions: instructions
          });
        });
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
}

function getCurrentTabId() {
  return new Promise(function (resolve, reject) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        let currentTabId = tabs[0].id;
        resolve(currentTabId);
      } else {
        resolve(false);
      }
    });
  });
}

async function downloadFile(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      return blob; // Retornar el Blob si es necesario usarlo más tarde
    })
    .catch(error => {
      throw error; // Propagar el error para manejarlo más adelante
    });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

var extensionQueryList = {};

// Escuchar mensajes desde otras partes de la extensión o desde páginas web externas
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  var queryId = crypto.randomUUID();
  extensionQueryList[queryId] = {
    'sendResponsePageFunction': sendResponse,
    'message': message
  };
  getCurrentTabId().then(function (currentTabId) {
    extensionQueryList[queryId]['originTabId'] = currentTabId;

    var focusTab = null;
    if (message.focusTab !== undefined) {
      focusTab = message.focusTab;
    }
    if (message.action === 'sendToChatGPT') {
      if (focusTab === null) {
        focusTab = extension_global_config['ChatGPTFocusTab'];
      }
      accessAndFillForm(queryId, message, extension_global_config['ChatGPTLink'], focusTab);
    } else if (message.action === 'sendToGemini') {
      if (focusTab === null) {
        focusTab = extension_global_config['GeminiFocusTab'];
      }
      accessAndFillForm(queryId, message, extension_global_config['GeminiLink'], focusTab);
    } else if (message.action === 'sendToCopilotDesigner') {
      if (focusTab === null) {
        focusTab = extension_global_config['CopilotDesignerFocusTab'];
      }
      accessAndFillForm(queryId, message, extension_global_config['CopilotDesignerLink'], focusTab);
    } else if (message.action === 'sendToCopilot') {
      if (focusTab === null) {
        focusTab = extension_global_config['CopilotFocusTab'];
      }
      accessAndFillForm(queryId, message, extension_global_config['CopilotLink'], focusTab);
    } else if (message.action === 'searchImagesOnGoogle') {
      if (focusTab === null) {
        focusTab = extension_global_config['GoogleImagesFocusTab'];
      }
      finalLink = extension_global_config['GoogleImagesLink'].replace('{query}', message.query.trim().replace(/ /g, '+'));
      accessAndFillForm(queryId, message, finalLink, focusTab);
    } else if (message.action === 'downloadFile') {
      var finalAnswer = {
        'ok': false
      };
      downloadFile(message.url).then(function (blob) {
        blobToBase64(blob).then(function (base64) {
          finalAnswer['ok'] = true;
          finalAnswer['result'] = {
            'size': blob.size,
            'type': blob.type,
            'content': base64,
          };
          sendResponse({
            answer: finalAnswer
          });
        });
      }).catch(function (error) {
        finalAnswer['error'] = error;
        sendResponse({
          answer: finalAnswer
        });
      });
    }

  });
});

// Escuchar mensajes enviados desde content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "allWebHtml") {
    chrome.tabs.remove(message.tab_id);
    if (extensionQueryList[message.queryId]['message']['backToCurrentTab']) {
      chrome.tabs.update(extensionQueryList[message.queryId]['originTabId'], { active: true });
    }
    extensionQueryList[message.queryId]['sendResponsePageFunction']({
      answer: message.finalAnswer
    });
  }
});