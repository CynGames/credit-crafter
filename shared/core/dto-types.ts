import { MessageType } from './message-types';

export type GenericMessage<T> = {
  headers: {
    topic: string;
    type: MessageType;
    correlationId: string;
    offset?: string;
    userRecord: UserDTO | null;
  };
  payload: T;
};

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type FinancialDTO = {
  id: string;
  income: string;
  expenses: string;
}

export type UserRecord = {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  disabled?: boolean;
  metadata: UserMetadata;
  providerData: UserInfo[];
  passwordHash?: string;
  passwordSalt?: string;
  customClaims?: { [key: string]: any; };
  tenantId?: string | null;
  tokensValidAfterTime?: string;
  multiFactor?: MultiFactorSettings;
}

type UserMetadata = {
  creationTime?: string;
  lastSignInTime?: string;
  lastRefreshTime?: string | null;
}

type UserInfo = {
  readonly uid?: string;
  readonly displayName?: string;
  readonly email?: string;
  readonly photoURL?: string;
  readonly providerId?: string;
  readonly phoneNumber?: string;
}

export type MultiFactorSettings = {
  enrolledFactors: MultiFactorInfo[];
}

export type MultiFactorInfo = {
  readonly uid: string;
  readonly displayName?: string;
  readonly factorId: string;
  readonly enrollmentTime?: string;
}

export type UserCreatePayload = {
  data: {
    success: boolean;
    user: UserDTO;
  };
};

export type ServerStatusPayload = {
  data: ServerStatus[];
};

export type ServerStatus = {
  service: string;
  status: string;
};

export type EmailUserPayload = {
  data: { email: string }
}

export type IdUserPayload = {
  data: { id: string }
}