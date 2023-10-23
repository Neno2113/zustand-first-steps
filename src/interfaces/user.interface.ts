


export interface User {
    id: string
    email: string;
    // password: string;
    fullName: string;
    token?: string;
    isActive: boolean;
    roles: string[]
}