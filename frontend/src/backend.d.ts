import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Donation {
    donorName: string;
    message: string;
    timestamp: Time;
    amount: bigint;
}
export type Time = bigint;
export interface Activity {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    image: ExternalBlob;
}
export interface backendInterface {
    addContactInquiry(name: string, email: string, message: string): Promise<void>;
    addDonation(donorName: string, amount: bigint, message: string): Promise<void>;
    getActivities(): Promise<Array<Activity>>;
    getDonations(): Promise<Array<Donation>>;
    getFoundationInfo(): Promise<{
        description: string;
        email: string;
        address: string;
        phone: string;
        socialMedia: Array<string>;
    }>;
    seedActivities(): Promise<void>;
}
