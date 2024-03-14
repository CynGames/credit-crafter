import { MessageType } from './message-types';

export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
    userRecord: UserRecord
  };
  payload: T;
};

export type UserRecord = {
  uid: string;
  email?: string;
  // emailVerified: boolean;
  // displayName?: string;
  // photoURL?: string;
  // phoneNumber?: string;
  disabled: boolean;
  metadata: UserMetadata;
  providerData: UserInfo[];
  // passwordHash?: string;
  // passwordSalt?: string;
  // customClaims?: { [key: string]: any; };
  // tenantId?: string | null;
  // tokensValidAfterTime?: string;
  // multiFactor?: MultiFactorSettings;
}

export type UserMetadata = {
  creationTime: string;
  lastSignInTime: string;
  lastRefreshTime?: string | null;
}

export type UserInfo = {
  readonly uid: string;
  readonly displayName: string;
  readonly email: string;
  readonly photoURL: string;
  readonly providerId: string;
  readonly phoneNumber: string;
}

// export type MultiFactorSettings = {
//   enrolledFactors: MultiFactorInfo[];
// }
//
// export type MultiFactorInfo = {
//   readonly uid: string;
//   readonly displayName?: string;
//   readonly factorId: string;
//   readonly enrollmentTime?: string;
// }


export type ServerStatusPayload = {
  data: ServerStatus[];
};

export type ServerStatus = {
  service: string;
  status: string;
};

export type UserDto = {
  name: string
}