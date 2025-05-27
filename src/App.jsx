import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Route/Routes";
import AuthProvider from "./Provider/AuthProvider";
// import { AuthProvider } from "./Provider/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
