import { useState } from "react";
import FinancialOverview from "@/components/FinancialOverview";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  // Sample financial data - in a real app, this would come from a database
  const [balance] = useState(12458.32);
  const [income] = useState(5200.0);
  const [expenses] = useState(3150.75);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Faraz Personal Finance assistant
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
          {/* Financial Overview Section */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Financial Overview
            </h2>
            <div className="flex-1">
              <FinancialOverview
                balance={balance}
                income={income}
                expenses={expenses}
              />
            </div>
          </div>

          {/* Chat Interface Section */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              AI Assistant
            </h2>
            <div className="flex-1 min-h-0">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
