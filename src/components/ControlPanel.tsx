import React, { useState } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Thermometer, Droplets, Fan, Clock, Power } from "lucide-react";

interface ControlPanelProps {
  roomId?: string;
  isAutoMode?: boolean;
  targetTemperature?: number;
  targetHumidity?: number;
  dryingTime?: number;
  heaterPower?: boolean;
  airDryerPower?: boolean;
  fanPower?: boolean;
  fanSpeed?: number;
  onModeChange?: (isAuto: boolean) => void;
  onTargetTempChange?: (temp: number) => void;
  onTargetHumidityChange?: (humidity: number) => void;
  onDryingTimeChange?: (time: number) => void;
  onHeaterToggle?: (isOn: boolean) => void;
  onAirDryerToggle?: (isOn: boolean) => void;
  onFanToggle?: (isOn: boolean) => void;
  onFanSpeedChange?: (speed: number) => void;
}

const ControlPanel = ({
  roomId = "Room 1",
  isAutoMode = false,
  targetTemperature = 65,
  targetHumidity = 45,
  dryingTime = 12,
  heaterPower = false,
  airDryerPower = false,
  fanPower = false,
  fanSpeed = 50,
  onModeChange = () => {},
  onTargetTempChange = () => {},
  onTargetHumidityChange = () => {},
  onDryingTimeChange = () => {},
  onHeaterToggle = () => {},
  onAirDryerToggle = () => {},
  onFanToggle = () => {},
  onFanSpeedChange = () => {},
}: ControlPanelProps) => {
  const [localIsAutoMode, setLocalIsAutoMode] = useState(isAutoMode);
  const [localTargetTemp, setLocalTargetTemp] = useState(targetTemperature);
  const [localTargetHumidity, setLocalTargetHumidity] =
    useState(targetHumidity);
  const [localDryingTime, setLocalDryingTime] = useState(dryingTime);
  const [localHeaterPower, setLocalHeaterPower] = useState(heaterPower);
  const [localAirDryerPower, setLocalAirDryerPower] = useState(airDryerPower);
  const [localFanPower, setLocalFanPower] = useState(fanPower);
  const [localFanSpeed, setLocalFanSpeed] = useState(fanSpeed);

  const handleModeChange = (checked: boolean) => {
    setLocalIsAutoMode(checked);
    onModeChange(checked);
  };

  const handleTargetTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalTargetTemp(value);
    onTargetTempChange(value);
  };

  const handleTargetHumidityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(e.target.value);
    setLocalTargetHumidity(value);
    onTargetHumidityChange(value);
  };

  const handleDryingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalDryingTime(value);
    onDryingTimeChange(value);
  };

  const handleHeaterToggle = () => {
    setLocalHeaterPower(!localHeaterPower);
    onHeaterToggle(!localHeaterPower);
  };

  const handleAirDryerToggle = () => {
    setLocalAirDryerPower(!localAirDryerPower);
    onAirDryerToggle(!localAirDryerPower);
  };

  const handleFanToggle = () => {
    setLocalFanPower(!localFanPower);
    onFanToggle(!localFanPower);
  };

  const handleFanSpeedChange = (value: number[]) => {
    setLocalFanSpeed(value[0]);
    onFanSpeedChange(value[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {roomId} Control Panel
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            {localIsAutoMode ? "Automatic" : "Manual"} Mode
          </span>
          <Switch
            checked={localIsAutoMode}
            onCheckedChange={handleModeChange}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      <Tabs
        defaultValue={localIsAutoMode ? "auto" : "manual"}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="manual">Manual Control</TabsTrigger>
          <TabsTrigger value="auto">Automatic Settings</TabsTrigger>
        </TabsList>

        <TabsContent
          value="manual"
          className="space-y-6 bg-gray-50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Heater Control */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="font-medium">Heater</h3>
                </div>
                <Switch
                  checked={localHeaterPower}
                  onCheckedChange={() => handleHeaterToggle()}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
              <Button
                variant={localHeaterPower ? "default" : "outline"}
                className={`w-full mt-2 ${localHeaterPower ? "bg-orange-500 hover:bg-orange-600" : "text-orange-500 border-orange-200"}`}
                onClick={handleHeaterToggle}
              >
                <Power className="h-4 w-4 mr-2" />
                {localHeaterPower ? "Turn Off" : "Turn On"}
              </Button>
            </div>

            {/* Air Dryer Control */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Air Dryer</h3>
                </div>
                <Switch
                  checked={localAirDryerPower}
                  onCheckedChange={() => handleAirDryerToggle()}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
              <Button
                variant={localAirDryerPower ? "default" : "outline"}
                className={`w-full mt-2 ${localAirDryerPower ? "bg-blue-500 hover:bg-blue-600" : "text-blue-500 border-blue-200"}`}
                onClick={handleAirDryerToggle}
              >
                <Power className="h-4 w-4 mr-2" />
                {localAirDryerPower ? "Turn Off" : "Turn On"}
              </Button>
            </div>

            {/* Fan Control */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg shadow border border-green-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Fan className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Fan</h3>
                </div>
                <Switch
                  checked={localFanPower}
                  onCheckedChange={() => handleFanToggle()}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Speed</span>
                  <span>{localFanSpeed}%</span>
                </div>
                <Slider
                  disabled={!localFanPower}
                  value={[localFanSpeed]}
                  onValueChange={handleFanSpeedChange}
                  max={100}
                  step={1}
                  className={`${!localFanPower ? "opacity-50" : ""}`}
                />
              </div>
              <Button
                variant={localFanPower ? "default" : "outline"}
                className={`w-full mt-3 ${localFanPower ? "bg-green-500 hover:bg-green-600" : "text-green-500 border-green-200"}`}
                onClick={handleFanToggle}
              >
                <Power className="h-4 w-4 mr-2" />
                {localFanPower ? "Turn Off" : "Turn On"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="auto"
          className="space-y-6 bg-gray-50 p-4 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Temperature Setting */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
              <div className="flex items-center mb-3">
                <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-medium">Target Temperature</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={localTargetTemp}
                  onChange={handleTargetTempChange}
                  min={0}
                  max={100}
                  className="border-orange-200 focus-visible:ring-orange-400"
                />
                <span className="text-gray-600">°C</span>
              </div>
            </div>

            {/* Humidity Setting */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow border border-blue-100">
              <div className="flex items-center mb-3">
                <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-medium">Target Humidity</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={localTargetHumidity}
                  onChange={handleTargetHumidityChange}
                  min={0}
                  max={100}
                  className="border-blue-200 focus-visible:ring-blue-400"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>

            {/* Drying Time Setting */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg shadow border border-purple-100">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="font-medium">Drying Time</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={localDryingTime}
                  onChange={handleDryingTimeChange}
                  min={0}
                  max={72}
                  className="border-purple-200 focus-visible:ring-purple-400"
                />
                <span className="text-gray-600">hours</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={!localIsAutoMode}
            >
              Apply Automatic Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
