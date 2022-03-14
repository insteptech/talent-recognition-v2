import React, { useState, Fragment, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { hideModal } from "../../../../store/actions/modal.actions";

const CreateCampaignModal: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const shown: any = useSelector((state: any) => state.modals.createCampaignModal);
    const modalProps: any = useSelector((state: any) => state.modals.modalProps.createCampaignModal);
    function hide(): void {
        dispatch(hideModal("createCampaignModal"));
    }
    return (
        <Fragment>
            <Modal
                className="link-modal question-modal doc-modal"
                show={shown}
                onHide={hide}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>Document</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Fragment>
                    </Fragment>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};
export default CreateCampaignModal;