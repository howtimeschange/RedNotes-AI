
import { GoogleGenAI, Type } from "@google/genai";
import { CopyOption } from "../types";

export const generateXHSContent = async (
  topic: string,
  imageData?: string,
  imageType?: string
): Promise<CopyOption[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `
    你是一位资深的小红书（Xiaohongshu/Red）博主，擅长创作高点击、高互动的爆款文案。
    请根据用户提供的主题和图片内容，生成 3 种不同风格的文案：
    1. 种草干货风：侧重于实用价值、功能点和攻略。
    2. 情感氛围风：侧重于情绪价值、生活感悟、审美氛围。
    3. 标题党吸睛风：侧重于夸张标题、强烈对比或反转。
    
    文案规范：
    - 标题：包含 Emoji，长度适中，具有视觉冲击力。
    - 正文：段落清晰，多用 Emoji，语气活泼亲切，像是在和闺蜜聊天。
    - 标签：在文案末尾提供 5-8 个相关热门话题标签。
  `;

  const prompt = `主题是：${topic}`;
  
  const parts: any[] = [{ text: prompt }];
  if (imageData && imageType) {
    parts.push({
      inlineData: {
        data: imageData.split(',')[1],
        mimeType: imageType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            style: { type: Type.STRING }
          },
          required: ["title", "content", "tags", "style"]
        }
      }
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text);
};
