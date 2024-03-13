import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type RequestUserDto = Request & DecodedIdToken;
