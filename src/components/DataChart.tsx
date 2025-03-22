import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Maximize2, ZoomIn, ZoomOut, Download } from "lucide-react";
import { motion } from "framer-motion";

interface DataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface DataChartProps {
  roomId?: string;
  data?: DataPoint[];
  title?: string;
  onOpenDetailView?: () => void;
}

const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: 20 + Math.sin(i / 3) * 5 + Math.random() * 2,
      humidity: 50 + Math.cos(i / 4) * 10 + Math.random() * 5,
    });
  }

  return data;
};

const DataChart: React.FC<DataChartProps> = ({
  roomId = "room1",
  data = generateMockData(),
  title = "Temperature & Humidity History",
  onOpenDetailView = () => {},
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.clientWidth);
      setChartHeight(chartRef.current.clientHeight);
    }

    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
        setChartHeight(chartRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxTemp = Math.max(...data.map((d) => d.temperature));
  const minTemp = Math.min(...data.map((d) => d.temperature));
  const maxHumidity = Math.max(...data.map((d) => d.humidity));
  const minHumidity = Math.min(...data.map((d) => d.humidity));

  const normalizeTemp = (temp: number) => {
    return (temp - minTemp) / (maxTemp - minTemp || 1);
  };

  const normalizeHumidity = (humidity: number) => {
    return (humidity - minHumidity) / (maxHumidity - minHumidity || 1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,Temperature,Humidity\n" +
      data
        .map(
          (point) =>
            `${point.timestamp},${point.temperature},${point.humidity}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${roomId}-data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderChart = (fullscreen = false) => {
    const height = fullscreen ? 500 : 200;
    const width = fullscreen ? chartWidth * 1.5 : chartWidth;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartInnerWidth = width - padding.left - padding.right;
    const chartInnerHeight = height - padding.top - padding.bottom;

    const timeScale = chartInnerWidth / (data.length - 1);

    return (
      <div
        className="relative"
        style={{ height: `${height}px`, width: "100%" }}
      >
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
          <div>{Math.round(maxTemp)}°C</div>
          <div>{Math.round((maxTemp + minTemp) / 2)}°C</div>
          <div>{Math.round(minTemp)}°C</div>
        </div>

        {/* Secondary Y-axis labels (humidity) */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-blue-500 py-4">
          <div>{Math.round(maxHumidity)}%</div>
          <div>{Math.round((maxHumidity + minHumidity) / 2)}%</div>
          <div>{Math.round(minHumidity)}%</div>
        </div>

        {/* Chart area */}
        <div className="ml-10 mr-10 h-full">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            <g className="grid-lines">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={`grid-${i}`}
                  x1={padding.left}
                  y1={padding.top + chartInnerHeight * ratio}
                  x2={width - padding.right}
                  y2={padding.top + chartInnerHeight * ratio}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* X-axis time labels */}
            <g className="time-labels">
              {data
                .filter(
                  (_, i) =>
                    i % Math.ceil(data.length / (fullscreen ? 12 : 6)) === 0,
                )
                .map((point, i) => {
                  const x =
                    padding.left +
                    i *
                      timeScale *
                      Math.ceil(data.length / (fullscreen ? 12 : 6));
                  const time = new Date(point.timestamp).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  );
                  return (
                    <text
                      key={`time-${i}`}
                      x={x}
                      y={height - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                    >
                      {time}
                    </text>
                  );
                })}
            </g>

            {/* Temperature line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={
                `M ${padding.left} ${padding.top + chartInnerHeight * (1 - normalizeTemp(data[0].temperature))} ` +
                data
                  .map((point, i) => {
                    const x = padding.left + i * timeScale;
                    const y =
                      padding.top +
                      chartInnerHeight * (1 - normalizeTemp(point.temperature));
                    return `L ${x} ${y}`;
                  })
                  .join(" ")
              }
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Humidity line */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              d={
                `M ${padding.left} ${padding.top + chartInnerHeight * (1 - normalizeHumidity(data[0].humidity))} ` +
                data
                  .map((point, i) => {
                    const x = padding.left + i * timeScale;
                    const y =
                      padding.top +
                      chartInnerHeight *
                        (1 - normalizeHumidity(point.humidity));
                    return `L ${x} ${y}`;
                  })
                  .join(" ")
              }
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 2"
            />

            {/* Data points for temperature */}
            {data.map((point, i) => {
              const x = padding.left + i * timeScale;
              const y =
                padding.top +
                chartInnerHeight * (1 - normalizeTemp(point.temperature));
              return (
                <g key={`temp-point-${i}`}>
                  <circle cx={x} cy={y} r={fullscreen ? 4 : 3} fill="#ef4444" />
                  {fullscreen && (
                    <title>{`Temperature: ${point.temperature.toFixed(1)}°C at ${new Date(point.timestamp).toLocaleString()}`}</title>
                  )}
                </g>
              );
            })}

            {/* Data points for humidity */}
            {data.map((point, i) => {
              const x = padding.left + i * timeScale;
              const y =
                padding.top +
                chartInnerHeight * (1 - normalizeHumidity(point.humidity));
              return (
                <g key={`humidity-point-${i}`}>
                  <circle cx={x} cy={y} r={fullscreen ? 4 : 3} fill="#3b82f6" />
                  {fullscreen && (
                    <title>{`Humidity: ${point.humidity.toFixed(1)}% at ${new Date(point.timestamp).toLocaleString()}`}</title>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Temperature</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Humidity</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white p-4 shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{title} - Detailed View</DialogTitle>
              </DialogHeader>
              <div className="p-4">{renderChart(true)}</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        ref={chartRef}
        className="w-full cursor-pointer transition-all duration-300 ease-in-out"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
        onClick={() => onOpenDetailView()}
      >
        {renderChart()}
      </div>
    </Card>
  );
};

export default DataChart;
