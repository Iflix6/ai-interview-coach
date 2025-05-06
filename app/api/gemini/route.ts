// app/api/gemini/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, history } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            // System instruction
            {
              role: 'user',
              parts: [
                {
                  text: 'You are an AI interview coach named Olivia Wild. Be concise, helpful, and encouraging. Keep responses short and friendly, under 100 words.',
                },
              ],
            },
            // Conversation history
            ...history.map((msg: { role: string; content: string }) => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }],
            })),
            // Current user prompt
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error('Error in Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}