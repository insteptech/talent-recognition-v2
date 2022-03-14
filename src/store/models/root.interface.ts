import { IProduct, ProductModificationStatus } from "./product.interface";
import {ICSCampaign, 
        IcustserviceProduct, 
        CSProductModificationStatus} from './custserviceProduct.interface';
import { INotification } from "./notification.interface";
import { IUser } from "./user.interface";
import {ICustService}  from './custService.interface';
import { IOrder } from "./order.interface";
import { IAccount } from "./account.interface";

export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}
export interface IStateType {
    root: IRootStateType;
    products: IProductState;
    notifications: INotificationState;
    users: IUserState;
    orders: IOrdersState;
    account: IAccount;
    modals: any;
    form: any;
    campaign: any;
    onboardingWizard: any;
    invoices: any;
    changeCard: any;
    admin: IAdmin;
    custService:ICustServiceState;
    custServiceCampaign: any;
    custServiceProduct:IcustserviceProductState
    // CSCampaign: any;
}

export interface IProductState {
    [x: string]: any;
    products: IProduct[];
    selectedProduct: IProduct | null;
    modificationState: ProductModificationStatus;
    isLoader: boolean;
    campaigns: any;
    campaignApplicationLoader: boolean;
}
export interface IcustserviceProductState {
    [x: string]: any;
    custServiceProduct: IcustserviceProduct[];
    selectedProduct: IcustserviceProduct | null;
    modificationState: CSProductModificationStatus;
    isLoader: boolean;
    campaigns: any;
    campaignApplicationLoader: boolean;
}


export interface IActionBase {
    type: string;
    [prop: string]: any;
}

export interface IOrdersState {
    orders: IOrder[];
}

export interface INotificationState {
    notifications: INotification[];
}

export interface IUserState {
    users: IUser[];
    admins: IUser[];
    isLoader: boolean;
    allUsers: any;
    accountLoader: boolean;
    allAccounts: any;
    accountInfo: any;
    paymentMethod: any;
    selectedUser: any;
    errorPaymentMethod: any;
    paymentSuccess: any;
    invoices: any;
}

export interface IAdmin {
    runCard:any;
    isLoader: boolean;
    adminUsers:any;
    isUserLoading:boolean;
    users:any;
    loadingUsers:boolean;
    sectorTypes: any;
    saleAgents: any;
    contractDuration:any;
    userDetails:any;
    selectedUser: any;
    [x: string]: any;
    
}
export interface ICustServiceState{
    users: ICustService[];
    admins: ICustService[];
    isLoader: boolean;
    allUsers: any;
    accountLoader: boolean;
    allAccounts: any;
    accountInfo: any;
    paymentMethod: any;
    selectedUser: any;
    errorPaymentMethod: any;
    paymentSuccess: any;
    invoices: any; 
}

// export interface ICSCampaign {
//     advertTitle: string;
//     applicants: any;
//     campaignID: any;
//     campaignName: string;
//     campaignQuestion1: string;
//     campaignQuestion2: string;
//     campaignQuestion3: string;
//     campaignQuestion4: string;
//     closedDate: any;
//     companyInternalReference: any;
//     link: string;
//     modelFFMAHigh: any;
//     modelFFMALow: any;
//     modelFFMCHigh: any;
//     modelFFMCLow: any;
//     modelFFMEHigh: any;
//     modelFFMELow: any;
//     modelFFMNHigh: any;
//     modelFFMNLow: any;
//     modelFFMOHigh: any;
//     modelFFMOLow: any;
//     roleId: any;
//     spendingCap: any;
//     status: any;
//     published: any;
//     campaign: any;
//     id:any;
// }


