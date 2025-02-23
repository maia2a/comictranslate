import Tesseract from "tesseract.js";

async function translatePage() {
  const images = document.querySelectorAll('img'); // Get all images on the page

  for (const img of images) {
    const imageUrl = img.src;

    // Use Tesseract to recognize text from the image
    const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
      logger: info => console.log(info)
    });

    console.log("Texto reconhecido:", text);

    // Translate the text
    const translatedText = await translateText(text, 'pt-br');
    console.log("Texto traduzido:", translatedText);

    //Render the translated text
    renderTranslatedText(img, translatedText);
  }
}

async function translateText(text, targetLanguage) {
  const response = await fetch(`https://libretranslate.com/translate`, {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: targetLanguage
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const { translatedText } = await response.json();
  return translatedText;
}

function renderTranslatedText(imgElement, translatedText) {
  
}