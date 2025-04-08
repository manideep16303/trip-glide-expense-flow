
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { useAuth } from "./AuthContext";
import { generateId } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type NewExpense = Omit<Expense, "id" | "userId">;

type ExpensesContextType = {
  expenses: Expense[];
  addExpense: (expense: NewExpense) => void;
  updateExpense: (id: string, expense: Partial<NewExpense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
  getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
};

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
};

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load expenses from localStorage when the component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedExpenses = localStorage.getItem(`expenses_${user.id}`);
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses).map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        setExpenses(parsedExpenses);
      } else {
        // Add some sample expenses for testing
        const sampleExpenses = getSampleExpenses(user.id);
        setExpenses(sampleExpenses);
        localStorage.setItem(`expenses_${user.id}`, JSON.stringify(sampleExpenses));
      }
    } else {
      setExpenses([]);
    }
  }, [user]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  const addExpense = (newExpense: NewExpense) => {
    if (!user) return;

    const expense: Expense = {
      id: generateId(),
      userId: user.id,
      ...newExpense
    };

    setExpenses(prev => [expense, ...prev]);
    
    toast({
      title: "Expense added",
      description: "Your expense has been added successfully."
    });
  };

  const updateExpense = (id: string, updatedExpenseData: Partial<NewExpense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...expense, ...updatedExpenseData } 
          : expense
      )
    );
    
    toast({
      title: "Expense updated",
      description: "Your expense has been updated successfully."
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    
    toast({
      title: "Expense deleted",
      description: "Your expense has been deleted successfully."
    });
  };

  const getExpensesByCategory = (category: ExpenseCategory) => {
    return expenses.filter(expense => expense.category === category);
  };

  const getExpensesByDateRange = (startDate: Date, endDate: Date) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByCategory,
        getExpensesByDateRange
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

// Helper function to generate sample expenses for testing
const getSampleExpenses = (userId: string): Expense[] => {
  return [
    {
      id: generateId(),
      userId,
      date: new Date(2024, 2, 15),
      amount: 45.75,
      description: "Lunch with client",
      category: "Food",
    },
    {
      id: generateId(),
      userId,
      date: new Date(2024, 2, 15),
      amount: 89.50,
      description: "Taxi to conference",
      category: "Travel",
    },
    {
      id: generateId(),
      userId,
      date: new Date(2024, 3, 2),
      amount: 195.00,
      description: "Hotel - Business Trip",
      category: "Stay",
    },
    {
      id: generateId(),
      userId,
      date: new Date(2024, 3, 5),
      amount: 12.50,
      description: "Parking fee",
      category: "Toll/Parking charges",
    },
  ];
};
