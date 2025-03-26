
"use client";

import { WorldMap } from "@/components/ui/world-map";
import { motion } from "framer-motion";

export function WorldMapDemo() {
  return (
    <div className="py-20 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Record{" "}
          <span className="text-primary">
            {"Linkage".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>{" "}
          System
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Connect and manage patient records between clinic visits and community health databases
          with precision and ease. Designed for healthcare facilities and demographic surveillance systems.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: { lat: 6.2088, lng: 6.8085 }, // Nigeria (East)
            end: { lat: 9.0765, lng: 7.3986 }, // Abuja
          },
          {
            start: { lat: 9.0765, lng: 7.3986 }, // Abuja
            end: { lat: 0.3476, lng: 32.5825 }, // Kampala
          },
          {
            start: { lat: 0.3476, lng: 32.5825 }, // Kampala
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
          {
            start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            end: { lat: -6.1630, lng: 35.7516 }, // Tanzania
          },
          {
            start: { lat: -6.1630, lng: 35.7516 }, // Tanzania
            end: { lat: -14.4974, lng: 28.1472 }, // Zambia
          },
          {
            start: { lat: -14.4974, lng: 28.1472 }, // Zambia
            end: { lat: -13.1339, lng: 27.8493 }, // Southern Region
          },
        ]}
        lineColor="#4f46e5"
      />
    </div>
  );
}
