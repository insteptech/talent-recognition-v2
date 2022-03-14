/** wrapper for react-bootstrap modal
 * temporary fix related to issue: https://github.com/react-bootstrap/react-overlays/issues/188
 * solution: https://github.com/react-bootstrap/react-bootstrap/issues/2812
 */
import { Modal as ReactOverlayModal } from "react-overlays";
import { Modal } from "react-bootstrap";

const focus = () => {};
const cDU = ReactOverlayModal.prototype.componentDidUpdate;
const cDM = ReactOverlayModal.prototype.componentDidMount;

ReactOverlayModal.prototype.componentDidUpdate = function(prevProps: any) {
    if (this.focus !== focus) {
        this.focus = focus;
    }
    cDU.call(this, prevProps);
};
ReactOverlayModal.prototype.componentDidMount = function() {
    if (this.focus !== focus) {
        this.focus = focus;
    }
    cDM.call(this);
};
export default Modal;