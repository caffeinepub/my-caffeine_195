import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Village {
    id: bigint;
    name: string;
    districtId: bigint;
}
export interface GalleryImage {
    id: bigint;
    eventId: bigint;
    imageData: string;
    sortOrder: bigint;
    caption: string;
}
export interface District {
    id: bigint;
    villages: Array<Village>;
    name: string;
}
export interface GalleryEvent {
    id: bigint;
    title: string;
    createdAt: bigint;
    subtitle: string;
    images: Array<GalleryImage>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDistrict(name: string): Promise<bigint>;
    addGalleryEvent(title: string, subtitle: string): Promise<bigint>;
    addGalleryImage(eventId: bigint, imageData: string, caption: string): Promise<bigint>;
    addVillage(districtId: bigint, villageName: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDistrict(districtId: bigint): Promise<boolean>;
    deleteGalleryEvent(eventId: bigint): Promise<boolean>;
    deleteGalleryImage(imageId: bigint): Promise<boolean>;
    deleteVillage(villageId: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDistricts(): Promise<Array<District>>;
    getGalleryEvents(): Promise<Array<GalleryEvent>>;
    getGalleryImagesByEvent(eventId: bigint): Promise<Array<GalleryImage>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVillagesByDistrict(districtId: bigint): Promise<Array<Village>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
