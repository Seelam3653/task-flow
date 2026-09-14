import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ---------------------------------------------------------------------------
// 1. POST /api/ai/subtasks: AI Task Breakdown Generator
// ---------------------------------------------------------------------------
app.post('/api/ai/subtasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an executive productivity coach. Break down the following task into 3 to 5 clear, actionable, concise subtasks. Return ONLY a valid JSON array of strings with no markdown code fences or backticks.
Task Title: "${title}"
Task Description: "${description || ''}"
Example output: ["Step 1", "Step 2", "Step 3"]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const rawText = response.text?.trim() || '[]';
    const cleanedJson = rawText.replace(/^```(json)?/i, '').replace(/```$/i, '').trim();
    let subtasks: string[] = [];
    try {
      subtasks = JSON.parse(cleanedJson);
    } catch {
      subtasks = rawText.split('\n').map(s => s.replace(/^\d+[\.\)]\s*|-\s*/, '').trim()).filter(Boolean);
    }

    return res.json({ subtasks });
  } catch (error: any) {
    console.error('Error generating subtasks:', error);
    // Graceful fallback for offline / missing key situations
    return res.json({
      subtasks: [
        'Research and outline requirements',
        'Draft initial implementation',
        'Review and verify checklist items',
      ],
      warning: error.message || 'Used offline heuristic fallback',
    });
  }
});

// ---------------------------------------------------------------------------
// 2. POST /api/ai/day-plan: AI Smart Daily Schedule & Prioritizer
// ---------------------------------------------------------------------------
app.post('/api/ai/day-plan', async (req, res) => {
  try {
    const { tasks, habits } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a world-class time management strategist.
Here are the user's pending tasks:
${JSON.stringify(tasks || [])}

Here are the user's active daily habits:
${JSON.stringify(habits || [])}

Synthesize a high-leverage 3-point strategy for their day:
1. Identify the single "Frogs" (highest-leverage task that must be done first).
2. Recommend optimal Pomodoro focus blocks.
3. Suggest an energy-management habit cadence.

Format your response in concise, punchy markdown with bold highlights.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ plan: response.text || 'Daily plan generated successfully.' });
  } catch (error: any) {
    console.error('Error generating daily plan:', error);
    return res.json({
      plan: `### 🎯 Today's AI Suggested Schedule\n\n1. **Deep Work Block (09:00 - 11:30)**: Tackle your urgent pending tasks first using 25-minute Pomodoro intervals.\n2. **Habit Cadence**: Maintain your momentum by hydrating and taking a 10-minute stretch break before lunch.\n3. **Afternoon Wrap-Up**: Review progress, clear lingering subtasks, and log your habits before 18:00.`,
      warning: error.message || 'Used offline heuristic fallback',
    });
  }
});

// ---------------------------------------------------------------------------
// Vite Middleware / Static Serving
// ---------------------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskFlow full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

start();
