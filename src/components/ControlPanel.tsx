import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Thermometer,
  Droplets,
  Fan,
  Clock,
  Power,
  Flame,
  Timer,
  Wind,
  Snowflake,
  Zap,
} from "lucide-react";

interface ControlPanelProps {
  roomId?: string;
  isAutoMode?: boolean;
  isAutoOn?: boolean;
  targetTemperature?: number;
  targetHumidity?: number;
  dryingTime?: number;
  heaterPower?: boolean;
  airDryerPower?: boolean;
  fanPower?: boolean;
  fanSpeed?: number;
  onModeChange?: (isAuto: boolean) => void;
  onAutoOnChange?: (isAutoOn: boolean) => void;
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
  isAutoOn = false,
  targetTemperature = 65,
  targetHumidity = 45,
  dryingTime = 12,
  heaterPower = false,
  airDryerPower = false,
  fanPower = false,
  fanSpeed = 50,
  onModeChange = () => {},
  onAutoOnChange = () => {},
  onTargetTempChange = () => {},
  onTargetHumidityChange = () => {},
  onDryingTimeChange = () => {},
  onHeaterToggle = () => {},
  onAirDryerToggle = () => {},
  onFanToggle = () => {},
  onFanSpeedChange = () => {},
}: ControlPanelProps) => {
  const [localIsAutoMode, setLocalIsAutoMode] = useState(isAutoMode);
  const [localIsAutoOn, setLocalIsAutoOn] = useState(isAutoOn);
  const [localTargetTemp, setLocalTargetTemp] = useState(targetTemperature);
  const [localTargetHumidity, setLocalTargetHumidity] =
    useState(targetHumidity);
  const [localDryingTime, setLocalDryingTime] = useState(dryingTime);
  const [localHeaterPower, setLocalHeaterPower] = useState(heaterPower);
  const [localAirDryerPower, setLocalAirDryerPower] = useState(airDryerPower);
  const [localFanPower, setLocalFanPower] = useState(fanPower);
  const [localFanSpeed, setLocalFanSpeed] = useState(fanSpeed);

  // Add state for multiple heaters
  const [heatersPower, setHeatersPower] = useState({
    heater1: localHeaterPower,
    heater2: false,
    heater3: false,
    heater4: false,
  });

  // Auto-on functionality is now controlled by props and local state

  // Add countdown timer state
  const [countdownTime, setCountdownTime] = useState(dryingTime * 60 * 60); // Convert hours to seconds
  const [isCountdownActive, setIsCountdownActive] = useState(false);

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
    setCountdownTime(value * 60 * 60); // Update countdown time when drying time changes
    onDryingTimeChange(value);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  // Auto-on effect to control heaters and dryer based on temperature and humidity
  useEffect(() => {
    if (localIsAutoOn && localIsAutoMode) {
      // Logic to control heaters based on temperature
      const shouldHeatersBeOn = localTargetTemp > targetTemperature;
      setHeatersPower((prev) => ({
        heater1: shouldHeatersBeOn,
        heater2: shouldHeatersBeOn && localTargetTemp - targetTemperature > 2,
        heater3: shouldHeatersBeOn && localTargetTemp - targetTemperature > 4,
        heater4: shouldHeatersBeOn && localTargetTemp - targetTemperature > 6,
      }));
      setLocalHeaterPower(shouldHeatersBeOn);
      onHeaterToggle(shouldHeatersBeOn);

      // Logic to control air dryer based on humidity
      const shouldDryerBeOn = localTargetHumidity < targetHumidity;
      setLocalAirDryerPower(shouldDryerBeOn);
      onAirDryerToggle(shouldDryerBeOn);

      // Start countdown if dryer is on
      if (shouldDryerBeOn && !isCountdownActive) {
        setIsCountdownActive(true);
      }
    }
  }, [
    localIsAutoOn,
    localIsAutoMode,
    localTargetTemp,
    targetTemperature,
    localTargetHumidity,
    targetHumidity,
    onHeaterToggle,
    onAirDryerToggle,
  ]);

  // Countdown timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (isCountdownActive && countdownTime > 0) {
      interval = window.setInterval(() => {
        setCountdownTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setIsCountdownActive(false);
            // Automatically turn off the dryer when countdown reaches zero
            setLocalAirDryerPower(false);
            onAirDryerToggle(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountdownActive, countdownTime, onAirDryerToggle]);

  const handleHeaterToggle = (heaterNum = 1) => {
    // Don't manually toggle if in auto-on mode
    if (localIsAutoOn && localIsAutoMode) return;

    if (heaterNum === 1) {
      setLocalHeaterPower(!localHeaterPower);
      onHeaterToggle(!localHeaterPower);
    }

    // Update the specific heater in the heaters state
    const heaterKey = `heater${heaterNum}` as keyof typeof heatersPower;
    setHeatersPower((prev) => ({
      ...prev,
      [heaterKey]: !prev[heaterKey],
    }));
  };

  const handleAirDryerToggle = () => {
    // Don't manually toggle if in auto-on mode
    if (localIsAutoOn && localIsAutoMode) return;

    const newState = !localAirDryerPower;
    setLocalAirDryerPower(newState);
    onAirDryerToggle(newState);

    // Start or stop countdown timer when dryer is toggled
    if (newState && localIsAutoMode) {
      setIsCountdownActive(true);
    } else {
      setIsCountdownActive(false);
    }
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
        <div className="flex items-center space-x-4">
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
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Auto-On</span>
            <Switch
              checked={localIsAutoOn}
              onCheckedChange={(checked) => {
                setLocalIsAutoOn(checked);
                onAutoOnChange(checked);
              }}
              disabled={!localIsAutoMode}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
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
            {/* Heaters Control Grid */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Heater 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="font-medium">Heater 1</h3>
                  </div>
                  <div className="flex items-center">
                    {localIsAutoOn && localIsAutoMode && (
                      <span className="text-xs font-medium text-purple-500 mr-2">
                        Auto
                      </span>
                    )}
                    <Switch
                      checked={heatersPower.heater1}
                      onCheckedChange={() => handleHeaterToggle(1)}
                      disabled={localIsAutoOn && localIsAutoMode}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
                <Button
                  variant={heatersPower.heater1 ? "default" : "outline"}
                  className={`w-full mt-2 ${heatersPower.heater1 ? "bg-orange-500 hover:bg-orange-600" : "text-orange-500 border-orange-200"}`}
                  onClick={() => handleHeaterToggle(1)}
                  disabled={localIsAutoOn && localIsAutoMode}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {heatersPower.heater1 ? "Turn Off" : "Turn On"}
                </Button>
              </div>

              {/* Heater 2 */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="font-medium">Heater 2</h3>
                  </div>
                  <div className="flex items-center">
                    {localIsAutoOn && localIsAutoMode && (
                      <span className="text-xs font-medium text-purple-500 mr-2">
                        Auto
                      </span>
                    )}
                    <Switch
                      checked={heatersPower.heater2}
                      onCheckedChange={() => handleHeaterToggle(2)}
                      disabled={localIsAutoOn && localIsAutoMode}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
                <Button
                  variant={heatersPower.heater2 ? "default" : "outline"}
                  className={`w-full mt-2 ${heatersPower.heater2 ? "bg-orange-500 hover:bg-orange-600" : "text-orange-500 border-orange-200"}`}
                  onClick={() => handleHeaterToggle(2)}
                  disabled={localIsAutoOn && localIsAutoMode}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {heatersPower.heater2 ? "Turn Off" : "Turn On"}
                </Button>
              </div>

              {/* Heater 3 */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="font-medium">Heater 3</h3>
                  </div>
                  <div className="flex items-center">
                    {localIsAutoOn && localIsAutoMode && (
                      <span className="text-xs font-medium text-purple-500 mr-2">
                        Auto
                      </span>
                    )}
                    <Switch
                      checked={heatersPower.heater3}
                      onCheckedChange={() => handleHeaterToggle(3)}
                      disabled={localIsAutoOn && localIsAutoMode}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
                <Button
                  variant={heatersPower.heater3 ? "default" : "outline"}
                  className={`w-full mt-2 ${heatersPower.heater3 ? "bg-orange-500 hover:bg-orange-600" : "text-orange-500 border-orange-200"}`}
                  onClick={() => handleHeaterToggle(3)}
                  disabled={localIsAutoOn && localIsAutoMode}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {heatersPower.heater3 ? "Turn Off" : "Turn On"}
                </Button>
              </div>

              {/* Heater 4 */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg shadow border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="font-medium">Heater 4</h3>
                  </div>
                  <div className="flex items-center">
                    {localIsAutoOn && localIsAutoMode && (
                      <span className="text-xs font-medium text-purple-500 mr-2">
                        Auto
                      </span>
                    )}
                    <Switch
                      checked={heatersPower.heater4}
                      onCheckedChange={() => handleHeaterToggle(4)}
                      disabled={localIsAutoOn && localIsAutoMode}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
                <Button
                  variant={heatersPower.heater4 ? "default" : "outline"}
                  className={`w-full mt-2 ${heatersPower.heater4 ? "bg-orange-500 hover:bg-orange-600" : "text-orange-500 border-orange-200"}`}
                  onClick={() => handleHeaterToggle(4)}
                  disabled={localIsAutoOn && localIsAutoMode}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {heatersPower.heater4 ? "Turn Off" : "Turn On"}
                </Button>
              </div>
            </div>

            {/* Air Dryer Control with Countdown Timer */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Wind className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">Air Dryer</h3>
                </div>
                <div className="flex items-center">
                  {localIsAutoOn && localIsAutoMode && (
                    <span className="text-xs font-medium text-purple-500 mr-2">
                      Auto
                    </span>
                  )}
                  <Switch
                    checked={localAirDryerPower}
                    onCheckedChange={() => handleAirDryerToggle()}
                    disabled={localIsAutoOn && localIsAutoMode}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </div>

              {/* Countdown Timer Display */}
              <div
                className={`flex items-center justify-center p-2 mb-2 rounded-md ${isCountdownActive ? "bg-blue-100" : "bg-gray-100"}`}
              >
                <Timer
                  className={`h-4 w-4 mr-2 ${isCountdownActive ? "text-blue-500 animate-pulse" : "text-gray-400"}`}
                />
                <span
                  className={`font-mono font-medium ${isCountdownActive ? "text-blue-700" : "text-gray-500"}`}
                >
                  {formatTime(countdownTime)}
                </span>
              </div>

              <Button
                variant={localAirDryerPower ? "default" : "outline"}
                className={`w-full mt-2 ${localAirDryerPower ? "bg-blue-500 hover:bg-blue-600" : "text-blue-500 border-blue-200"}`}
                onClick={handleAirDryerToggle}
                disabled={localIsAutoOn && localIsAutoMode}
              >
                <Snowflake className="h-4 w-4 mr-2" />
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
