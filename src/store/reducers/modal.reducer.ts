import { IActionBase } from "../models/root.interface";
import { IModal } from "../models/modal.interface";
import {
    HIDE_MODAL,
    SHOW_MODAL,
    MODAL_PROCESSING
} from "../actions/modal.actions";

const initialState: IModal = {
    props: {},
    modalProps: {},
    isProcessing: false,
};

function modalReducer(state: IModal = initialState, action: IActionBase): any {
    switch (action.type) {
        case SHOW_MODAL:
            return Object.assign({}, state, {
                [action.modal]: true,
                props: action.props || initialState.props,
                modalProps: { ...state.modalProps, [action.modal]: action.props || initialState.props },
                isProcessing: false,
            });

        case HIDE_MODAL:
            return Object.assign({}, state, {
                [action.modal]: false,
                isProcessing: false,
            });

        case MODAL_PROCESSING:
            return Object.assign({}, state, {
                isProcessing: action.value,
            });

        default:
            return state;
    }
}


export default modalReducer;