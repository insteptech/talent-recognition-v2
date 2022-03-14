import React from "react";
import { IProduct } from "../../store/models/product.interface";

export type productListProps = {
  onSelect?: (product: IProduct) => void;
  children?: React.ReactNode;
};

function ProductList(props: productListProps): JSX.Element {

  return (
    <>
      <td scope="row" className="w-10">
        <button className="btn campaign-btn-new-tbk">Draft</button>
      </td>
      <td className="campain-firstdata w-10">
        <p>Created</p>
        <h6>2 OCT 2020</h6>
      </td>
      <td className="campain-firstdata w-10">
        <p>Reference</p>
        <h6>JDR023</h6>
      </td>
      <td className="campain-firstdata-prfle w-10">
        <p>Profile</p>
        <h6>Role - Accountant</h6>
      </td>
      <td className="campain-firstdata w-25">
        <div className="campain-spnd-mxmum">
          <p>Spent/Maximum</p>
          <h5>
            <span className="campain-spnd-mxmum-frt">£346 </span>
            <span className="campain-spnd-mxmum-scd"> / £500 </span>
          </h5>
        </div>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{ width: '25%' }} ></div>
        </div>
      </td>
    </>
  );
}
export default ProductList;