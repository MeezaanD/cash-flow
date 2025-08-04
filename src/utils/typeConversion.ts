import { Transaction as ApiTransaction } from "../types/api";
import { Transaction as MainTransaction } from "../types/index";

// Convert API Transaction to Main Transaction
export const convertApiTransactionToMain = (
  apiTx: ApiTransaction
): MainTransaction => {
  return {
    id: apiTx.id,
    title: apiTx.title,
    amount: apiTx.amount,
    type: apiTx.type,
    category: apiTx.category,
    description: apiTx.description,
    createdAt: new Date(apiTx.createdAt),
  };
};

// Convert Main Transaction to API Transaction
export const convertMainTransactionToApi = (
  mainTx: MainTransaction
): Omit<ApiTransaction, "id" | "createdAt" | "userId"> => {
  return {
    title: mainTx.title,
    amount: mainTx.amount,
    type: mainTx.type,
    category: mainTx.category,
    description: mainTx.description,
  };
};

// Convert array of API transactions to main transactions
export const convertApiTransactionsToMain = (
  apiTransactions: ApiTransaction[]
): MainTransaction[] => {
  return apiTransactions.map(convertApiTransactionToMain);
};
