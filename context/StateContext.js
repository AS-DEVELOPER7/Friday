import React, { useContext, useEffect, useRef, useState } from "react";

import { createContext } from "react";
const Context = createContext();
const StateContext = ({ children }) => {
  const [signIn, setSignIn] = useState();
  return (
    <Context.Provider value={{ signIn, setSignIn }}>
      {children}
    </Context.Provider>
  );
};

export default StateContext;

export const useStateContext = () => useContext(Context);
