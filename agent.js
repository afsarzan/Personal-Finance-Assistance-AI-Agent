import { Groq } from 'groq-sdk';

console.log(process.env.GROQ_API_KEY)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


async function callAgent(){
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: "You are Faraz, a personal finance assistant. your task is to assist user with their expenses, balances and financial planning."
      },
      {
        "role": "user",
        "content": "Hi how much money I have?"
      }
    ],
    "model": "openai/gpt-oss-20b"
  }); 
  console.log(JSON.stringify(chatCompletion.choices[0], null, 2));
}


callAgent()