import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_api_key',
});

const SYSTEM_PROMPT = `You are a strict JSON generator.

Your ONLY job is to extract structured data from a client message and produce a complete project package.

CRITICAL RULES:
- Output MUST be valid JSON
- Do NOT include any text before or after the JSON
- Do NOT include explanations
- Do NOT include markdown formatting
- Do NOT include comments
- Always return ALL 6 fields
- If data is missing, use an empty string ""
- Keep each field's content detailed, professional, and production-ready

You must follow this schema EXACTLY:
{
  "brief": "A comprehensive executive summary of the client's needs, goals, and project context",
  "scope": "Detailed list of features, deliverables, milestones, and technical requirements",
  "pricing": "Itemized cost breakdown with line items, hourly rates or fixed costs, and a total",
  "proposal": "A formal, professional proposal document ready to send to the client",
  "tasks": "Actionable development tasks broken into phases with clear descriptions",
  "followup": "A professional email reply to the client confirming next steps"
}`;

export async function POST(req: Request) {
  try {
    const { projectTitle, clientMessage } = await req.json();

    if (!projectTitle || !clientMessage) {
      return NextResponse.json(
        { error: 'projectTitle and clientMessage are required' },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Project Title: ${projectTitle}\n\nClient Message:\n${clientMessage}`,
        },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.15,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const output = JSON.parse(raw);

    // Ensure all 6 keys exist
    const keys = ['brief', 'scope', 'pricing', 'proposal', 'tasks', 'followup'] as const;
    for (const key of keys) {
      if (typeof output[key] !== 'string') {
        output[key] = '';
      }
    }

    return NextResponse.json(output);
  } catch (_error: unknown) {
    return NextResponse.json(
      {
        brief: 'Auto-generated summary — AI service was temporarily unavailable.',
        scope:
          '1. Authentication & user management\n2. Core database schema\n3. Dashboard UI\n4. API integrations\n5. Testing & QA',
        pricing:
          'Discovery & Planning: $800\nDesign: $1,200\nDevelopment: $2,500\nTesting & Launch: $500\n\nTotal Estimated Cost: $5,000 USD',
        proposal:
          `# Project Proposal\n\nThank you for reaching out. Based on your requirements, we propose a 4-week engagement covering design, development, and deployment.\n\nWe will deliver a production-ready application with all specified features.`,
        tasks:
          `Phase 1 — Setup\n- [ ] Initialize repository & CI/CD\n- [ ] Configure database\n\nPhase 2 — Build\n- [ ] Implement authentication\n- [ ] Build core features\n- [ ] Integrate APIs\n\nPhase 3 — Launch\n- [ ] QA testing\n- [ ] Deploy to production`,
        followup:
          `Hi there,\n\nThank you for reaching out! I've reviewed your requirements and prepared a detailed proposal.\n\nPlease take a look and let me know if you'd like to schedule a quick call to discuss next steps.\n\nBest regards,\nSudhanshu`,
      },
      { status: 200 },
    );
  }
}
