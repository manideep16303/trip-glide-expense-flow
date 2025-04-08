
import { Expense, ExpenseCategory, Trip } from "@/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateId, generateMockTrips } from "@/lib/utils";
import { useAuth } from "./AuthContext";

type TripsContextType = {
  trips: Trip[];
  isLoading: boolean;
  currentTrip: Trip | null;
  createTrip: (tripData: Omit<Trip, "id" | "userId" | "expenses">) => void;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string | null) => void;
  addExpense: (tripId: string, expense: Omit<Expense, "id" | "tripId">) => void;
  updateExpense: (expenseId: string, expenseData: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  completeTrip: (tripId: string) => void;
};

const TripsContext = createContext<TripsContextType | null>(null);

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
};

export const TripsProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrip, setCurrentTripState] = useState<Trip | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load trips from localStorage or generate mock data
      const storedTrips = localStorage.getItem(`trips-${user.id}`);
      if (storedTrips) {
        // Parse dates properly from JSON
        const parsedTrips = JSON.parse(storedTrips, (key, value) => {
          if (key === "startDate" || key === "endDate" || key === "date") {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setTrips(parsedTrips);
      } else {
        // Generate mock trips
        const mockTrips = generateMockTrips(user.id);
        setTrips(mockTrips);
        localStorage.setItem(`trips-${user.id}`, JSON.stringify(mockTrips));
      }
      setIsLoading(false);
    } else {
      setTrips([]);
      setCurrentTripState(null);
      setIsLoading(false);
    }
  }, [user]);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (user && trips.length > 0) {
      localStorage.setItem(`trips-${user.id}`, JSON.stringify(trips));
    }
  }, [trips, user]);

  const createTrip = (tripData: Omit<Trip, "id" | "userId" | "expenses">) => {
    if (!user) return;
    
    const newTrip: Trip = {
      ...tripData,
      id: generateId(),
      userId: user.id,
      expenses: [],
    };
    
    setTrips(prevTrips => [...prevTrips, newTrip]);
    toast({
      title: "Trip created",
      description: `"${tripData.title}" has been created successfully.`,
    });
  };

  const updateTrip = (tripId: string, tripData: Partial<Trip>) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? { ...trip, ...tripData } : trip
      )
    );
    
    // Update current trip if it's the one being edited
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTripState(prevTrip => prevTrip ? { ...prevTrip, ...tripData } : null);
    }
    
    toast({
      title: "Trip updated",
      description: "Trip details have been updated successfully.",
    });
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    
    // Clear current trip if it's the one being deleted
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTripState(null);
    }
    
    toast({
      title: "Trip deleted",
      description: "Trip has been deleted successfully.",
    });
  };

  const setCurrentTrip = (tripId: string | null) => {
    if (!tripId) {
      setCurrentTripState(null);
      return;
    }
    
    const trip = trips.find(t => t.id === tripId) || null;
    setCurrentTripState(trip);
  };

  const addExpense = (tripId: string, expense: Omit<Expense, "id" | "tripId">) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      tripId,
    };
    
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? 
          { ...trip, expenses: [...trip.expenses, newExpense] } : 
          trip
      )
    );
    
    // Update current trip if it's the one being edited
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTripState(prevTrip => 
        prevTrip ? 
          { ...prevTrip, expenses: [...prevTrip.expenses, newExpense] } : 
          null
      );
    }
    
    toast({
      title: "Expense added",
      description: `${expense.category} expense added successfully.`,
    });
  };

  const updateExpense = (expenseId: string, expenseData: Partial<Expense>) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => ({
        ...trip,
        expenses: trip.expenses.map(expense => 
          expense.id === expenseId ? { ...expense, ...expenseData } : expense
        )
      }))
    );
    
    // Update current trip if it contains the expense being edited
    if (currentTrip && currentTrip.expenses.some(e => e.id === expenseId)) {
      setCurrentTripState(prevTrip => 
        prevTrip ? 
          {
            ...prevTrip,
            expenses: prevTrip.expenses.map(expense => 
              expense.id === expenseId ? { ...expense, ...expenseData } : expense
            )
          } : 
          null
      );
    }
    
    toast({
      title: "Expense updated",
      description: "Expense has been updated successfully.",
    });
  };

  const deleteExpense = (expenseId: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => ({
        ...trip,
        expenses: trip.expenses.filter(expense => expense.id !== expenseId)
      }))
    );
    
    // Update current trip if it contains the expense being deleted
    if (currentTrip && currentTrip.expenses.some(e => e.id === expenseId)) {
      setCurrentTripState(prevTrip => 
        prevTrip ? 
          {
            ...prevTrip,
            expenses: prevTrip.expenses.filter(expense => expense.id !== expenseId)
          } : 
          null
      );
    }
    
    toast({
      title: "Expense deleted",
      description: "Expense has been deleted successfully.",
    });
  };

  const completeTrip = (tripId: string) => {
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        trip.id === tripId ? 
          { ...trip, status: "completed", endDate: new Date() } : 
          trip
      )
    );
    
    // Update current trip if it's the one being completed
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTripState(prevTrip => 
        prevTrip ? 
          { ...prevTrip, status: "completed", endDate: new Date() } : 
          null
      );
    }
    
    toast({
      title: "Trip completed",
      description: "Trip has been marked as completed.",
    });
  };

  return (
    <TripsContext.Provider
      value={{
        trips,
        isLoading,
        currentTrip,
        createTrip,
        updateTrip,
        deleteTrip,
        setCurrentTrip,
        addExpense,
        updateExpense,
        deleteExpense,
        completeTrip,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};
