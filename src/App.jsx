import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUI, selectAuth, hydrateUserData, hydrateSavedJobs } from "./store/index.js";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const dispatch    = useDispatch();
  const { theme }   = useSelector(selectUI);
  const { user }    = useSelector(selectAuth);

  // Apply theme to <html>
  useEffect(() => {
    if (theme === "light") document.documentElement.setAttribute("data-theme","light");
    else                    document.documentElement.removeAttribute("data-theme");
  }, [theme]);

  // Hydrate per-user data whenever the logged-in user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(hydrateUserData(user.id));
      dispatch(hydrateSavedJobs(user.id));
    }
  }, [user?.id, dispatch]);

  return <AppRoutes />;
}
