import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoomDashboard from "./RoomDashboard";
import RoomNavigation from "./RoomNavigation";

interface RoomData {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  temperatureRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
  isAutoMode: boolean;
  isAutoOn: boolean;
  targetTemperature: number;
  targetHumidity: number;
  dryingTime: number;
  heaterPower: boolean;
  airDryerPower: boolean;
  fanPower: boolean;
  fanSpeed: number;
  historicalData: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
  }>;
}

const generateMockData = (): RoomData[] => {
  const rooms: RoomData[] = [];
  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const historicalData = [];
    for (let j = 0; j < 24; j++) {
      const timestamp = new Date(now.getTime() - (23 - j) * 60 * 60 * 1000);
      historicalData.push({
        timestamp: timestamp.toISOString(),
        temperature: 20 + Math.sin(j / 3) * 5 + Math.random() * 2 + i,
        humidity: 50 + Math.cos(j / 4) * 10 + Math.random() * 5 - i,
      });
    }

    rooms.push({
      id: `room-${i}`,
      name: `Room ${i}`,
      temperature: 22 + i,
      humidity: 55 - i * 2,
      temperatureRange: { min: 20, max: 30 },
      humidityRange: { min: 40, max: 70 },
      isAutoMode: i === 1,
      isAutoOn: false,
      targetTemperature: 25,
      targetHumidity: 50,
      dryingTime: 12,
      heaterPower: i === 1,
      airDryerPower: i === 2,
      fanPower: i === 3,
      fanSpeed: i * 25,
      historicalData,
    });
  }

  return rooms;
};

const RoomCarousel: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>(() => {
    const savedRooms = localStorage.getItem("tobaccoDryingRooms");
    return savedRooms ? JSON.parse(savedRooms) : generateMockData();
  });
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Save rooms data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tobaccoDryingRooms", JSON.stringify(rooms));
  }, [rooms]);

  // Ensure room data is properly loaded from localStorage on component mount
  useEffect(() => {
    const handleStorageChange = () => {
      const savedRooms = localStorage.getItem("tobaccoDryingRooms");
      if (savedRooms) {
        setRooms(JSON.parse(savedRooms));
      }
    };

    // Listen for storage events (in case localStorage is updated in another tab)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handlePrevRoom = () => {
    if (currentRoomIndex > 0) {
      setDirection(-1);
      setCurrentRoomIndex(currentRoomIndex - 1);
    }
  };

  const handleNextRoom = () => {
    if (currentRoomIndex < rooms.length - 1) {
      setDirection(1);
      setCurrentRoomIndex(currentRoomIndex + 1);
    }
  };

  const handleSelectRoom = (index: number) => {
    setDirection(index > currentRoomIndex ? 1 : -1);
    setCurrentRoomIndex(index);
  };

  // Drag feature removed as requested

  const updateRoomData = (roomIndex: number, newData: Partial<RoomData>) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], ...newData };
      return updatedRooms;
    });
  };

  const handleModeChange = (isAuto: boolean) => {
    updateRoomData(currentRoomIndex, { isAutoMode: isAuto });
  };

  const handleAutoOnChange = (isAutoOn: boolean) => {
    updateRoomData(currentRoomIndex, { isAutoOn: isAutoOn });
  };

  const handleTargetTempChange = (temp: number) => {
    updateRoomData(currentRoomIndex, { targetTemperature: temp });
  };

  const handleTargetHumidityChange = (humidity: number) => {
    updateRoomData(currentRoomIndex, { targetHumidity: humidity });
  };

  const handleDryingTimeChange = (time: number) => {
    updateRoomData(currentRoomIndex, { dryingTime: time });
  };

  const handleHeaterToggle = (isOn: boolean) => {
    updateRoomData(currentRoomIndex, { heaterPower: isOn });
  };

  const handleAirDryerToggle = (isOn: boolean) => {
    updateRoomData(currentRoomIndex, { airDryerPower: isOn });
  };

  const handleFanToggle = (isOn: boolean) => {
    updateRoomData(currentRoomIndex, { fanPower: isOn });
  };

  const handleFanSpeedChange = (speed: number) => {
    updateRoomData(currentRoomIndex, { fanSpeed: speed });
  };

  const handleExportData = () => {
    const room = rooms[currentRoomIndex];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Temperature,Humidity\n" +
      room.historicalData
        .map(
          (point) =>
            `${point.timestamp},${point.temperature},${point.humidity}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${room.id}-data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackupData = () => {
    const room = rooms[currentRoomIndex];
    const dataStr = JSON.stringify(room);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${room.id}-backup.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleRestoreData = () => {
    // In a real app, this would handle file upload and parsing
    // For now, we'll just show an alert
    alert(
      "In a production environment, this would open a file picker to restore data from a backup file.",
    );
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          const now = new Date();
          const newTemp = room.temperature + (Math.random() - 0.5) * 0.2;
          const newHumidity = room.humidity + (Math.random() - 0.5) * 0.3;

          // Add new data point
          const newDataPoint = {
            timestamp: now.toISOString(),
            temperature: parseFloat(newTemp.toFixed(1)),
            humidity: parseFloat(newHumidity.toFixed(1)),
          };

          // Keep only the last 24 hours of data
          const historicalData = [...room.historicalData, newDataPoint].slice(
            -24,
          );

          return {
            ...room,
            temperature: parseFloat(newTemp.toFixed(1)),
            humidity: parseFloat(newHumidity.toFixed(1)),
            historicalData,
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentRoom = rooms[currentRoomIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <RoomNavigation
        roomNames={rooms.map((room) => room.name)}
        currentRoomIndex={currentRoomIndex}
        onPrevRoom={handlePrevRoom}
        onNextRoom={handleNextRoom}
        onSelectRoom={handleSelectRoom}
      />

      <div className="flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentRoomIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="h-full"
          >
            <RoomDashboard
              room={currentRoom}
              onModeChange={handleModeChange}
              onAutoOnChange={handleAutoOnChange}
              onTargetTempChange={handleTargetTempChange}
              onTargetHumidityChange={handleTargetHumidityChange}
              onDryingTimeChange={handleDryingTimeChange}
              onHeaterToggle={handleHeaterToggle}
              onAirDryerToggle={handleAirDryerToggle}
              onFanToggle={handleFanToggle}
              onFanSpeedChange={handleFanSpeedChange}
              onExportData={handleExportData}
              onBackupData={handleBackupData}
              onRestoreData={handleRestoreData}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoomCarousel;
