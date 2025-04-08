
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Expense, ExpenseCategory } from "@/types"
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data utils
export const generateId = () => Math.random().toString(36).substring(2, 10);

export const getExpenseCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case "Travel":
      return "plane";
    case "Stay":
      return "hotel";
    case "Local conveyance":
      return "car";
    case "Food":
      return "utensils";
    case "Miscellaneous":
      return "package";
    case "Toll/Parking charges":
      return "parking";
    default:
      return "circle";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const exportToExcel = (expenses: Expense[], startDate?: string, endDate?: string) => {
  // Prepare data for export
  const workbook = XLSX.utils.book_new();
  
  // Report summary
  const dateRange = startDate && endDate 
    ? `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
    : startDate 
      ? `From ${new Date(startDate).toLocaleDateString()}`
      : endDate 
        ? `Until ${new Date(endDate).toLocaleDateString()}`
        : 'All Expenses';
        
  const reportSummary = [
    ['Expense Report'],
    ['Date Range', dateRange],
    ['Total Expenses', formatCurrency(getTotalExpenses(expenses))],
    [],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(reportSummary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Report Summary');
  
  // Expenses detail
  const expensesData = [
    ['Date', 'Category', 'Description', 'Amount'],
    ...expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      expense.description,
      expense.amount
    ])
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses Detail');
  
  // Category summary
  const categories = Array.from(new Set(expenses.map(expense => expense.category)));
  const categoryData = [
    ['Category', 'Total Amount'],
    ...categories.map(category => [
      category,
      expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    ])
  ];
  
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
  
  // Generate file name
  const fileName = `Expense_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Export workbook
  XLSX.writeFile(workbook, fileName);
};
