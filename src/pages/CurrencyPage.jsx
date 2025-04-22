import React from "react";
import CurrencyConverter from "../components/CurrencyConverter";

export default function CurrencyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Currency Converter</h1>
      <CurrencyConverter />
    </div>
  );
}
