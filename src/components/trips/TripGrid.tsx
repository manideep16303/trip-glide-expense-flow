
import { Trip } from "@/types";
import TripCard from "./TripCard";

interface TripGridProps {
  trips: Trip[];
  onViewTrip: (tripId: string) => void;
}

const TripGrid = ({ trips, onViewTrip }: TripGridProps) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-700">No trips found</h3>
        <p className="text-gray-500 mt-2">Create a new trip to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onView={onViewTrip} />
      ))}
    </div>
  );
};

export default TripGrid;
