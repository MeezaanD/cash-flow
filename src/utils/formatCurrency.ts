export const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: "USD", // or make dynamic later
    });
  };
  