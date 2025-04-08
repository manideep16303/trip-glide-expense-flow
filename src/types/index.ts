
export type User = {
  id: string;
  email: string;
  name: string;
  position?: string;
  department?: string;
  employeeId?: string;
  phoneNumber?: string;
};

export type ExpenseCategory = 
  | "Food"
  | "Travel"
  | "Stay"
  | "Local conveyance"
  | "Miscellaneous"
  | "Toll/Parking charges";

export type Expense = {
  id: string;
  userId: string;
  date: Date;
  amount: number;
  description: string;
  category: ExpenseCategory;
};

export type TripStatus = "draft" | "active" | "completed";

export type Trip = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  destination?: string;
  startDate: Date;
  endDate?: Date;
  status: TripStatus;
  expenses: Expense[];
};
