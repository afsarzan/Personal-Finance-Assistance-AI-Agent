import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface FinancialOverviewProps {
  balance: number;
  income: number;
  expenses: number;
}

const FinancialOverview = ({
  balance,
  income,
  expenses,
}: FinancialOverviewProps) => {
  const savings = income - expenses;
  const savingsPercentage =
    income > 0 ? ((savings / income) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <Card className="p-8 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground border-0 shadow-xl">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">Total Balance</p>
          <h2 className="text-5xl font-bold tracking-tight">
            $
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="h-4 w-4" />
            <span>+{savingsPercentage}% this month</span>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-success/20 bg-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Income
              </p>
              <div className="p-2 rounded-full bg-success/10">
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              $
              {income.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-success">This month</p>
          </div>
        </Card>

        {/* Expenses Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-destructive/20 bg-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Expenses
              </p>
              <div className="p-2 rounded-full bg-destructive/10">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              $
              {expenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-destructive">This month</p>
          </div>
        </Card>
      </div>

      {/* Savings Card */}
      <Card className="p-6 bg-gradient-to-r from-success via-success to-secondary border-0 text-success-foreground">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">Net Savings</p>
          <p className="text-3xl font-bold">
            $
            {savings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs opacity-80">{savingsPercentage}% of income</p>
        </div>
      </Card>
    </div>
  );
};

export default FinancialOverview;
