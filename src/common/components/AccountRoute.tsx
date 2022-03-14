import { Route, Redirect, RouteProps } from "react-router";
import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";
import Login from "../../components/Account/Login";

export function AccountRoute({ children, ...rest }: RouteProps): JSX.Element {
    const account: IAccount = useSelector((state: IStateType) => state.account);
    return (
        <Route
            {...rest}
            render={() =>
                !_.isEmpty(account.token) && !account.isExpired ? (
                    <Redirect to={{pathname: "/admin/home" }}/>
                ) : <Login />
            }
        />
    );
}