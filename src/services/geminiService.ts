import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const getVeoAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });

export interface LeadInsight {
  summary: string;
  hotnessScore: number; // 0-100
  followUpSuggestion: string;
  reasoning: string;
}

export async function getLeadInsights(leadData: any): Promise<LeadInsight> {
  const prompt = `Analyze the following business lead and provide actionable insights.
  
  Lead Details:
  - Name: ${leadData.name}
  - Industry: ${leadData.industry}
  - Description: ${leadData.description}
  - Products Interested In: ${leadData.products}
  - Budget/Scale: ${leadData.scale || "Not specified"}
  - Current Status: ${leadData.status}
  
  Return a structured JSON object.`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            hotnessScore: { type: Type.NUMBER },
            followUpSuggestion: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["summary", "hotnessScore", "followUpSuggestion", "reasoning"]
        }
      }
    });

    if (!response.text) throw new Error("No response from Gemini");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini AI Insight Error:", error);
    throw error;
  }
}

export async function generateMessage(leadData: any, type: 'email' | 'whatsapp' | 'reel', context?: string): Promise<string> {
  let prompt = "";
  if (type === 'reel') {
    prompt = `Generate a high-energy, viral 15-30 second video reel script for: ${context}.
    Include:
    - Scene descriptions in brackets [ ]
    - Spoken narration
    - Audio/Music cues
    - On-screen text overlays
    Target Audience: Business professionals on social media.`;
  } else {
    prompt = `Generate a highly personalized ${type === 'email' ? 'email' : 'WhatsApp message'} for:
    - Name: ${leadData.name}
    - Industry: ${leadData.industry}
    - Context: ${context || "Outreach"}
    
    Constraint: ${type === 'whatsapp' ? 'Short, direct, conversational.' : 'Professional with a clear subject line.'}`;
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "No content generated.";
  } catch (error) {
    console.error("Gemini Message Generation Error:", error);
    throw error;
  }
}

export async function generateMarketingImage(prompt: string): Promise<string> {
  const fullPrompt = `Create a high-quality professional marketing graphic or illustration for: ${prompt}. 
  The image should be optimized for social media ads. 
  Aesthetic: Clean, modern, vibrant, and professional. 
  No watermarks.`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          text: fullPrompt
        }
      ],
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Extract the image from candidates
    const candidate = response.candidates?.[0];
    if (candidate && candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback to a high quality tech image if generation fails to keep UI functional
    const keywords = prompt.split(' ').slice(0, 3).join(',');
    return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&keyword=${encodeURIComponent(keywords)}`;
  }
}

export async function generateReelVideo(prompt: string): Promise<string> {
  try {
    // Check for API key if using Veo
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    const ai = getVeoAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: `Marketing reel for: ${prompt}. High energy, trending style, professional cinematography, 9:16 vertical orientation.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    // Poll for completion (max 5 minutes)
    let attempts = 0;
    while (!operation.done && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      attempts++;
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation timed out or failed");
    
    return videoUri;
  } catch (error) {
    console.error("Gemini Video Generation Error:", error);
    // Fallback to a high-quality placeholder video to keep UI functional
    return "https://assets.mixkit.co/videos/preview/mixkit-business-people-shaking-hands-in-an-office-4318-large.mp4";
  }
}
export async function generateEmailSubject(leadData: any, messageBody: string): Promise<string> {
  const prompt = `Generate a compelling, professional, and personalized email subject line for:
  - Lead Name: ${leadData.name}
  - Industry: ${leadData.industry}
  - Message Body Preview: ${messageBody.substring(0, 500)}...
  
  Constraint: Keep it under 60 characters and avoid spammy keywords. Return ONLY the subject line text.`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim().replace(/^Subject: /i, "") || "Connect with LeadPulse";
  } catch (error) {
    console.error("Gemini Subject Generation Error:", error);
    return "Value Proposal from LeadPulse";
  }
}
