
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrips } from "@/context/TripsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, getTotalExpenses, exportToExcel } from "@/lib/utils";
import ExpenseList from "@/components/expenses/ExpenseList";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, CalendarIcon, Download, Edit, MapPinIcon, Plus, Trash2 } from "lucide-react";
import { ExpenseCategory, Trip } from "@/types";
import { cn } from "@/lib/utils";

const TripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, currentTrip, setCurrentTrip, deleteTrip, completeTrip } = useTrips();
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  useEffect(() => {
    if (tripId) {
      setCurrentTrip(tripId);
    }
    
    return () => {
      setCurrentTrip(null);
    };
  }, [tripId, setCurrentTrip]);

  if (!currentTrip) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p>Trip not found. It may have been deleted or you don't have access.</p>
          <Button 
            onClick={() => navigate("/trips")} 
            variant="outline" 
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Button>
        </div>
      </PageLayout>
    );
  }

  const totalExpenses = getTotalExpenses(currentTrip.expenses);
  
  const expensesByCategory = currentTrip.expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<ExpenseCategory, typeof currentTrip.expenses>);
  
  const categoryTotals = Object.entries(expensesByCategory).map(([category, expenses]) => ({
    category,
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.length,
  }));

  const handleDeleteTrip = () => {
    deleteTrip(currentTrip.id);
    navigate("/trips");
  };

  const handleCompleteTrip = () => {
    completeTrip(currentTrip.id);
    setIsCompleteDialogOpen(false);
  };

  const handleDownloadExcel = () => {
    exportToExcel(currentTrip);
  };

  const getStatusColor = (status: typeof currentTrip.status) => {
    switch (status) {
      case "draft": return "bg-gray-200 text-gray-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/trips")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">{currentTrip.title}</h1>
          <Badge className={cn(getStatusColor(currentTrip.status))} variant="outline">
            {currentTrip.status.charAt(0).toUpperCase() + currentTrip.status.slice(1)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentTrip.status !== "completed" && (
            <Button 
              variant="outline" 
              onClick={() => setIsCompleteDialogOpen(true)}
            >
              Mark as Completed
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleDownloadExcel}
          >
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Trip
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p>{formatDate(currentTrip.startDate)} - {currentTrip.endDate ? formatDate(currentTrip.endDate) : "Present"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {currentTrip.destination && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Destination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <p>{currentTrip.destination}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {currentTrip.expenses.length} expense{currentTrip.expenses.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {currentTrip.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{currentTrip.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Expenses</h2>
        {currentTrip.status !== "completed" && (
          <Button onClick={() => setIsExpenseFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Expenses</TabsTrigger>
          <TabsTrigger value="summary">Summary by Category</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <ExpenseList expenses={currentTrip.expenses} tripId={currentTrip.id} />
        </TabsContent>
        <TabsContent value="summary" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTotals.map(({ category, total, count }) => (
              <Card key={category}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{category}</CardTitle>
                  <CardDescription>{count} expense{count !== 1 ? "s" : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(total)}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {((total / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        tripId={currentTrip.id}
        mode="create"
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip and all its expenses? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this trip as completed? This will set the end date to today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteTrip}>
              Complete Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default TripDetailsPage;
