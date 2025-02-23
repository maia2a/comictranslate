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
  // Create a canvas element to draw the translated text
  const canvas = new fabric.Canvas('comicCanvas');

  //Load the image to the canvas
  fabric.Image.fromURL(imageElement.src, (img) => {
    img.scale(0.5);
    canvas.setWidth(img.width);
    canvas.setHeight(img.height);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

    // Create a text element to render the translated text
    const text = new fabric.Text(translatedText, {
      left: 50,
      top: 50,
      fill: 'white',
      fontFamily: 'Arial',
      fontSize: 24,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    });

    // Add the text element to the canvas
    canvas.add(text);

    // Render the canvas
    canvas.renderAll();
  });
}