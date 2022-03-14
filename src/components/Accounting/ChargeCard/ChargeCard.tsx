import React, { Fragment, Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../../store/models/root.interface";
import { IRootPageStateType } from "../../../store/models/root.interface";
import { fetchRunCard, chargeCard } from "../../../store/actions/changeCard.actions";
import Loader from '../../../common/components/loader';
import { updateCurrentPath } from "../../../store/actions/root.actions";

const ChangeCard: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
    const loader: any = useSelector((state: IStateType) => state.changeCard.isLoading);
    const runCard: any = useSelector((state: IStateType) => state.changeCard.runCard);

    useEffect(() => {
        dispatch(fetchRunCard());
        dispatch(updateCurrentPath("chargeCard", ""));
    }, [path.area, dispatch]);

    const chargeCards = () => {
        dispatch(chargeCard());
    };

    if (loader) {
        return (
            <Loader children={''} isLoading={loader} type={"circle"} />
        );
    }

    return (
        <>
            <Fragment>
                <div className="col-lg-12 text-center client-hdg mb-4">
                    <div className="invoices-page py-5">
                        <h5 className="mb-2"><b>Run Charge Card</b></h5>
                        <div className="invoice-count my-5">
                            <b>
                                <label>
                                    {runCard && runCard.qtyPay ? runCard.qtyPay : 0}
                                </label>
                            </b>
                        </div>
                        <button
                            className="btn campaign-btn-new ml-0"
                            onClick={() => chargeCards()}
                        > Run Card</button>
                    </div>
                </div>
            </Fragment >
        </>
    );
};
export default ChangeCard;