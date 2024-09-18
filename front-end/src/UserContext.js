// // Update the UserProvider to load from localStorage
// import React, { createContext, useContext, useEffect, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

//   useEffect(() => {
//     if (userId) {
//       localStorage.setItem("userId", userId);
//     } else {
//       localStorage.removeItem("userId");
//     }
//   }, [userId]);

//   return (
//     <UserContext.Provider value={{ userId, setUserId }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   return useContext(UserContext);
// };
