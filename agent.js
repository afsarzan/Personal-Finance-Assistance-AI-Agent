import { Groq } from 'groq-sdk';

console.log(process.env.GROQ_API_KEY)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "user",
      "content": "Hi how are you?"
    }
  ],
  "model": "openai/gpt-oss-20b",
  "temperature": 1,
  "max_completion_tokens": 8192,
  "top_p": 1,
  "stream": true,
  "reasoning_effort": "medium",
  "stop": null
});

for await (const chunk of chatCompletion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

