import React from "react";
import PropTypes from "prop-types";
import Loader from "react-loader";
import loadingIcon from "../loader/loader.svg";

export default function LoaderComponent({ children, isLoading, type, ...props }) {
    if (type === "dots") {
        return <img src={loadingIcon} alt="" />;
    }
    return (
        <Loader loaded={!isLoading} {...props}>
            {children}
        </Loader>
    );
}
LoaderComponent.propTypes = {
    ...Loader.propTypes,
    isLoading: PropTypes.bool,
    type: PropTypes.oneOf(["circle", "dots"]),
    children: PropTypes.node,
};
LoaderComponent.defaultProps = {
    width: 5,
    length: 10,
    radius: 10,
    zIndex: 100,
    isLoading: true,
    type: "circle",
};