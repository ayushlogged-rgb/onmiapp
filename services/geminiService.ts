import { GoogleGenAI, Type, Modality } from "@google/genai";
import { MathQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text to ${targetLanguage}. Return only the translated text without quotes or explanations.\n\nText: "${text}"`,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Translation error:", error);
    return "Error during translation. Please check connection.";
  }
};

export const generateMathQuestions = async (topic: string, difficulty: string): Promise<MathQuestion[]> => {
  if (!apiKey) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 multiple-choice math questions about ${topic} at a ${difficulty} level.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "answer", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText) as MathQuestion[];
  } catch (error) {
    console.error("Math generation error:", error);
    return [];
  }
};

export const chatResponse = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are a helpful AI assistant. You can write code, explain concepts, and help with tasks. When writing code, use markdown code blocks.",
            }
        });
        const result = await chat.sendMessage({ message });
        return result.text || "No response generated.";
    } catch (error) {
        console.error("Chat error:", error);
        return "I'm having trouble connecting right now.";
    }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    if (!apiKey) return null;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image gen error:", error);
        return null;
    }
};

export const generateSpeech = async (text: string, voiceName: string): Promise<string | null> => {
    if (!apiKey) return null;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("TTS error:", error);
        return null;
    }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Audio, mimeType: mimeType } },
                    { text: "Transcribe this audio exactly as spoken." }
                ]
            }
        });
        return response.text || "Transcription failed.";
    } catch (error) {
        console.error("Transcription error:", error);
        return "Error during transcription.";
    }
};