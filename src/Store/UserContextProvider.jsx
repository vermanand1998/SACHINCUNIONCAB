import React, { useState } from "react";
import authModelContext from "./UserContext";
const UserContextProvider = ({ children }) => {
  const [showAuthModel, setshowAuthModel] = useState(false);
  const [userToken, setuserToken] = useState(localStorage.getItem("Token"));
  const [userName, setuserName] = useState(localStorage.getItem("Name"));
  return (
    <authModelContext.Provider value={{showAuthModel,setshowAuthModel,userToken,userName}}>
        {children}
    </authModelContext.Provider>
  );
};

export default UserContextProvider;

