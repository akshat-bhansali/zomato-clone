import Login from "./components/auth/login";
import Register from "./components/auth/register";
import ResLogin from "./components/restaurantAuth/reslogin";
import ResRegister from "./components/restaurantAuth/resregister";

import Header from "./components/header";

import Home from "./components/home";
import Footer from "./components/footer"
import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";
import Profile from "./components/profile";
import RestaurantDetails from "./components/restaurantDetails";
import Cart from "./components/cart";
import Orders from "./components/order";
import RefundPolicy from "./components/refund";
import PrivacyPolicy from "./components/privacyPolicy";
import ContactUs from "./components/contact";
import AboutUs from "./components/about";
import TermsAndConditions from "./components/tandc";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/orders",
      element: <Orders />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/reslogin",
      element: <ResLogin />,
    },
    {
      path: "/resregister",
      element: <ResRegister />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/restaurant/:id",
      element: <RestaurantDetails />,
    },
    {
      path: "/refund",
      element: <RefundPolicy/>
    },
    {
      path: "/privacypolicy",
      element: <PrivacyPolicy/>
    },
    {
      path: "/contact",
      element: <ContactUs/>
    },
    {
      path: "/tandc",
      element: <TermsAndConditions/>
    },
    {
      path: "/about",
      element: <AboutUs/>
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full flex-grow flex flex-col">{routesElement}</div>
      <Footer/>
    </AuthProvider>
  );
}

export default App;
