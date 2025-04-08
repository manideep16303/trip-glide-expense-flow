
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Expense, ExpenseCategory, Trip, User } from "@/types"
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data utils
export const generateId = () => Math.random().toString(36).substring(2, 10);

export const getExpenseCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case "TA/DA":
      return "plane";
    case "Hotel/Accommodation":
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

export const generateMockTrips = (userId: string): Trip[] => {
  return [
    {
      id: generateId(),
      userId,
      title: "New York Client Meeting",
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 2, 18),
      status: "completed",
      destination: "New York",
      description: "Meeting with XYZ Corp about new project",
      expenses: [
        {
          id: generateId(),
          tripId: "trip1",
          date: new Date(2024, 2, 15),
          amount: 350,
          description: "Flight to New York",
          category: "TA/DA",
        },
        {
          id: generateId(),
          tripId: "trip1",
          date: new Date(2024, 2, 15),
          amount: 180,
          description: "Hotel - Night 1",
          category: "Hotel/Accommodation",
        },
        {
          id: generateId(),
          tripId: "trip1",
          date: new Date(2024, 2, 16),
          amount: 35,
          description: "Taxi to client office",
          category: "Local conveyance",
        },
        {
          id: generateId(),
          tripId: "trip1",
          date: new Date(2024, 2, 16),
          amount: 65,
          description: "Lunch with client",
          category: "Food",
        },
      ],
    },
    {
      id: generateId(),
      userId,
      title: "Chicago Conference",
      startDate: new Date(2024, 3, 1),
      endDate: null,
      status: "active",
      destination: "Chicago",
      description: "Annual industry conference",
      expenses: [
        {
          id: generateId(),
          tripId: "trip2",
          date: new Date(2024, 3, 1),
          amount: 250,
          description: "Flight to Chicago",
          category: "TA/DA",
        },
        {
          id: generateId(),
          tripId: "trip2",
          date: new Date(2024, 3, 1),
          amount: 210,
          description: "Hotel - Night 1",
          category: "Hotel/Accommodation",
        },
      ],
    },
  ];
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

export const exportToExcel = (trip: Trip, fileName?: string) => {
  // Prepare data for export
  const workbook = XLSX.utils.book_new();
  
  // Trip summary
  const tripSummary = [
    ['Trip Summary'],
    ['Title', trip.title],
    ['Start Date', formatDate(trip.startDate)],
    ['End Date', trip.endDate ? formatDate(trip.endDate) : 'Ongoing'],
    ['Status', trip.status],
    ['Destination', trip.destination || ''],
    ['Description', trip.description || ''],
    ['Total Expenses', formatCurrency(getTotalExpenses(trip.expenses))],
    [],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(tripSummary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Trip Summary');
  
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
  XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');
  
  // Generate file name
  const defaultFileName = `${trip.title.replace(/\s+/g, '_')}_Expenses.xlsx`;
  
  // Export workbook
  XLSX.writeFile(workbook, fileName || defaultFileName);
};
