import React from "react";
import RoomCarousel from "./RoomCarousel";
import Header from "./Header";

function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />

      <main className="flex-1 overflow-hidden">
        <RoomCarousel />
      </main>

      <footer className="bg-gray-800 text-white text-xs p-2 text-center">
        <p>Tobacco Drying Control System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default Home;
