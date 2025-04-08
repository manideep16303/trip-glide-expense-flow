
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseCategory } from "@/types";
import { useExpenses } from "@/context/ExpensesContext";

const getCategoryColor = (category: ExpenseCategory) => {
  switch (category) {
    case "Food":
      return "bg-yellow-100 text-yellow-800";
    case "Travel":
      return "bg-blue-100 text-blue-800";
    case "Stay":
      return "bg-purple-100 text-purple-800";
    case "Local conveyance":
      return "bg-green-100 text-green-800";
    case "Miscellaneous":
      return "bg-gray-100 text-gray-800";
    case "Toll/Parking charges":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ExpensesPage = () => {
  const { user } = useAuth();
  const { expenses, deleteExpense } = useExpenses();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsEditExpenseOpen(true);
  };

  const handleCloseEditExpense = () => {
    setSelectedExpense(null);
    setIsEditExpenseOpen(false);
  };

  return (
    <PageLayout>
      <div className="container pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Expenses</h1>
          <Button onClick={() => setIsAddExpenseOpen(true)} className="flex items-center gap-1">
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </Button>
        </div>

        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No expenses added yet.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-4"
              >
                Add Your First Expense
              </Button>
            </div>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditExpense(expense)}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{expense.description}</h3>
                      <Badge className={`text-xs ${getCategoryColor(expense.category)}`} variant="outline">
                        {expense.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <ExpenseForm
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          mode="create"
        />

        {selectedExpense && (
          <ExpenseForm
            isOpen={isEditExpenseOpen}
            onClose={handleCloseEditExpense}
            expense={selectedExpense}
            mode="edit"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default ExpensesPage;
