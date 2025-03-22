import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = "Tobacco Drying Control System",
  subtitle = "Multi-Room Monitoring & Control Interface",
}) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm opacity-80">{subtitle}</p>
    </header>
  );
};

export default Header;
