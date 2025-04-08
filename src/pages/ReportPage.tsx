
import { useState } from "react";
import { FileDown } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useExpenses } from "@/context/ExpensesContext";
import { formatDate, formatCurrency } from "@/lib/utils";
import * as XLSX from 'xlsx';
import { toast } from "@/components/ui/use-toast";

const ReportPage = () => {
  const { expenses, getExpensesByDateRange } = useExpenses();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleGenerateReport = () => {
    if (!startDate && !endDate) {
      toast({
        title: "Date range required",
        description: "Please select at least one date to generate a report",
        variant: "destructive",
      });
      return;
    }

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Set end date to end of day
    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    const filteredExpenses = getExpensesByDateRange(start, end);
    
    if (filteredExpenses.length === 0) {
      toast({
        title: "No expenses found",
        description: "No expenses found in the selected date range",
        variant: "destructive",
      });
      return;
    }

    // Export to Excel
    exportToExcel(filteredExpenses, start, end);
  };

  const exportToExcel = (filteredExpenses: any[], start: Date, end: Date) => {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create report title and date range
    const reportTitle = `Expense Report: ${formatDate(start)} to ${formatDate(end)}`;
    
    // Prepare data for summary sheet
    const summaryData = [
      [reportTitle],
      ['Date Range', `${formatDate(start)} to ${formatDate(end)}`],
      ['Total Expenses', formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))],
      ['Number of Expenses', filteredExpenses.length.toString()],
      []
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Prepare data for detailed expenses
    const expenseHeaders = ['Date', 'Category', 'Description', 'Amount'];
    const expenseData = [
      expenseHeaders,
      ...filteredExpenses.map(expense => [
        formatDate(new Date(expense.date)),
        expense.category,
        expense.description,
        expense.amount
      ])
    ];
    
    const expensesSheet = XLSX.utils.aoa_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');

    // Prepare data for category summary
    const categoryMap = new Map();
    filteredExpenses.forEach(expense => {
      const category = expense.category;
      const currentSum = categoryMap.get(category) || 0;
      categoryMap.set(category, currentSum + expense.amount);
    });
    
    const categoryData = [
      ['Category', 'Total Amount', 'Percentage'],
      ...Array.from(categoryMap.entries()).map(([category, amount]) => [
        category,
        formatCurrency(amount),
        `${((amount / filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(2)}%`
      ])
    ];
    
    const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
    
    // Generate filename based on date range
    const fileName = `Expense_Report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}.xlsx`;
    
    // Write to file and download
    XLSX.writeFile(workbook, fileName);
    
    toast({
      title: "Report generated",
      description: `Your report has been downloaded as ${fileName}`,
    });
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
