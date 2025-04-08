
import { useState } from "react";
import { FileDown } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useExpenses } from "@/context/ExpensesContext";
import { exportToExcel } from "@/lib/utils";

const ReportPage = () => {
  const { expenses } = useExpenses();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = () => {
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date

      return expenseDate >= start && expenseDate <= end;
    });

    exportToExcel(filteredExpenses, startDate, endDate);
  };

  return (
    <PageLayout>
      <div className="container pb-20">
        <h1 className="text-2xl font-bold mb-6">Generate Expense Report</h1>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">From Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">To Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button
              onClick={handleGenerateReport}
              className="w-full mt-6"
              disabled={expenses.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Generate Excel Report
            </Button>
            
            {expenses.length === 0 && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                No expenses available to generate a report
              </p>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReportPage;
