import React, { createContext, useContext, useState } from "react";

const OpdContext = createContext();

export const OpdProvider = ({ children }) => {
  const [selectedOpd, setSelectedOpd] = useState(() => {
    const saved = localStorage.getItem("selected_opd");
    return saved ? JSON.parse(saved) : null;
  });

  const changeOpd = (opd) => {
    setSelectedOpd(opd);
    localStorage.setItem("selected_opd", JSON.stringify(opd));
  };

  return (
    <OpdContext.Provider value={{ selectedOpd, changeOpd }}>
      {children}
    </OpdContext.Provider>
  );
};

export const useOpd = () => useContext(OpdContext);