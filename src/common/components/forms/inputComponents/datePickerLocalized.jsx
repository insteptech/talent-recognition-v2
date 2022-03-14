import DatePicker from "react-datepicker";
import { connect } from "react-redux";

// import dateFormats from "./dateFormats.json";
const mapStateToProps = (state, props) => ({
    dateFormat:  ["MM/dd/yyyy"],
});

export default connect(
    mapStateToProps,
    null,
    null,
    { forwardRef: true }
)(DatePicker);
