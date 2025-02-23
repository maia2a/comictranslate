import Tesseract from 'tesseract.js';

async function translatePage() {
  const images = document.querySelectorAll('img'); // Get all images on the page
  const canvas = new fabric.Canvas('comicCanvas');

  for (const img of images) {
    try {
      const imageUrl = img.src;
      console.log('Processando imagem:', imageUrl);

      // Use Tesseract to recognize text from the image
      const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
        logger: info => console.log(info)
      });
      console.log("Texto reconhecido:", text);

      if (!text.trim()) {
        console.log('Nenhum texto detectado na imagem.');
        continue;
      }

      // Translate the text
      const translatedText = await translateText(text, 'pt-br');
      console.log("Texto traduzido:", translatedText);

      // Render the translated text
      await renderTranslatedText(img, translatedText, canvas);
    } catch (error) {
      console.error('Erro ao processar a imagem:', error);
    }
  }
}

async function translateText(text, targetLanguage) {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
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

    if (!response.ok) {
      throw new Error(`Erro na tradução: ${response.statusText}`);
    }

    const { translatedText } = await response.json();
    return translatedText;
  } catch (error) {
    console.error('Erro na tradução:', error);
    return '';
  }
}

async function renderTranslatedText(imgElement, translatedText, canvas) {
  try {
    // Load the image to the canvas
    const img = await new Promise((resolve, reject) => {
      fabric.Image.fromURL(imgElement.src, resolve, { crossOrigin: 'anonymous' });
    });

    img.scaleToWidth(canvas.getWidth());
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

    // Create a text element to render the translated text
    const text = new fabric.Textbox(translatedText, {
      left: 50,
      top: 50,
      fill: 'white',
      fontFamily: 'Arial',
      fontSize: 24,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      textAlign: 'left',
      width: canvas.getWidth() - 100 // Ajustar largura do textbox
    });

    // Add the text element to the canvas
    canvas.add(text);
    // Render the canvas
    canvas.renderAll();
  } catch (error) {
    console.error('Erro ao renderizar texto:', error);
  }
}

// Chama a função para traduzir a página
translatePage();