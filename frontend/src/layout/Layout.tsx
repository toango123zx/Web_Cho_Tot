import { Outlet } from "react-router-dom";
import { Header } from "../components/commons";

function Layout() {

  return (
    <div>
      <Header/>
      <Outlet  />
    </div>
  );
}

export default Layout;