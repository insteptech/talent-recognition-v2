import React, { Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IRootPageStateType } from "../../store/models/root.interface";
import { getInvoiceCount, generateInvoices } from "../../store/actions/invoices.actions";
import Loader from '../../common/components/loader';
import { updateCurrentPath } from "../../store/actions/root.actions";

const Invoices: React.FC = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const path: IRootPageStateType = useSelector((state: IStateType) => state.root.page);
    const loader: any = useSelector((state: IStateType) => state.invoices.isLoading);
    const invoices: any = useSelector((state: IStateType) => state.invoices.invoices);

    useEffect(() => {
        dispatch(getInvoiceCount());
        dispatch(updateCurrentPath("invoices", ""));
    }, [path.area, dispatch]);

    const generateInvoice = () => {
        dispatch(generateInvoices());
    };

    if (loader) {
        return (
            <Loader children={''} isLoading={loader} type={"circle"} />
        );
    }

    return (
        <>
            <div className="col-lg-12 text-center client-hdg mb-4">
                <div className="invoices-page py-5">
                    <h5 className="mb-2"><b>Invoice to be generated</b></h5>
                    <div className="invoice-count my-5">
                        <b>
                            <label>
                                {invoices.length}
                            </label>
                        </b>
                    </div>
                    <button
                        className="btn campaign-btn-new ml-0"
                        onClick={() => generateInvoice()}
                    >
                        Generate Invoice
                    </button>
                </div>
            </div>
        </>
    );
};
export default Invoices;