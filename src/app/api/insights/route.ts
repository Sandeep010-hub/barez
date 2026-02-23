import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    try {
        const { question, dataSummary } = (await req.json()) as { question: string; dataSummary: Record<string, unknown> };

        // 1. Move OpenAI instance inside the handler to prevent top-level crashes
        // 2. Add safety check for the API key
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
            return NextResponse.json({
                answer: `Simulation Mode: [${question}] - To see real AI insights, please provide an OpenAI API Key in .env.local.`
            });
        }

        if (!question || !dataSummary) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful sales analyst for Baarez. Answer in 2-3 sentences. Dataset info: ${JSON.stringify(dataSummary)}`,
                },
                {
                    role: 'user',
                    content: question,
                },
            ],
            max_tokens: 150,
        });

        return NextResponse.json({ answer: response.choices[0].message.content });
    } catch (error: unknown) {
        console.error('AI Insights Error:', error);
        return NextResponse.json({ error: 'Failed to fetch AI insights' }, { status: 500 });
    }
}
