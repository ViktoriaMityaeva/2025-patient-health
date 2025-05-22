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

export interface UserServer {
    token: string;
    role: string;
}

export interface DevicePatient {
    id: number;
    device: {
        uid: string;
        name: string;
        description: string;
        photo: string;
    };
    patient: number;
}

export interface ProfileServer {
    id: number;
    user: {
        email: string;
        first_name: string;
        last_name: string;
        uid: string;
        username: string;
    },
    patient_devices: DevicePatient[];
    is_auth_in_tg?: boolean;
    specialization?: string;
}
