import crypto from 'crypto';
import { customAlphabet, } from 'nanoid';

export function createRandomToken(userId: string): string{
    const token: string = userId + crypto.randomBytes(20);
    return token;
}

export function createRandomNanoId(size: number = 5): string{
    const CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const nanoid = customAlphabet(CHAR, size);
    return nanoid();
}