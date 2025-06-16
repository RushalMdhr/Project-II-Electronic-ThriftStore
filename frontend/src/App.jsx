import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <h1>Hello World</h1>
      <ToastContainer/>
      <main className="py-3">
        <Outlet/>
      </main>
    </>
  );
}

export default App;
