export function isValidPhone(phone: string): boolean {
    return /^[6-9]\d{9}$/.test(phone);
}

export function isValidName(name: string): boolean {
    return name.trim().length >= 2;
}