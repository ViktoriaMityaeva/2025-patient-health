export interface AuthData {
    isAuthorize: boolean;
}

export interface User {
    dateJoined: string;
    image: string;
    password: string;
    passwordRepeat?: string;

    id: number;
    first_name: string;
    last_name: string;
    email: string;
    isStaff: boolean;
    isSuperuser: boolean;
    phone: string;
    username: string;
    role: string;
}
