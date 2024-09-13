import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { projectName, description, sections } = await req.json()

        const prompt = `Generate a concise, professional README.md for a project with the following details:
    Project Name: ${projectName}
    Description: ${description}

    **Sections:**
    ${sections.map((section: { title: any; content: any; }) => `- **${section.title}**: ${section.content}`).join('\n')}

    Please provide content for each section, including any additional sections you think are necessary for a comprehensive README. The output should be in Markdown format.`;

        // Use the correct model name for Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // ... rest of your code for parsing sections ...

        return NextResponse.json({ sections: parsedSections });
    } catch (error) {
        console.error('Error generating README:', error);
        return NextResponse.json(
            { error: 'Failed to generate README' },
            { status: 500 }
        );
    }
}