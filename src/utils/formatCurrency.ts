export const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: "currency",
      currency: "ZAR",
    });
  };
  