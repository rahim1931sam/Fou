import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: Date;
}

interface SensorDisplayProps {
  roomId?: string;
  roomName?: string;
  data?: SensorData;
  temperatureRange?: { min: number; max: number };
  humidityRange?: { min: number; max: number };
}

const SensorDisplay = ({
  roomId = "room1",
  roomName = "Room 1",
  data = {
    temperature: 25.4,
    humidity: 65.2,
    timestamp: new Date(),
  },
  temperatureRange = { min: 20, max: 30 },
  humidityRange = { min: 50, max: 70 },
}: SensorDisplayProps) => {
  const [currentData, setCurrentData] = useState<SensorData>(data);
  const [temperatureAlert, setTemperatureAlert] = useState<boolean>(false);
  const [humidityAlert, setHumidityAlert] = useState<boolean>(false);

  // Check if values are out of range
  useEffect(() => {
    setTemperatureAlert(
      currentData.temperature < temperatureRange.min ||
        currentData.temperature > temperatureRange.max,
    );

    setHumidityAlert(
      currentData.humidity < humidityRange.min ||
        currentData.humidity > humidityRange.max,
    );
  }, [currentData, temperatureRange, humidityRange]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuations for demo purposes
      const newTemp = currentData.temperature + (Math.random() - 0.5) * 0.2;
      const newHumidity = currentData.humidity + (Math.random() - 0.5) * 0.3;

      setCurrentData({
        temperature: parseFloat(newTemp.toFixed(1)),
        humidity: parseFloat(newHumidity.toFixed(1)),
        timestamp: new Date(),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentData]);

  return (
    <Card className="w-full h-full bg-white shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-2">
        <CardTitle className="text-xl font-bold text-blue-800 flex items-center justify-between">
          <span>{roomName} Sensor Data</span>
          <span className="text-sm text-gray-500">
            {currentData.timestamp.toLocaleTimeString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperature Display */}
          <div className="relative">
            <div
              className={`p-4 rounded-lg ${temperatureAlert ? "bg-red-50" : "bg-blue-50"} transition-colors duration-300`}
            >
              <div className="flex items-center mb-2">
                <Thermometer
                  className={`mr-2 h-6 w-6 ${temperatureAlert ? "text-red-500" : "text-blue-500"}`}
                />
                <h3 className="text-lg font-medium">Temperature</h3>
                {temperatureAlert && (
                  <AlertTriangle className="ml-2 h-5 w-5 text-red-500 animate-pulse" />
                )}
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold mr-2">
                  {currentData.temperature}
                </span>
                <span className="text-xl">°C</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Target: {temperatureRange.min}°C - {temperatureRange.max}°C
              </div>
            </div>
          </div>

          {/* Humidity Display */}
          <div className="relative">
            <div
              className={`p-4 rounded-lg ${humidityAlert ? "bg-red-50" : "bg-green-50"} transition-colors duration-300`}
            >
              <div className="flex items-center mb-2">
                <Droplets
                  className={`mr-2 h-6 w-6 ${humidityAlert ? "text-red-500" : "text-green-500"}`}
                />
                <h3 className="text-lg font-medium">Humidity</h3>
                {humidityAlert && (
                  <AlertTriangle className="ml-2 h-5 w-5 text-red-500 animate-pulse" />
                )}
              </div>
              <div className="flex items-end">
                <span className="text-3xl font-bold mr-2">
                  {currentData.humidity}
                </span>
                <span className="text-xl">%</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Target: {humidityRange.min}% - {humidityRange.max}%
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(temperatureAlert || humidityAlert) && (
          <Alert
            variant="destructive"
            className="mt-4 bg-red-50 border-red-200"
          >
            <AlertTitle className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Sensor Alert
            </AlertTitle>
            <AlertDescription>
              {temperatureAlert && (
                <p>
                  Temperature is outside the target range (
                  {temperatureRange.min}°C - {temperatureRange.max}°C)
                </p>
              )}
              {humidityAlert && (
                <p>
                  Humidity is outside the target range ({humidityRange.min}% -{" "}
                  {humidityRange.max}%)
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SensorDisplay;
