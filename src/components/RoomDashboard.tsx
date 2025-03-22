import React, { useState } from "react";
import SensorDisplay from "./SensorDisplay";
import ControlPanel from "./ControlPanel";
import DataChart from "./DataChart";
import DataManagement from "./DataManagement";
import ChartDetailView from "./ChartDetailView";

interface RoomData {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  temperatureRange: { min: number; max: number };
  humidityRange: { min: number; max: number };
  isAutoMode: boolean;
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

interface RoomDashboardProps {
  room: RoomData;
  onModeChange: (isAuto: boolean) => void;
  onTargetTempChange: (temp: number) => void;
  onTargetHumidityChange: (humidity: number) => void;
  onDryingTimeChange: (time: number) => void;
  onHeaterToggle: (isOn: boolean) => void;
  onAirDryerToggle: (isOn: boolean) => void;
  onFanToggle: (isOn: boolean) => void;
  onFanSpeedChange: (speed: number) => void;
  onExportData: () => void;
  onBackupData: () => void;
  onRestoreData: () => void;
}

const RoomDashboard: React.FC<RoomDashboardProps> = ({
  room,
  onModeChange,
  onTargetTempChange,
  onTargetHumidityChange,
  onDryingTimeChange,
  onHeaterToggle,
  onAirDryerToggle,
  onFanToggle,
  onFanSpeedChange,
  onExportData,
  onBackupData,
  onRestoreData,
}) => {
  const [showDetailView, setShowDetailView] = useState(false);

  const handleOpenDetailView = () => {
    setShowDetailView(true);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
  };

  return (
    <div className="h-full p-4 bg-gray-100 overflow-auto">
      {showDetailView ? (
        <ChartDetailView
          roomId={room.id}
          data={room.historicalData}
          title={`${room.name} - Detailed Temperature & Humidity History`}
          onClose={handleCloseDetailView}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <SensorDisplay
              roomId={room.id}
              roomName={room.name}
              data={{
                temperature: room.temperature,
                humidity: room.humidity,
                timestamp: new Date(),
              }}
              temperatureRange={room.temperatureRange}
              humidityRange={room.humidityRange}
            />
          </div>

          <div className="lg:col-span-6">
            <DataManagement
              roomId={room.id}
              roomName={room.name}
              onExportData={onExportData}
              onBackupData={onBackupData}
              onRestoreData={onRestoreData}
            />
          </div>

          <div className="lg:col-span-12">
            <DataChart
              roomId={room.id}
              data={room.historicalData}
              title={`${room.name} - Temperature & Humidity History`}
              onOpenDetailView={handleOpenDetailView}
            />
          </div>

          <div className="lg:col-span-12">
            <ControlPanel
              roomId={room.name}
              isAutoMode={room.isAutoMode}
              targetTemperature={room.targetTemperature}
              targetHumidity={room.targetHumidity}
              dryingTime={room.dryingTime}
              heaterPower={room.heaterPower}
              airDryerPower={room.airDryerPower}
              fanPower={room.fanPower}
              fanSpeed={room.fanSpeed}
              onModeChange={onModeChange}
              onTargetTempChange={onTargetTempChange}
              onTargetHumidityChange={onTargetHumidityChange}
              onDryingTimeChange={onDryingTimeChange}
              onHeaterToggle={onHeaterToggle}
              onAirDryerToggle={onAirDryerToggle}
              onFanToggle={onFanToggle}
              onFanSpeedChange={onFanSpeedChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDashboard;
