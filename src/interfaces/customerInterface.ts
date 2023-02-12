export interface ICustomer {
    name: string;
    cpf: string;
    birth_date: string;
}

export interface IExtendedCustomer extends ICustomer {
    id: number;
}