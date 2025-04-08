import { useState, useEffect } from "react";
import { Expense, ExpenseCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useExpenses } from "@/context/ExpensesContext";
import { useTrips } from "@/context/TripsContext";

export interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
  mode: "create" | "edit";
  tripId?: string;
}

const expenseCategories: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Stay",
  "Local conveyance",
  "Miscellaneous",
  "Toll/Parking charges",
];

export const ExpenseForm = ({ isOpen, onClose, expense, mode, tripId }: ExpenseFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Miscellaneous");
  const [date, setDate] = useState<Date>(new Date());
  
  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const { addExpense: addTripExpense, updateExpense: updateTripExpense, deleteExpense: deleteTripExpense } = useTrips();

  useEffect(() => {
    if (expense && mode === "edit") {
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setCategory(expense.category);
      setDate(expense.date);
    } else {
      resetForm();
    }
  }, [expense, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "create") {
      if (tripId) {
        addTripExpense(tripId, {
          amount: parseFloat(amount),
          description,
          category,
          date,
        });
      } else {
        addExpense({
          amount: parseFloat(amount),
          description,
          category,
          date,
        });
      }
    } else if (expense) {
      if (tripId) {
        updateTripExpense(expense.id, {
          amount: parseFloat(amount),
          description,
          category,
          date,
        });
      } else {
        updateExpense(expense.id, {
          amount: parseFloat(amount),
          description,
          category,
          date,
        });
      }
    }
    
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (expense) {
      if (tripId) {
        deleteTripExpense(expense.id);
      } else {
        deleteExpense(expense.id);
      }
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("Miscellaneous");
    setDate(new Date());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Expense" : "Edit Expense"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Enter the details for your new expense" 
              : "Update the expense details"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ExpenseCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the expense"
              rows={3}
              required
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {mode === "edit" && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {mode === "create" ? "Add Expense" : "Update Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
