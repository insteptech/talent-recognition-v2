import React from "react";
import {useLocation} from 'react-router-dom';
import "./TopMenu.css";
import { useSelector } from "react-redux";
import { IStateType, IRootPageStateType } from "../../store/models/root.interface";

const TopMenu: React.FC = () => {
  let location = useLocation()
  const hideTopMenu = location.pathname.includes('/resetpassword') 
                      || location.pathname.includes('/forgetPassword') 
                      || location.pathname.includes('/signup') 
                      || location.pathname.includes('/confirm')
                      || location.pathname.includes('/candidateWizard')
  const page: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
  return (
    <>
    { 
    hideTopMenu ? 
      ''
   : <> <nav className="navbar navbar-expand navbar-light bg-custom-dark topbar mb-4 static-top shadow">
<ul className="navbar-nav ml-auto">
</ul>
</nav>
    </>
  }
    </>
  );
};
export default TopMenu;