import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', // Using imagen-3.0-generate-002 as it's the standard for image generation
      prompt: 'A cartoonified 2D vector art avatar of a young Indian man with short dark hair, wearing round wireframe glasses, smiling brightly, wearing a green collarless shirt (kurta), holding a sparkler. Festive background with bokeh lights. Clean, vibrant, game UI style avatar.',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const base64EncodeString = response.generatedImages[0].image.imageBytes;
    fs.writeFileSync('public/professorP.png', Buffer.from(base64EncodeString, 'base64'));
    console.log('Image generated and saved to public/professorP.png');
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generate();
