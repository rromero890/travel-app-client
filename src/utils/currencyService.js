export async function convertCurrency(amount, from, to) {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Currency API error");
      const data = await response.json();
      return data.rates[to];
    } catch (error) {
      console.error("Currency conversion failed:", error.message);
      return null;
    }
  }
  