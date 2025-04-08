
export type User = {
  id: string;
  email: string;
  name: string;
};

export type ExpenseCategory = 
  | "TA/DA"
  | "Hotel/Accommodation"
  | "Local conveyance"
  | "Food"
  | "Miscellaneous"
  | "Toll/Parking charges";

export type Expense = {
  id: string;
  tripId: string;
  date: Date;
  amount: number;
  description: string;
  category: ExpenseCategory;
};

export type Trip = {
  id: string;
  userId: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  status: "draft" | "active" | "completed";
  description?: string;
  destination?: string;
  expenses: Expense[];
};
