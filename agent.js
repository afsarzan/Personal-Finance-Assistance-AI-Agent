import { Groq } from "groq-sdk";

console.log(process.env.GROQ_API_KEY);
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callAgent() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `You are Faraz, a personal finance assistant. your task is to assist user with their expenses, balances and financial planning.
          current datetime: ${new Date().toUTCString()}`,
      },
      {
        role: "user",
        content: "How much money I have spent this month?",
      },
    ],
    model: "openai/gpt-oss-20b",
    tools: [
      {
        type: "function",
        function: {
          name: "getTotalExpense",
          description: "Get total expense between two dates",
          parameters: {
            type: "object",
            properties: {
              from: {
                type: "string",
                description: "Start date in YYYY-MM-DD format",
              },
              to: {
                type: "string",
                description: "End date in YYYY-MM-DD format",
              },
            },
          },
        },
      },
    ],
  });
  console.log(JSON.stringify(chatCompletion.choices[0], null, 2));
}

callAgent();

/**
 * Get total  expense
 */

function getTotalExpense({ from, to }) {
  // return expenses.reduce((total, expense) => total + expense.amount, 0);
  console.log("Calling expense tool");

  return 2500;
}
