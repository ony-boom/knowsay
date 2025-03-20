export type User = {
    id?: string;
    name: string;
    password_hash?: string;
    role: 'USER' | 'CORRECTOR' | 'ADMIN';
    email: string;
}
