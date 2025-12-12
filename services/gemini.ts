import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real scenario, this is injected securely

const ai = new GoogleGenAI({ apiKey });

export const generateHypeCommentary = async (battleTitle: string, genre: string, winnerName: string): Promise<string> => {
  if (!apiKey) return "Whoa! That was intense! (API Key missing)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an energetic, urban underground rap battle host announcer. 
      Write a very short (max 2 sentences), hype commentary for a battle titled "${battleTitle}" in the genre "${genre}".
      Compliment "${winnerName}" on their lead. Use slang appropriate for a music battle city setting.`,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8
      }
    });
    return response.text || "This battle is heating up!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "This battle is absolutely legendary!";
  }
};

export const generateBattleDescription = async (genre: string, mood: string): Promise<string> => {
    if (!apiKey) return `A ${mood} ${genre} battle for the ages.`;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Write a 1-sentence gritty description for a music battle mission. Genre: ${genre}. Mood: ${mood}. Keep it short and punchy like a video game mission briefing.`,
        });
        return response.text;
    } catch (e) {
        return `A ${mood} ${genre} battle for the ages.`;
    }
}