import React from "react";
import moment from 'moment';
import { IProduct, ICampaign } from "../../store/models/product.interface";

export type productListProps = {
  onSelect?: (product: IProduct) => void;
  campaign: ICampaign;
  children?: React.ReactNode;
  draftClick?: any;
};

function ProductList(props: productListProps): JSX.Element {

  let percentage = (Number(props.campaign.spendingToDate || 0) / Number(props.campaign.spendingCap || 0)) * 100;
  return (
    <>
      <td className="campain-firstdata-scd w-10" >
        {props.campaign.closedDate === null && props.campaign.published === 0 ? (
          <button className="btn campaign-btn-new mt-2" onClick={() => props.draftClick()} >Draft</button>
        ) : (
            <>
              <p>Applicants/New</p>
              <h6 style={{ cursor: props.campaign.applicants > 0 ? 'pointer' : 'default' }} >{props.campaign.applicants}</h6>
            </>
          )}
      </td>
      <>
        <td className="campain-firstdata w-10">
          <p>Created</p>
          <h6>
            {moment(props.campaign.dateCreated).format("DD MMM YY")}
          </h6>
        </td>
        <td className="campain-firstdata w-10">
          <p>Reference</p>
          <h6>{props.campaign.companyInternalReference}</h6>
        </td>
        <td className="campain-firstdata-prfle w-10">
          <p>Profile</p>
          <h6>{props.campaign.roleName || ''}</h6>
        </td>
        <td className="campain-firstdata w-25">
          <div className="campain-spnd-mxmum">
            <p>Spent/Maximum</p>
            <h5>
              <span className="campain-spnd-mxmum-frt">£{props.campaign.spendingToDate || 0} </span>
              <span className="campain-spnd-mxmum-scd"> / £{props.campaign.spendingCap} </span>
            </h5>
          </div>
          <div className="progress">
            <div className="progress-bar" role="progressbar" style={{ width: isNaN(percentage) ? "0%" : `${percentage}%` }} ></div>
          </div>
        </td>
      </>
    </>
  );
}
export default ProductList;