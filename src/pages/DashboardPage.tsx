
import { useEffect } from "react";
import { useTrips } from "@/context/TripsContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, getTotalExpenses } from "@/lib/utils";
import TripGrid from "@/components/trips/TripGrid";
import PageLayout from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateTripForm from "@/components/trips/CreateTripForm";

const DashboardPage = () => {
  const { trips, isLoading, setCurrentTrip } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);

  const activeTrips = trips.filter((trip) => trip.status === "active");
  const completedTrips = trips.filter((trip) => trip.status === "completed");
  const draftTrips = trips.filter((trip) => trip.status === "draft");

  const totalActiveExpenses = activeTrips.reduce(
    (total, trip) => total + getTotalExpenses(trip.expenses),
    0
  );

  const totalCompletedExpenses = completedTrips.reduce(
    (total, trip) => total + getTotalExpenses(trip.expenses),
    0
  );

  const handleViewTrip = (tripId: string) => {
    setCurrentTrip(tripId);
    navigate(`/trips/${tripId}`);
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setIsCreateTripOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Trips</CardTitle>
            <CardDescription>Currently ongoing trips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTrips.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total expenses: {formatCurrency(totalActiveExpenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed Trips</CardTitle>
            <CardDescription>Finished travel records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTrips.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total expenses: {formatCurrency(totalCompletedExpenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Expenses</CardTitle>
            <CardDescription>All trip expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalActiveExpenses + totalCompletedExpenses)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Across {trips.length} trips
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mt-6">
        <TabsList>
          <TabsTrigger value="active">Active Trips ({activeTrips.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Trips ({completedTrips.length})</TabsTrigger>
          {draftTrips.length > 0 && (
            <TabsTrigger value="draft">Drafts ({draftTrips.length})</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <TripGrid trips={activeTrips} onViewTrip={handleViewTrip} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <TripGrid trips={completedTrips} onViewTrip={handleViewTrip} />
        </TabsContent>
        {draftTrips.length > 0 && (
          <TabsContent value="draft" className="mt-6">
            <TripGrid trips={draftTrips} onViewTrip={handleViewTrip} />
          </TabsContent>
        )}
      </Tabs>

      <CreateTripForm
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
      />
    </PageLayout>
  );
};

export default DashboardPage;
