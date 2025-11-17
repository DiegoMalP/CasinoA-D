import { useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Casino from "./pages/Casino.jsx";

export default function App() {
  const [page, setPage] = useState("login");
  const user = localStorage.getItem("userName");

  if (user) {
    return <Casino />;
  }

  return (
    <>
      {page === "login" ? (
        <Login goRegister={() => setPage("register")} />
      ) : (
        <Register goLogin={() => setPage("login")} />
      )}
    </>
  );
}
