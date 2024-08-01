import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AuthProviderWrapper from "./components/AuthProviderWrapper";
import Restricted from "./components/Restricted";
import ResetPass from "./components/ResetPass";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello</div>,
    },
    {
      path: "/auth/signup",
      element: <Signup />,
    },
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: '/auth/reset_password',
      element: <ResetPass/>
    },
    {
      path: "/home",
      element: <Dashboard />,
    },
  ]);
  return (
    <>
      <AuthProviderWrapper>
        <RouterProvider router={router} />
      </AuthProviderWrapper>
    </>
  );
}

export default App;
