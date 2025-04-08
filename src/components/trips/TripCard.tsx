
import { Trip } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getTotalExpenses } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, ReceiptIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripCardProps {
  trip: Trip;
  onView: (tripId: string) => void;
}

const TripCard = ({ trip, onView }: TripCardProps) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    onView(trip.id);
    navigate(`/trips/${trip.id}`);
  };
  
  const getStatusColor = (status: Trip["status"]) => {
    switch (status) {
      case "draft": return "bg-gray-200 text-gray-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className="trip-card h-full flex flex-col hover:border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{trip.title}</CardTitle>
          <Badge className={getStatusColor(trip.status)} variant="outline">
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(trip.startDate)} - {trip.endDate ? formatDate(trip.endDate) : "Present"}
        </CardDescription>
        {trip.destination && (
          <CardDescription className="flex items-center gap-1 text-sm">
            <MapPinIcon className="h-4 w-4" />
            {trip.destination}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        {trip.description && (
          <p className="text-sm text-muted-foreground mb-4">{trip.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <ReceiptIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Total expenses</p>
            <p className="font-semibold">{formatCurrency(getTotalExpenses(trip.expenses))}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {trip.expenses.length} expense{trip.expenses.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleViewClick} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripCard;
