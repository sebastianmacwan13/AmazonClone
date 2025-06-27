import React from "react";
import Login from "../pages/Login"; // ✅ adjust if path differs

const Logins = ({ API_BASE_URL, setCurrentUser, showGlobalMessage, updateNavCartCount }) => {
  return (
    <Login
      API_BASE_URL={API_BASE_URL}
      setCurrentUser={setCurrentUser}
      showGlobalMessage={showGlobalMessage}
      updateNavCartCount={updateNavCartCount}
    />
  );
};

export default Logins;
