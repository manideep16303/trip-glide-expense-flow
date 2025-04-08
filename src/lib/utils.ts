
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Expense, ExpenseCategory, Trip } from "@/types"
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data utils
export const generateId = () => Math.random().toString(36).substring(2, 10);

export const generateMockTrips = (userId: string): Trip[] => {
  const now = new Date();
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  return [
    {
      id: generateId(),
      userId,
      title: "Business Trip to New York",
      description: "Annual industry conference",
      destination: "New York",
      startDate: lastMonth,
      endDate: new Date(lastMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: "completed",
      expenses: [
        {
          id: generateId(),
          userId,
          date: new Date(lastMonth.getTime() + 1 * 24 * 60 * 60 * 1000),
          amount: 150,
          description: "Taxi to hotel",
          category: "Travel",
        },
        {
          id: generateId(),
          userId,
          date: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000),
          amount: 75,
          description: "Dinner with clients",
          category: "Food",
        }
      ]
    },
    {
      id: generateId(),
      userId,
      title: "Training in Chicago",
      description: "Technical certification workshop",
      destination: "Chicago",
      startDate: now,
      status: "active",
      expenses: []
    }
  ];
};

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

export const exportToExcel = (trip: Trip) => {
  // Prepare data for export
  const workbook = XLSX.utils.book_new();
  
  // Report summary
  const reportSummary = [
    ['Trip Expense Report'],
    ['Trip', trip.title],
    ['Destination', trip.destination || 'N/A'],
    ['Date Range', `${formatDate(trip.startDate)} - ${trip.endDate ? formatDate(trip.endDate) : 'Present'}`],
    ['Total Expenses', formatCurrency(getTotalExpenses(trip.expenses))],
    [],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(reportSummary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Report Summary');
  
  // Expenses detail
  const expensesData = [
    ['Date', 'Category', 'Description', 'Amount'],
    ...trip.expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      expense.description,
      expense.amount
    ])
  ];
  
  const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses Detail');
  
  // Category summary
  const categories = Array.from(new Set(trip.expenses.map(expense => expense.category)));
  const categoryData = [
    ['Category', 'Total Amount'],
    ...categories.map(category => [
      category,
      trip.expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
    ])
  ];
  
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'By Category');
  
  // Generate file name
  const fileName = `Trip_Expense_Report_${trip.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Export workbook
  XLSX.writeFile(workbook, fileName);
};
