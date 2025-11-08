import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callAgent() {
  const messages = [
    {
      role: "system",
      content: `You are Faraz, a personal finance assistant. your task is to assist user with their expenses, balances and financial planning.
          current datetime: ${new Date().toUTCString()}`,
    },
  ];

  messages.push({
    role: "user",
    content: "How much money I have spent this month?",
  });

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
      ],
    });
    console.log(JSON.stringify(completion.choices[0], null, 2));

    const tool_calls = completion.choices[0].message.tool_calls;

    if (!tool_calls) {
      console.log("Final Response:", completion.choices[0].message.content);
      break;
    }

    for (const tool of tool_calls) {
      const functionName = tool.function.name;
      const functionArgs = tool.function.arguments;
      console.log({ functionName, functionArgs });
      let result = "";
      if (functionName === "getTotalExpense") {
        const args = JSON.parse(functionArgs);
        result = getTotalExpense(functionArgs);
        // console.log(`Total expense from ${args.from} to ${args.to}: $${result}`);
      }
      messages.push({
        role: "tool",
        tool_call_id: tool.id,
        name: functionName,
        content: result.toString(),
      });
    }
  }
  // console.log({ messages });
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
