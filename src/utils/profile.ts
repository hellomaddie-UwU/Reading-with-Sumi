import { useEffect, useState } from "react";

export const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
] as const;

export type ZodiacSign = (typeof zodiacSigns)[number];

export interface Profile {
    name: string;
    email: string;
    /** A small square JPEG, stored as a data URL. */
    photo?: string;
    sunSign?: ZodiacSign;
    moonSign?: ZodiacSign;
    risingSign?: ZodiacSign;
    /** When the account was created. */
    memberSince?: number;
}

// Saved on this device until accounts move to a backend.
const PROFILE_KEY = "reading-with-sumi:profile";
const PROFILE_CHANGE_EVENT = "reading-with-sumi:profile-change";

const emptyProfile: Profile = { name: "", email: "" };

export const getProfile = (): Profile => {
    try {
        const saved = localStorage.getItem(PROFILE_KEY);
        return saved ? { ...emptyProfile, ...(JSON.parse(saved) as Partial<Profile>) } : emptyProfile;
    } catch {
        return emptyProfile;
    }
};

/** Saves the profile and returns whether it worked. Large photos can go over the browser's storage limit. */
export const saveProfile = (profile: Profile) => {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        window.dispatchEvent(new Event(PROFILE_CHANGE_EVENT));
        return true;
    } catch {
        return false;
    }
};

/** The saved profile, kept up to date when it changes anywhere in the app. */
export const useProfile = () => {
    const [profile, setProfile] = useState(getProfile);

    useEffect(() => {
        const update = () => setProfile(getProfile());

        window.addEventListener(PROFILE_CHANGE_EVENT, update);
        window.addEventListener("storage", update);
        return () => {
            window.removeEventListener(PROFILE_CHANGE_EVENT, update);
            window.removeEventListener("storage", update);
        };
    }, []);

    return profile;
};

export const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]!.toUpperCase())
        .join("");

const PHOTO_SIZE = 256;

/** Crops an image file to a centered square and shrinks it so it fits in local storage. */
export const resizeProfilePhoto = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            const side = Math.min(image.naturalWidth, image.naturalHeight);
            const canvas = document.createElement("canvas");
            canvas.width = PHOTO_SIZE;
            canvas.height = PHOTO_SIZE;
            canvas
                .getContext("2d")
                ?.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("The image couldn't be read."));
        };
        image.src = url;
    });
