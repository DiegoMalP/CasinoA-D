import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Casino from "./components/Casino";

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
