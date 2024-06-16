// ChatGPT.js library: https://github.com/KudoAI/chatgpt.js

console.log('Crafy Engine inserted!');

var workingOnItSignal = `
<div style="display: block; visibility: visible; width: 250px; height: 250px; background: #1FC276; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px; border-radius: 10px; z-index: 19000; margin: 0;">
  <p style="display: block; visibility: visible; font-size: 25px; font-weight: bold; font-family: sans-serif; color: #fff; text-align: center; margin: 0; padding: 0;">Crafy Engine está trabajando</p>
  <p style="display: block; visibility: visible; font-size: 22px; font-family: sans-serif; color: #fff; text-align: center; margin-top: 8px; padding: 0;">Por favor espere...</p>
  <p style="display: block; visibility: visible; font-size: 18px; font-family: sans-serif; color: #fff; text-align: center; margin-top: 5px; padding: 0;">Please wait...</p>
</div>
`;

var gptSystemConfig = {
  'textareaQuerySelector': '#prompt-textarea',
  'buttonQuerySelector': '[data-testid="fruitjuice-send-button"]',
  'iaMessagesQuerySelector': '[data-message-author-role="assistant"] .markdown.prose',
  'checkNewMessagesMinEqualTimes': 3,
};

function helper_sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function helper_waitForLoaded() {
  var whileController = true;
  while (whileController) {
    var textareaItem = document.querySelector(gptSystemConfig['textareaQuerySelector']);
    if (textareaItem !== undefined && textareaItem !== null) {
      whileController = false;
    } else {
      await helper_sleep(500);
    }
  }
  return true;
}

function helper_getReceivedMessages() {
  var resultado = [];
  var elementos = document.querySelectorAll(gptSystemConfig['iaMessagesQuerySelector']);
  for (const elemento of elementos) {
    let pElems = elemento.querySelectorAll('p');
    if (pElems.length > 0) {
      pText = '';
      var firstTime = true;
      for (const pElm of pElems) {
        if (firstTime) {
          pText += pElm.innerText;
          firstTime = false;
        } else {
          pText += '\n' + pElm.innerText;
        }
      }
      resultado.push(pText);
    }
  }
  return resultado;
}

async function helper_waitForMessage() {
  var whileController = true;
  var lastMessageTextSaved = '';
  var lastMessageTextEqualTimes = 0;

  while (whileController) {
    var receivedMessages = helper_getReceivedMessages();

    if (receivedMessages.length > 0) {
      var lastMessageText = receivedMessages[0];
      if (lastMessageText != lastMessageTextSaved) {
        lastMessageTextSaved = lastMessageText;
      } else {
        lastMessageTextEqualTimes += 1;
        if (lastMessageTextEqualTimes > gptSystemConfig['checkNewMessagesMinEqualTimes']) {
          // On new message
          whileController = false;
          break;
        }
      }
    }

    await helper_sleep(500);

  }

  return lastMessageTextSaved;
}

async function helper_waitForAppairInDOM(
  querySelectorString,
  querySelectorIndex = 0,
  maxTryCount = false,
  sleepTime = 300
) {
  var whileController = true;
  var whileCounter = 0;
  var finalResult = false;
  while (whileController) {
    whileCounter += 1;
    var allItems = document.querySelectorAll(querySelectorString);
    if (allItems !== undefined && allItems !== null) {
      if (allItems[querySelectorIndex] !== undefined) {
        finalResult = true;
        whileController = false;
        break;
      }
    }
    if (maxTryCount !== false && whileCounter >= maxTryCount) {
      whileController = false;
      break;
    }
    await helper_sleep(sleepTime);
  }
  return finalResult;
}

async function helper_deleteLastChat() {
  try {
    var optionsButton = document.querySelectorAll('ol li')[0].querySelector('button');
    // var optionsButtonParent = optionsButton.parentElement.parentElement;
    // optionsButtonParent.classList.remove('hidden');
    // optionsButtonParent.style.display = 'flex';
    var event = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      pointerType: 'touch', // Simular un evento de pantalla táctil
      // Puedes agregar más propiedades según sea necesario
    });
    optionsButton.dispatchEvent(event);
    var findedInDom_0 = await helper_waitForAppairInDOM(
      'div[role="menuitem"]',
      3,
      10,
      300
    );
    if (findedInDom_0) {
      document.querySelectorAll('div[role="menuitem"]')[3].click();
      var findedInDom_1 = await helper_waitForAppairInDOM(
        '[role="dialog"] [as="button"]',
        0,
        10,
        300
      );
      if (findedInDom_1) {
        document.querySelectorAll('[role="dialog"] [as="button"]')[0].click();
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Google Gemini

var geminiSystemConfig = {
  'textareaQuerySelector': 'rich-textarea',
  'buttonQuerySelector': '[mat-icon-button].send-button',
  'iaMessagesQuerySelector': 'message-content.model-response-text',
  'checkNewMessagesMinEqualTimes': 6,
};

async function gemini_waitForLoaded() {
  var whileController = true;
  while (whileController) {
    var textareaItem = document.querySelector(geminiSystemConfig['textareaQuerySelector']);
    if (textareaItem !== undefined && textareaItem !== null) {
      whileController = false;
    } else {
      await helper_sleep(500);
    }
  }
  return true;
}

async function gemini_sendMessage(messageText) {
  var textareaItem = document.querySelector(geminiSystemConfig['textareaQuerySelector']);
  if (textareaItem !== null && textareaItem !== undefined) {
    textareaItem.focus();
    document.execCommand('insertText', false, messageText);
    await helper_sleep(500);
    var sendButtonItem = document.querySelector(geminiSystemConfig['buttonQuerySelector']);
    if (sendButtonItem !== null && sendButtonItem !== undefined) {
      sendButtonItem.click();
      return true;
    }
  }
  return false;
}

function gemini_getReceivedMessages() {
  var resultado = [];
  var elementos = document.querySelectorAll(geminiSystemConfig['iaMessagesQuerySelector']);
  for (const elemento of elementos) {
    resultado.push(elemento.innerText);
  }
  return resultado;
}

async function gemini_waitForMessage() {
  var whileController = true;
  var lastMessageTextSaved = '';
  var lastMessageTextEqualTimes = 0;

  while (whileController) {
    var receivedMessages = gemini_getReceivedMessages();

    if (receivedMessages.length > 0 && receivedMessages[0].length > 0) {
      var lastMessageText = receivedMessages[0];
      if (lastMessageText != lastMessageTextSaved) {
        lastMessageTextSaved = lastMessageText;
      } else {
        lastMessageTextEqualTimes += 1;
        if (lastMessageTextEqualTimes > geminiSystemConfig['checkNewMessagesMinEqualTimes']) {
          // On new message
          whileController = false;
          break;
        }
      }
    }

    await helper_sleep(500);

  }

  return lastMessageTextSaved;
}

// Copilot Designer

var copilotDesignerSystemConfig = {
  'textareaQuerySelector': '[name="q"]',
  'buttonQuerySelector': '#create_btn_c',
  'generateImagesQuerySelector': '#mmComponent_images_as_1 img',
};

async function copilotDesigner_waitForLoaded() {
  var whileController = true;
  while (whileController) {
    var textareaItem = document.querySelector(copilotDesignerSystemConfig['textareaQuerySelector']);
    if (textareaItem !== undefined && textareaItem !== null) {
      whileController = false;
    } else {
      await helper_sleep(500);
    }
  }
  return true;
}

async function copilotDesigner_sendMessage(messageText) {
  var textareaItem = document.querySelector(copilotDesignerSystemConfig['textareaQuerySelector']);
  if (textareaItem !== null && textareaItem !== undefined) {
    textareaItem.focus();
    document.execCommand('insertText', false, messageText);
    await helper_sleep(500);
    var sendButtonItem = document.querySelector(copilotDesignerSystemConfig['buttonQuerySelector']);
    if (sendButtonItem !== null && sendButtonItem !== undefined) {
      sendButtonItem.click();
      return true;
    }
  }
  return false;
}

async function copilotDesigner_waitForGenerated() {
  var whileController = true;
  var finalResult = [];
  while (whileController) {
    var generatedImagesImgs = document.querySelectorAll(copilotDesignerSystemConfig['generateImagesQuerySelector']);
    if (
      generatedImagesImgs !== undefined &&
      generatedImagesImgs !== null &&
      generatedImagesImgs.length > 0
    ) {
      whileController = false;
      for (const imgItem of generatedImagesImgs) {
        finalResult.push(imgItem.src);
      }
    } else {
      await helper_sleep(500);
    }
  }
  return finalResult;
}

function helper_insertWorkingMessage(instructions) {
  if (instructions.insertWorkingMessage) {
    var workingSignalDiv = document.createElement('div');
    workingSignalDiv.innerHTML = workingOnItSignal;
    workingSignalDiv.style.display = 'block';
    workingSignalDiv.style.visibility = 'visible';
    document.body.appendChild(workingSignalDiv);
  }
}

// Copilot

var copilotSystemConfig = {
  'checkNewMessagesMinEqualTimes': 6,
};

async function copilot_waitForLoaded() {
  var whileController = true;
  var textareaItem;
  while (whileController) {
    var copilotButtonFounded = false;

    textareaItem = document.querySelector('[product="bing"]');
    if (textareaItem !== null) {
      textareaItem = textareaItem.shadowRoot.querySelector('#cib-conversation-main [slot="side-panel"]');
      if (textareaItem !== null) {
        textareaItem = textareaItem.shadowRoot.querySelector('[personatype="Copilot"]');
        if (textareaItem !== null) {
          textareaItem = textareaItem.shadowRoot.querySelector('button');
          if (textareaItem !== null) {
            copilotButtonFounded = true;
          }
        }
      }
    }

    if (copilotButtonFounded) {
      whileController = false;
    } else {
      await helper_sleep(500);
    }
  }
  return textareaItem;
}

async function copilot_sendMessage(messageText) {
  var textareaItem = document.querySelectorAll('[product="bing"]')[0].shadowRoot.querySelectorAll('#cib-action-bar-main')[0].shadowRoot.querySelectorAll('cib-text-input[chat-type="consumer"]')[0].shadowRoot.querySelector('#searchbox');
  if (textareaItem !== null && textareaItem !== undefined) {
    textareaItem.focus();
    document.execCommand('insertText', false, messageText);
    await helper_sleep(500);
    var sendButtonItem = document.querySelectorAll('[product="bing"]')[0].shadowRoot.querySelectorAll('#cib-action-bar-main')[0].shadowRoot.querySelectorAll('.control.submit [is="cib-button"]')[0];
    if (sendButtonItem !== null && sendButtonItem !== undefined) {
      sendButtonItem.click();
      return true;
    }
  }
  return false;
}

function copilot_getReceivedMessages() {
  var resultado = [];
  var elementos = document.querySelectorAll('[product="bing"]')[0].shadowRoot.querySelectorAll('#cib-conversation-main')[0].shadowRoot.querySelectorAll('cib-chat-turn')[0].shadowRoot.querySelectorAll('cib-message-group[source="bot"]');
  for (const elemento of elementos) {
    var elementContainer = elemento.shadowRoot.querySelectorAll('cib-message[finalized]')[0];
    if (elementContainer !== undefined) {
      resultado.push(elementContainer.shadowRoot.querySelectorAll('cib-shared')[0].querySelectorAll('.ac-textBlock')[0].innerText);
    }
  }
  return resultado;
}

async function copilot_waitForMessage() {
  var whileController = true;
  var lastMessageTextSaved = '';
  var lastMessageTextEqualTimes = 0;

  while (whileController) {
    var receivedMessages = copilot_getReceivedMessages();

    if (receivedMessages.length > 0 && receivedMessages[0].length > 0) {
      var lastMessageText = receivedMessages[0];
      if (lastMessageText != lastMessageTextSaved) {
        lastMessageTextSaved = lastMessageText;
      } else {
        lastMessageTextEqualTimes += 1;
        if (lastMessageTextEqualTimes > copilotSystemConfig['checkNewMessagesMinEqualTimes']) {
          // On new message
          whileController = false;
          break;
        }
      }
    }

    await helper_sleep(500);

  }

  return lastMessageTextSaved;
}

// Función para rellenar el formulario y enviarlo
async function fillForm(tabId, queryId, instructions, chatgpt) {

  helper_insertWorkingMessage(instructions);

  var finalAnswer = null;

  if (instructions.action === 'sendToChatGPT') {
    await helper_waitForLoaded();
    await helper_sleep(1000);
    if (instructions.iaction == 'translateText') {
      try {
        const translation = await chatgpt.translate(instructions.text, instructions.target_language);
        await helper_deleteLastChat();
        finalAnswer = {
          'result': translation,
          'ok': true
        };
      } catch (error) {
        finalAnswer = {
          'error': error,
          'ok': false
        };
      }
    } else if (instructions.iaction == 'sendMessage') {
      try {
        const response = await chatgpt.askAndGetReply(instructions.text);
        await helper_deleteLastChat();
        finalAnswer = {
          'result': response,
          'ok': true
        };
      } catch (error) {
        finalAnswer = {
          'error': error,
          'ok': false
        };
      }
    }
  } else if (instructions.action === 'sendToGemini') {
    finalAnswer = {
      'ok': false
    };
    await gemini_waitForLoaded();
    await helper_sleep(300);
    if (instructions.iaction == 'sendMessage') {
      var messageSended = await gemini_sendMessage(instructions.text);
      if (messageSended) {
        var receivedMessage = await gemini_waitForMessage();
        finalAnswer['ok'] = true;
        finalAnswer['result'] = receivedMessage;
      }
    }
  } else if (instructions.action === 'sendToCopilot') {
    finalAnswer = {
      'ok': false
    };
    var gptButton = await copilot_waitForLoaded();
    await helper_sleep(300);
    gptButton.click();
    await helper_sleep(1500);
    if (instructions.iaction == 'sendMessage') {
      var messageSended = await copilot_sendMessage(instructions.text);
      if (messageSended) {
        var receivedMessage = await copilot_waitForMessage();
        finalAnswer['ok'] = true;
        finalAnswer['result'] = receivedMessage;
      }
    }
  } else if (instructions.action === 'sendToCopilotDesigner') {
    finalAnswer = {
      'ok': false
    };
    await copilotDesigner_waitForLoaded();
    await helper_sleep(300);
    if (instructions.iaction == 'generateImage') {
      var messageSended = await copilotDesigner_sendMessage(instructions.text);
      if (messageSended) {
        localStorage.setItem('crafyEngine_persistantCopilotDesigner_generating', JSON.stringify({
          'tabId': tabId,
          'queryId': queryId,
          'instructions': instructions
        }));
        return true;
      }
    }
  } else if (instructions.action === 'searchImagesOnGoogle') {
    finalAnswer = {
      'ok': false
    };
    try {
      var data = document.body.innerHTML.split('google.plm(r);})();(function(){var m=');
      if (data[1]) {
        data = data[1].split('};var ');
        data = data[0] + '}';
        var data_object = JSON.parse(data);
        var imagesDatas = [];
        for (const [key, objectItem] of Object.entries(data_object)) {
          if (objectItem[1] && Array.isArray(objectItem[1])) {
            if (objectItem[1][3] && Array.isArray(objectItem[1][3])) {
              if (objectItem[1][3].length >= 3) {
                var imageData = {
                  'url': objectItem[1][3][0],
                  'height': objectItem[1][3][1],
                  'width': objectItem[1][3][2],
                };
                if (objectItem[1][2] && Array.isArray(objectItem[1][2])) {
                  if (objectItem[1][2].length >= 3) {
                    imageData['preview'] = {
                      'url': objectItem[1][2][0],
                      'height': objectItem[1][2][1],
                      'width': objectItem[1][2][2],
                    };
                  }
                }
                var lastIndex = objectItem[1].length - 1;
                if (objectItem[1][lastIndex]) {
                  if (objectItem[1][lastIndex][2003] && Array.isArray(objectItem[1][lastIndex][2003])) {
                    if (objectItem[1][lastIndex][2003].length >= 4) {
                      imageData['source'] = {
                        'url': objectItem[1][lastIndex][2003][2],
                        'title': objectItem[1][lastIndex][2003][3],
                      };
                    }
                  }
                }
                imagesDatas.push(imageData);
              }
            }
          }
        }
        finalAnswer['ok'] = true;
        finalAnswer['result'] = imagesDatas;
      }
    } catch (error) {
      finalAnswer['error'] = error;
    }
  }

  sendMessageToBackground(tabId, queryId, finalAnswer);

}

async function managePersistantCopilotDesigner(persistantInfo) {
  if (persistantInfo.instructions.action === 'sendToCopilotDesigner') {
    if (persistantInfo.instructions.iaction == 'generateImage') {
      // Se está generando una imagen
      localStorage.removeItem('crafyEngine_persistantCopilotDesigner_generating');
      var generatedImagesSrcs = await copilotDesigner_waitForGenerated();
      var generateImagesLinks = [];
      if (generatedImagesSrcs.length > 0) {
        for (const imageSrc of generatedImagesSrcs) {
          let url = new URL(imageSrc);
          url.searchParams.set('w', '1000');
          url.searchParams.set('h', '1000');
          generateImagesLinks.push(url.href);
        }
      }
      sendMessageToBackground(persistantInfo.tabId, persistantInfo.queryId, {
        'ok': true,
        'result': generateImagesLinks
      });
    }
  }
}

function sendMessageToBackground(tabId, queryId, finalAnswer) {
  chrome.runtime.sendMessage({
    action: "allWebHtml",
    tab_id: tabId,
    queryId: queryId,
    finalAnswer: finalAnswer
  }, function (response) {
    console.log("Respuesta recibida desde background.js:", response);
  });
}

function checkIfIsFirstTimeWurl() {
  let cadenaBusqueda = window.location.search;
  let parametros = new URLSearchParams(cadenaBusqueda);
  if (parametros.has('crafyEngineFirstTime')) {
    return true;
  } else {
    if (window.location.hash.includes('crafyEngineFirstTime')) {
      return true;
    } else {
      return false;
    }
  }
}

var global_chatgpt;

if (checkIfIsFirstTimeWurl()) {
  // Escuchar mensajes desde el script de fondo
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Crafy Engine] Geted runtime message');
    if (message.action === 'readHtml') {
      (async () => {
        const { chatgpt } = await import(chrome.runtime.getURL('chatgpt.js'));
        global_chatgpt = chatgpt;
        fillForm(message.tabId, message.queryId, message.instructions, chatgpt);
      })();
    }
  });
} else {
  var persistantCopilotDesignerInfo = localStorage.getItem('crafyEngine_persistantCopilotDesigner_generating');
  console.log('persistantCopilotDesignerInfo', persistantCopilotDesignerInfo);
  if (persistantCopilotDesignerInfo !== undefined && persistantCopilotDesignerInfo !== null) {
    var persistantCopilotDesignerInfo_dec = JSON.parse(persistantCopilotDesignerInfo);
    helper_insertWorkingMessage(persistantCopilotDesignerInfo_dec.instructions);
    managePersistantCopilotDesigner(persistantCopilotDesignerInfo_dec);
  }
}