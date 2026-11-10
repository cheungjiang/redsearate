"use client";

import { useEffect, useState } from "react";

export function useAssignedWhatsapp(numbers: string[]) {
  const [whatsapp, setWhatsapp] = useState(numbers[0] ?? "");
  useEffect(() => {
    const saved = localStorage.getItem("whatsapp-agent");
    const number =
      saved && numbers.includes(saved)
        ? saved
        : numbers[Math.floor(Math.random() * numbers.length)];
    if (!number) return;
    localStorage.setItem("whatsapp-agent", number);
    setWhatsapp(number);
  }, [numbers]);
  return whatsapp;
}
