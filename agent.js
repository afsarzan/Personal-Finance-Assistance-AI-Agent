import { Groq } from "groq-sdk";
import readline from "node:readline/promises";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const expenseDB = [];
const incomeDB = [];

async function callAgent() {
  const messages = [
    {
      role: "system",
      content: `You are Faraz, a personal finance assistant. your task is to assist user with their expenses, balances and financial planning.
      Always respond in a concise and clear manner.
      Use the provided tools to fetch or update expense data as needed.
      Make sure to confirm actions like adding expenses or incomes.
      Provide summaries of expenses when requested.
      Today's
      You have access to following tools:
      1. getTotalExpense({from, to}): string // Get total expense for a time period.
      2. addExpense({name, amount}): string // Add new expense to the expense database.
      3. addIncome({name, amount}): string // Add new income to income database.
      4. getMoneyBalance(): string // Get remaining money balance from database.

      current datetime: ${new Date().toUTCString()}`,
    },
  ];

  // messages.push({
  //   role: "user",
  //   content: "How much money I have spent this month?",
  // });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    // reading from termi
    const question = await rl.question(
      "Enter your message (or 'exit' to quit): "
    );

    if (question.toLowerCase() === "exit") {
      break;
    }

    messages.push({ role: "user", content: question });

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
                    type: "string",
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
      // console.log(JSON.stringify(completion.choices[0], null, 2));

      const tool_calls = completion.choices[0].message.tool_calls;

      if (!tool_calls) {
        console.log("Final Response:", completion.choices[0].message.content);
        break;
      }

      for (const tool of tool_calls) {
        const functionName = tool.function.name;
        const functionArgs = JSON.parse(tool.function.arguments);
        let result = "";
        // console.log({ functionName, functionArgs });
        if (functionName === "getTotalExpense") {
          result = getTotalExpense(functionArgs);
          // console.log(`Total expense from ${args.from} to ${args.to}: $${result}`);
        } else if (functionName === "getAddExpense") {
          result = addExpense(functionArgs);
        } else if (functionName === "addIncome") {
          result = addIncome(functionArgs);
        } else if (functionName === "getMoneyBalance") {
          result = getMoneyBalance(functionArgs);
        }

        messages.push({
          role: "tool",
          tool_call_id: tool.id,
          name: functionName,
          content: result.toString(),
        });
      }
    }
  }
  rl.close();
  // console.log({ messages });
  // console.log({ expenseDB });
}

callAgent();

/**
 * Get total  expense
 */
function getTotalExpense({ from, to }) {
  const expense = expenseDB.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  return `Total expense from ${from} to ${to} is $${expense}`;
}

/**
 * add expense
 */
function addExpense({ name, amount }) {
  expenseDB.push({ name, amount, date: new Date() });
  console.log("Adding expense tool");
  return "Expense added successfully";
}

function addIncome({ name, amount }) {
  incomeDB.push({ name, amount });
  return "Added to the income database.";
}

function getMoneyBalance() {
  const totalIncome = incomeDB.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseDB.reduce((acc, item) => acc + item.amount, 0);

  return `${totalIncome - totalExpense} INR`;
}
