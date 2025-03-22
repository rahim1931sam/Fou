import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, Download, X } from "lucide-react";

interface DataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface ChartDetailViewProps {
  roomId?: string;
  data?: DataPoint[];
  title?: string;
  onClose?: () => void;
}

const ChartDetailView: React.FC<ChartDetailViewProps> = ({
  roomId = "room1",
  data = [],
  title = "Temperature & Humidity History",
  onClose = () => {},
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);

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

  const renderChart = () => {
    const height = 500;
    const width = 1000;
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
                .filter((_, i) => i % Math.ceil(data.length / 12) === 0)
                .map((point, i) => {
                  const x =
                    padding.left + i * timeScale * Math.ceil(data.length / 12);
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
            <path
              d={
                `M ${padding.left} ${padding.top + chartInnerHeight * (1 - normalizeTemp(data[0]?.temperature || 0))} ` +
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
            <path
              d={
                `M ${padding.left} ${padding.top + chartInnerHeight * (1 - normalizeHumidity(data[0]?.humidity || 0))} ` +
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
                  <circle cx={x} cy={y} r={4} fill="#ef4444" />
                  <title>{`Temperature: ${point.temperature.toFixed(1)}°C at ${new Date(point.timestamp).toLocaleString()}`}</title>
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
                  <circle cx={x} cy={y} r={4} fill="#3b82f6" />
                  <title>{`Humidity: ${point.humidity.toFixed(1)}% at ${new Date(point.timestamp).toLocaleString()}`}</title>
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
    <Card className="w-full h-full bg-white shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
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
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="w-full transition-all duration-300 ease-in-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartDetailView;
