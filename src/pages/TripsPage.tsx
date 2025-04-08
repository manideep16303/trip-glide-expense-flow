
import { useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { Button } from "@/components/ui/button";
import TripGrid from "@/components/trips/TripGrid";
import PageLayout from "@/components/layout/PageLayout";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateTripForm from "@/components/trips/CreateTripForm";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TripsPage = () => {
  const { trips, isLoading, setCurrentTrip } = useTrips();
  const navigate = useNavigate();
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleViewTrip = (tripId: string) => {
    setCurrentTrip(tripId);
    navigate(`/trips/${tripId}`);
  };

  // Filter trips based on search term and status
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (trip.destination && trip.destination.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Button onClick={() => setIsCreateTripOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading trips...</p>
        </div>
      ) : (
        <TripGrid trips={filteredTrips} onViewTrip={handleViewTrip} />
      )}

      <CreateTripForm
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
      />
    </PageLayout>
  );
};

export default TripsPage;
