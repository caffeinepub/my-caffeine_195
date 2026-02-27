import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MembershipApplication {
    id: bigint;
    status: ApplicationStatus;
    paymentConfirmed: boolean;
    name: string;
    submittedAt: bigint;
    email: string;
    address: string;
    phone: string;
    membershipType: MembershipType;
}
export interface District {
    id: bigint;
    villageIds: Array<bigint>;
    name: string;
}
export interface DonationIntent {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    amount: string;
}
export interface AssistanceRequest {
    id: bigint;
    name: string;
    submittedAt: bigint;
    description: string;
    address: string;
    phone: string;
    requestType: string;
}
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface Village {
    id: bigint;
    name: string;
    districtId: bigint;
}
export interface ContactInquiry {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum ApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum MembershipType {
    Lifetime = "Lifetime",
    Monthly = "Monthly",
    Yearly = "Yearly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssistanceRequest(name: string, phone: string, address: string, requestType: string, description: string): Promise<bigint>;
    addContactInquiry(name: string, email: string, phone: string, message: string): Promise<bigint>;
    addDistrict(name: string): Promise<bigint>;
    addDonationIntent(name: string, email: string, amount: string, message: string): Promise<bigint>;
    addMembershipApplication(name: string, phone: string, email: string, address: string, membershipType: MembershipType, paymentConfirmed: boolean): Promise<bigint>;
    addVillage(districtId: bigint, name: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDistrict(id: bigint): Promise<void>;
    deleteVillage(id: bigint): Promise<void>;
    editDistrict(id: bigint, newName: string): Promise<void>;
    editVillage(id: bigint, newName: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDistricts(): Promise<Array<District>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVillagesByDistrict(districtId: bigint): Promise<Array<Village>>;
    isCallerAdmin(): Promise<boolean>;
    listAssistanceRequests(): Promise<Array<AssistanceRequest>>;
    listContactInquiries(): Promise<Array<ContactInquiry>>;
    listDonationIntents(): Promise<Array<DonationIntent>>;
    listMembershipApplications(statusFilter: ApplicationStatus | null): Promise<Array<MembershipApplication>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminPassword(oldPassword: string, newPassword: string): Promise<Result>;
    updateApplicationStatus(id: bigint, newStatus: ApplicationStatus): Promise<void>;
    verifyAdminPassword(password: string): Promise<boolean>;
}
