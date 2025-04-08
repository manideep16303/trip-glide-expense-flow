
import { useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ExpenseListProps {
  expenses: Expense[];
  tripId: string;
}

const ExpenseList = ({ expenses, tripId }: ExpenseListProps) => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteExpense } = useTrips();

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "TA/DA":
        return "bg-blue-100 text-blue-800";
      case "Hotel/Accommodation":
        return "bg-purple-100 text-purple-800";
      case "Local conveyance":
        return "bg-green-100 text-green-800";
      case "Food":
        return "bg-yellow-100 text-yellow-800";
      case "Miscellaneous":
        return "bg-gray-100 text-gray-800";
      case "Toll/Parking charges":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No expenses added yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="expense-card">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{expense.description}</h3>
                  <Badge className={cn("text-xs", getCategoryColor(expense.category))} variant="outline">
                    {expense.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(expense.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditClick(expense)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteClick(expense)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Expense Dialog */}
      {selectedExpense && (
        <ExpenseForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedExpense(null);
          }}
          tripId={tripId}
          expense={selectedExpense}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// This is needed to prevent a TypeScript error in the component
const cn = (...args: any[]) => args.join(' ').trim();

export default ExpenseList;
