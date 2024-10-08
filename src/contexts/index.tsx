"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type InitialContextType = {
  isAddingTransaction: boolean;
  setIsAddingTransaction: Dispatch<SetStateAction<boolean>>;
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
};

const initialContext: InitialContextType = {
  isAddingTransaction: false,
  setIsAddingTransaction: () => {},
  currentMonth: new Date(),
  setCurrentMonth: () => {},
};

export const AppContext = createContext(initialContext);

export const AppProvider = ({ children }) => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <AppContext.Provider
      value={{
        isAddingTransaction,
        setIsAddingTransaction,
        currentMonth,
        setCurrentMonth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
