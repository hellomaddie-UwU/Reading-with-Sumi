export const getEmailError = (email: string) => {
    if (!email) return "Enter your email.";
    return /^\S+@\S+\.\S+$/.test(email) ? undefined : "Enter a valid email.";
};
