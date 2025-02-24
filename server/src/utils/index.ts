import crypto from 'crypto';

export function createRandomToken(userId: string): string{
    const token: string = userId + crypto.randomBytes(20);
    return token;
}