import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomNavigationProps {
  roomNames?: string[];
  currentRoomIndex?: number;
  onPrevRoom?: () => void;
  onNextRoom?: () => void;
  onSelectRoom?: (index: number) => void;
}

const RoomNavigation: React.FC<RoomNavigationProps> = ({
  roomNames = ["Room 1", "Room 2", "Room 3"],
  currentRoomIndex = 0,
  onPrevRoom = () => {},
  onNextRoom = () => {},
  onSelectRoom = () => {},
}) => {
  return (
    <div className="w-full bg-white shadow-sm py-2 px-4 flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevRoom}
        disabled={currentRoomIndex === 0}
        className="flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center space-x-2">
        {roomNames.map((name, index) => (
          <Button
            key={index}
            variant={currentRoomIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectRoom(index)}
            className={`${currentRoomIndex === index ? "bg-blue-500 hover:bg-blue-600" : ""}`}
          >
            {name}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onNextRoom}
        disabled={currentRoomIndex === roomNames.length - 1}
        className="flex items-center"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default RoomNavigation;
