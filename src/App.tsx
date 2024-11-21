import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Board from "./pages/Board";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar"; // Navbar bileşenini içe aktarıyoruz
import { useContext, useEffect } from "react";
import { MainContext } from "./context/Context";
import Notification from "./components/Notification";
import Boards2 from "./pages/Boards2";
import NavbarHome from "./components/NavbarHome";

function App() {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error("No context");
  }

  const { user, setBoardBG } = context;

  useEffect(() => {
    setBoardBG(false);
  });

  return (
    <div>
      <BrowserRouter>
        <Notification />

        <Routes>
          {user ? (
            <Route
              path="/"
              element={
                <div className="h-full">
                  <Navbar />
                  <Boards2 />
                </div>
              }
            />
          ) : (
            <Route
              path="/"
              element={
                <div>
                  <NavbarHome />
                  <Home />
                </div>
              }
            />
          )}

          <Route
            path="/login"
            element={
              <div>
                <NavbarHome />
                <Login />
              </div>
            }
          />

          <Route
            path="/boards"
            element={
              <div className="h-full">
                <Navbar />
                <Boards2 />
              </div>
            }
          />
          <Route
            path="/board/:id"
            element={
              <div>
                <Board />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
