import store from "../store";

export const HIDE_MODAL: string = "HIDE_MODAL";
export const SHOW_MODAL: string = "SHOW_MODAL";
export const MODAL_PROCESSING: string = "MODAL_PROCESSING";

export const hideModal = (modal: any) => ({
    type: HIDE_MODAL,
    modal,
});

export const showModal = (modal: any, props: any) => ({
    type: SHOW_MODAL,
    modal,
    props,
});

export const modalProcessing = (value: any) => ({
    type: MODAL_PROCESSING,
    value,
});

export const triggerModalAction = (data: any) => (dispatch: (arg0: any) => void) => {
    const action = store.getState().modals.props.action;
    if (action && typeof action === "function") {
        dispatch(action(data));
    }
};

export const triggerModalCancel = (data: any) => (dispatch: (arg0: any) => void) => {
    const cancelAction = store.getState().modals.props.cancelAction;
    if (cancelAction && typeof cancelAction === "function") {
        dispatch(cancelAction(data));
    }
};

export const triggerModalHide = (data: any) => (dispatch: (arg0: any) => void) => {
    const hideAction = store.getState().modals.props.hideAction;
    if (hideAction && typeof hideAction === "function") {
        dispatch(hideAction(data));
    }
};

