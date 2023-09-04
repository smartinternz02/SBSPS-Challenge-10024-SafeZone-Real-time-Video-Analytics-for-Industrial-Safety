// UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(""); // Initialize with an empty string
  const [userType, setUserType] = useState(""); // Initialize with an empty string

  return (
    <UserContext.Provider value={{ userId, userType, setUserId, setUserType }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
