<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testing Zone | Crafy Web Engine</title>
  <style>
    .imagesGallery {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 5px;
    }

    .imagesGallery img {
      display: block;
      max-width: 100%;
      max-height: 200px;
    }
  </style>
</head>
<body>

  <h1>Testing Zone 🛠️ - Crafy Web Engine</h1>

  <p>Extension ID</p>
  <input type="text" id="extensionIdInput" placeholder="ID de la extensión">

  <h1>ChatGPT Translator</h1>

  <input type="text" id="text_input" placeholder="Ingresa un texto">
  <select id="lang_selector">
    <option value="Brazilian Portuguese">Portugués de Brasil</option>
    <option value="english">Inglés</option>
    <option value="spanish">Español</option>
  </select>
  <button type="button" id="submit_button">TRADUCIR</button>
  <p id="translation_result"></p>

  <h1>ChatGPT Speak</h1>
  <textarea id="text_input_speak" placeholder="Ingresa un mensaje"></textarea>
  <button type="button" id="submit_button_speak">ENVIAR</button>
  <p id="speak_result"></p>

  <h1>Gemini Speak</h1>
  <textarea id="gemini_text_input_speak" placeholder="Ingresa un mensaje"></textarea>
  <button type="button" id="gemini_submit_button_speak">ENVIAR</button>
  <p id="gemini_speak_result"></p>

  <h1>Copilot Speak</h1>
  <textarea id="copilot_text_input_speak" placeholder="Ingresa un mensaje"></textarea>
  <button type="button" id="copilot_submit_button_speak">ENVIAR</button>
  <p id="copilot_speak_result"></p>

  <h1>Google Images</h1>
  <input type="text" id="googleImages_input" placeholder="Ingresa una búsqueda">
  <button type="button" id="googleImages_button">BUSCAR</button>
  <div class="imagesGallery" id="googleImages_result"></div>

  <p>Imagen descargada:</p>
  <div id="googleImages_downloaded"></div>

  <h1>Copilot Designer</h1>
  <input type="text" id="copilotDesigner_input" placeholder="Ingresa un prompt">
  <button type="button" id="copilotDesigner_button">CREAR IMAGEN</button>
  <div class="imagesGallery" id="copilotDesigner_result"></div>

  <script>
    // ID de tu extensión (reemplaza con tu propio ID)
    var extensionId = 'hkhcmbahgehppppaacemehfgkbaifgdk';

    var extensionIdInput = document.getElementById('extensionIdInput');
    extensionIdInput.oninput = function () {
      extensionId = extensionIdInput.value;
    };
    extensionIdInput.value = extensionId;

    var text_input = document.getElementById('text_input');
    var lang_selector = document.getElementById('lang_selector');
    var submit_button = document.getElementById('submit_button');
    var translation_result = document.getElementById('translation_result');

    var text_input_speak = document.getElementById('text_input_speak');
    var submit_button_speak = document.getElementById('submit_button_speak');
    var speak_result = document.getElementById('speak_result');

    var gemini_text_input_speak = document.getElementById('gemini_text_input_speak');
    var gemini_submit_button_speak = document.getElementById('gemini_submit_button_speak');
    var gemini_speak_result = document.getElementById('gemini_speak_result');

    var copilot_text_input_speak = document.getElementById('copilot_text_input_speak');
    var copilot_submit_button_speak = document.getElementById('copilot_submit_button_speak');
    var copilot_speak_result = document.getElementById('copilot_speak_result');

    var googleImages_input = document.getElementById('googleImages_input');
    var googleImages_button = document.getElementById('googleImages_button');
    var googleImages_result = document.getElementById('googleImages_result');

    var googleImages_downloaded = document.getElementById('googleImages_downloaded');

    var copilotDesigner_input = document.getElementById('copilotDesigner_input');
    var copilotDesigner_button = document.getElementById('copilotDesigner_button');
    var copilotDesigner_result = document.getElementById('copilotDesigner_result');

    function translateText() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          action: 'sendToChatGPT',
          iaction: 'translateText',
          text: text_input.value,
          target_language: lang_selector.value
        }, (response) => {
          if (response.answer.ok) {
            translation_result.innerHTML = response.answer.result.replace(/\n/g, '<br>');
          } else {
            translation_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    function sendMessageToGPT() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          focusTab: true, // opcional
          backToCurrentTab: true, // opcional
          insertWorkingMessage: true, // opcional
          action: 'sendToChatGPT',
          iaction: 'sendMessage',
          text: text_input_speak.value
        }, (response) => {
          console.log(response);
          if (response.answer.ok) {
            speak_result.innerHTML = response.answer.result.replace(/\n/g, '<br>');
          } else {
            speak_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    function sendMessageToGemini() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          backToCurrentTab: true, // opcional
          insertWorkingMessage: true, // opcional
          action: 'sendToGemini',
          iaction: 'sendMessage',
          text: gemini_text_input_speak.value.replace(/\n{2,}/g, '\n')
        }, (response) => {
          if (response.answer.ok) {
            gemini_speak_result.innerHTML = response.answer.result.replace(/\n/g, '<br>');
          } else {
            gemini_speak_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    function sendMessageToCopilot() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          focusTab: true, // opcional
          backToCurrentTab: true, // opcional
          insertWorkingMessage: true, // opcional
          action: 'sendToCopilot',
          iaction: 'sendMessage',
          text: copilot_text_input_speak.value.replace(/\n{2,}/g, '\n')
        }, (response) => {
          if (response.answer.ok) {
            copilot_speak_result.innerHTML = response.answer.result.replace(/\n/g, '<br>');
          } else {
            copilot_speak_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    function getImagesFromGoogle() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          backToCurrentTab: false, // opcional
          insertWorkingMessage: false, // opcional
          action: 'searchImagesOnGoogle',
          query: googleImages_input.value
        }, (response) => {
          console.log('Google Images', response);
          if (response.answer.ok) {
            googleImages_result.innerHTML = '';
            for (const imageData of response.answer.result) {
              var imageItem = document.createElement('img');
              imageItem.src = imageData.preview.url;
              imageItem.setAttribute('loading', 'lazy');
              if (imageData.source) {
                imageItem.setAttribute('title', imageData.source['title']);
                imageItem.onclick = function () {
                  // window.open(imageData.source['url'], '_blank');
                  downloadImage(imageData.url);
                };
              }
              googleImages_result.appendChild(imageItem);
            }
          } else {
            googleImages_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    function downloadFile(file_url) {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          action: 'downloadFile',
          url: file_url
        }, (response) => {
          if (response.answer.ok) {
            resolve(response.answer.result);
          } else {
            resolve(false);
          }
        });
      });
    }

    function downloadImage(image_url) {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          action: 'downloadFile',
          url: image_url
        }, (response) => {
          if (response.answer.ok) {
            googleImages_downloaded.innerHTML = '';
            var imageItem = document.createElement('img');
            imageItem.src = response.answer.result.content;
            googleImages_downloaded.appendChild(imageItem);
          } else {
            googleImages_downloaded.innerHTML = '<b>Ha ocurrido un error al descargar!</b>';
          }
        });
      });
    }

    function generateImageWithCopilotDesigner() {
      return new Promise(function (resolve, reject) {
        chrome.runtime.sendMessage(extensionId, {
          focusTab: true, // opcional
          backToCurrentTab: true, // opcional
          insertWorkingMessage: true, // opcional
          action: 'sendToCopilotDesigner',
          iaction: 'generateImage',
          text: copilotDesigner_input.value
        }, (response) => {
          console.log('Copilot Designer', response);
          if (response.answer.ok) {
            copilotDesigner_result.innerHTML = '';
            for (const imageCopilotURL of response.answer.result) {
              downloadFile(imageCopilotURL).then(function (downloadedImage) {
                if (downloadedImage !== false) {
                  var imageItem = document.createElement('img');
                  imageItem.src = downloadedImage.content;
                  imageItem.setAttribute('loading', 'lazy');
                  copilotDesigner_result.appendChild(imageItem);
                }
              });
            }
          } else {
            copilotDesigner_result.innerHTML = '<b>Ha ocurrido un error!</b>';
          }
        });
      });
    }

    submit_button.onclick = function () {
      translateText();
    };

    submit_button_speak.onclick = function () {
      sendMessageToGPT();
    };

    gemini_submit_button_speak.onclick = function () {
      sendMessageToGemini();
    };

    copilot_submit_button_speak.onclick = function () {
      sendMessageToCopilot();
    };

    googleImages_button.onclick = function () {
      getImagesFromGoogle();
    };

    copilotDesigner_button.onclick = function () {
      generateImageWithCopilotDesigner();
    };
  </script>
  
</body>
</html>