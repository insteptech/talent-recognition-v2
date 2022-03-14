export interface IcustserviceProduct {
    id: number;
    name: string;
    category: string;
    description: string;
    amount: number;
    price: number;
    hasExpiryDate: boolean;
}

export enum CSProductModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2
}
export interface ICSCampaign {
    [x: string]: string;
    advertTitle: string;
    applicants: any;
    campaignID: any;
    campaignName: string;
    campaignQuestion1: string;
    campaignQuestion2: string;
    campaignQuestion3: string;
    campaignQuestion4: string;
    closedDate: any;
    companyInternalReference: any;
    link: string;
    modelFFMAHigh: any;
    modelFFMALow: any;
    modelFFMCHigh: any;
    modelFFMCLow: any;
    modelFFMEHigh: any;
    modelFFMELow: any;
    modelFFMNHigh: any;
    modelFFMNLow: any;
    modelFFMOHigh: any;
    modelFFMOLow: any;
    roleId: any;
    spendingCap: any;
    status: any;
    published: any;
}