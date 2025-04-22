import React, { useState } from "react";
import { convertCurrency } from "../utils/currencyService";

const currencyInfo = {
  USD: { symbol: "$", flag: "🇺🇸" },
  EUR: { symbol: "€", flag: "🇪🇺" },
  GBP: { symbol: "£", flag: "🇬🇧" },
  JPY: { symbol: "¥", flag: "🇯🇵" },
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [converted, setConverted] = useState(null);

  const handleConvert = async () => {
    const result = await convertCurrency(amount, from, to);
    setConverted(result);
  };

  return (
    <div className="border border-gray-200 rounded p-4 shadow-sm max-w-md">
      <div className="flex flex-col gap-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2"
          placeholder="Amount"
        />

        <div className="flex gap-3">
          <select
            className="border rounded px-2 py-1 flex-1"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {Object.entries(currencyInfo).map(([code, { flag }]) => (
              <option key={code} value={code}>
                {flag} {code}
              </option>
            ))}
          </select>

          <span className="flex items-center">→</span>

          <select
            className="border rounded px-2 py-1 flex-1"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {Object.entries(currencyInfo).map(([code, { flag }]) => (
              <option key={code} value={code}>
                {flag} {code}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Convert
        </button>

        {converted !== null && (
          <div className="text-lg font-semibold mt-2">
            {amount} {currencyInfo[from].symbol} ({from}) ={" "}
            {currencyInfo[to].symbol}
            {converted} ({to})
          </div>
        )}
      </div>
    </div>
  );
}
