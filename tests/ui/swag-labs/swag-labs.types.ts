import type { ICheckoutDetails } from '../../../src/pages/shop.types.js';

export interface ILoginCase
{
    username: string;
    password: string;
    error: string;
}

export interface ISortCase
{
    label: string;
    field: string;
    descending: boolean;
}

export interface ICheckoutCase extends ICheckoutDetails
{
    error: string;
}

export interface ISwagData
{
    productsTitle: string;
    completePageTitle: string;
    successTitle: string;
    successMessage: string;
    checkout: ICheckoutDetails;
    loginCases: Record<string, ILoginCase>;
    sorts: Record<string, ISortCase>;
    checkoutCases: Record<string, ICheckoutCase>;
}
