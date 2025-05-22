export interface Medication {
    uid: string;
    name: string;
    dosage: string;
    periodicity?: string;
    times: string[];
    comment?: string;
    duration?: number;
    instructions?: string;
    start_date?: string;

    logs?: MedicationLog[];
}

export interface MeasureRecords {
    ai_comment?: string;
    patient_measure: string;
    is_crytical?: boolean;
    recorded_at: Date;
    photo?: string;
}

export interface VitalSign {
    measurement_type: string;
    records: MeasureRecords[];
    notes?: string;
    device?: number;
    uid: string;
}

export interface MedicationLog {
    uid?: string;
    medication: string;
    date: string;
    taken: boolean;
    is_notify_tg?: boolean;
}

export interface Patient {
    id: string;
    fullname: string;
}

export interface Doctor {
    id: string;
    fullname: string;
    specialization: string;
}

export interface MedicalRecord {
    uid: string;
    cost: string;
    description: string;
    name: string;
    fullname: string;
    is_active: boolean;
    created_at: string;
    end_date: string | null;
    doctor_fullname: string;
    duration?: number;

    patient?: Patient;
    doctors?: Doctor[];
    medications: Medication[];
    measurements: VitalSign[];
}

export interface ChatMessage {
    id: string;
    sender: 'doctor' | 'patient';
    message: string;
    timestamp: string;
    read: boolean;
}

export interface VitalSignChart {
    date: string;
    usersCount: number;
    criticalUsersCount: number;
}

export interface VitalSignChart2 {
    date: string;
    visited: number;
}
