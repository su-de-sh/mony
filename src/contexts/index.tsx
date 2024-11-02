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
  isSideNavBarOpen: boolean;
  setIsSideNavBarOpen: Dispatch<SetStateAction<boolean>>;
};

const initialContext: InitialContextType = {
  isAddingTransaction: false,
  setIsAddingTransaction: () => {},
  currentMonth: new Date(),
  setCurrentMonth: () => {},
  isSideNavBarOpen: true,
  setIsSideNavBarOpen: () => {},
};

export const AppContext = createContext(initialContext);

export const AppProvider = ({ children }) => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSideNavBarOpen, setIsSideNavBarOpen] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isAddingTransaction,
        setIsAddingTransaction,
        currentMonth,
        setCurrentMonth,
        isSideNavBarOpen,
        setIsSideNavBarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
