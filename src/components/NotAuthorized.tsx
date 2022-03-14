import React, { PropsWithChildren, ReactElement, Fragment } from "react";
import LeftMenu from '../components/LeftMenu/LeftMenu'
import TopMenu from '../components/TopMenu/TopMenu'
function Authorized() {
    return (
        <>
                <LeftMenu />
            <div className="container-fluid p-0" style={{ background: "#FCFCFC", marginLeft: '-40px' }}>
                <TopMenu />
                <div className="h-75 container text-unauth font-weight-bold text-green text-uppercase mb-1 d-flex justify-content-center align-items-center" >
                    <p>YOU ARE NOT AUTHORISED TO ACCESS THIS FUNCTION</p>
                    
                    </div>
            </div>
        </>
    );
}


export default Authorized;