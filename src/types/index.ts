
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
