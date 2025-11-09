import { Groq } from "groq-sdk";
import express from "express";
import cors from "cors";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const messages = [
  {
    role: "system",
    content: `You are Faraz, a personal finance assistant. your task is to assist user with their expenses, balances and financial planning.
      Always respond in a concise and clear manner.
      Use the provided tools to fetch or update expense data as needed.
      Make sure to confirm actions like adding expenses or incomes.
      Provide summaries of expenses when requested.
      You have access to following tools:
      1. getTotalExpense({from, to}): string // Get total expense for a time period.
      2. addExpense({name, amount}): string // Add new expense to the expense database.
      3. addIncome({name, amount}): string // Add new income to income database.
      4. getMoneyBalance(): string // Get remaining money balance from database.

      current datetime: ${new Date().toUTCString()}`,
  },
];

const app = express();
app.use(cors());
app.use(express.json());
const port = 3033;

app.post("/getLlmResponse", async (req, res) => {
  const responseFromAgent = await callAgent(req.body.message);
  // console.log({ responseFromAgent });
  res.json({ response: responseFromAgent });
});


/**
 * get total balance
 */

app.get("/getBalance", (req, res) => {
  const balance = getMoneyBalance();
  res.json({ balance });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const expenseDB = [];
const incomeDB = [];

async function callAgent(content) {
  // console.log("agent called");

  if (content) {
    messages.push({
      role: "user",
      content: content,
    });
  }

  // Keep calling the LLM until it returns a text response (no tool calls)
  while (true) {
    const completion = await groq.chat.completions.create({
      messages,
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
        {
          type: "function",
          function: {
            name: "getAddExpense",
            description: "Add a new expense with name and amount",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Name/description of the expense eg., bought an fold phone for 2000",
                },
                amount: {
                  type: "number",
                  description: "Amount spent in USD",
                },
              },
            },
          },
        },
        {
          type: "function",
          function: {
            name: "addIncome",
            description: "Add new income entry to income database",
            parameters: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the income. e.g., Got salary",
                },
                amount: {
                  type: "number",
                  description: "Amount of the income.",
                },
              },
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getMoneyBalance",
            description: "Get remaining money balance from database.",
          },
        },
      ],
    });

    const tool_calls = completion.choices[0].message.tool_calls;
    // console.log({ tool_calls });

    // If no tool calls, return the final response and exit loop
    if (!tool_calls) {
      return completion.choices[0].message.content;
    }

    // Add assistant's message with tool calls to conversation history
    messages.push(completion.choices[0].message);

    // Process each tool call
    for (const tool of tool_calls) {
      const functionName = tool.function.name;
      const functionArgs = JSON.parse(tool.function.arguments);
      let result = "";

      if (functionName === "getTotalExpense") {
        result = getTotalExpense(functionArgs);
      } else if (functionName === "getAddExpense") {
        result = addExpense(functionArgs);
      } else if (functionName === "addIncome") {
        result = addIncome(functionArgs);
      } else if (functionName === "getMoneyBalance") {
        result = getMoneyBalance(functionArgs);
      }

      // Add tool result to conversation history
      messages.push({
        role: "tool",
        tool_call_id: tool.id,
        name: functionName,
        content: result.toString(),
      });
    }

    // Loop continues, will call LLM again with tool results
  }
}

/**
 * Get total expense
 */
function getTotalExpense({ from, to }) {
  const expense = expenseDB.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  return `Total expense from ${from} to ${to} is $${expense}`;
}

/**
 * Add expense
 */
function addExpense({ name, amount }) {
  expenseDB.push({ name, amount, date: new Date() });
  console.log("Adding expense tool");
  return "Expense added successfully";
}

/**
 * Add income
 */
function addIncome({ name, amount }) {
  incomeDB.push({ name, amount });
  return "Added to the income database.";
}

/**
 * Get money balance
 */
function getMoneyBalance() {
  const totalIncome = incomeDB.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseDB.reduce((acc, item) => acc + item.amount, 0);

  return `${totalIncome - totalExpense} INR`;
}