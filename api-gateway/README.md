# API GATEWAY

## Authentication

User authentication (logging in with an email and a password) is not supported by the Firebase Admin SDK since that behaviour would be handled by the Firebase Authentication SDK in the frontend.

As a workaround, one can simulate the logging in and return a valid object with the token by sending a request to this URL:

```
URL: https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
Method: POST
Body: {
  "email": "user@example.com",
  "password": "userPassword",
  "returnSecureToken": true
}
```

This will return a body similar to this:

```
{
    "kind": "identitytoolkit#VerifyPasswordResponse",
    "localId": "Q0ngJcdQ81OhiJYVCaQFcPQzAg42",
    "email": "user@example.com",
    "displayName": "",
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwOWY4ZTMzN2ZjNzg1NTE0ZTExMGM2ZDg0N2Y0M2M3NDM1M2U0YWYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY3JlZGl0LWNyYWZ0ZXIiLCJhdWQiOiJjcmVkaXQtY3JhZnRlciIsImF1dGhfdGltZSI6MTcxMDM1MTA3OCwidXNlcl9pZCI6IlEwbmdKY2RRODFPaGlKWVZDYVFGY1BRekFnNDIiLCJzdWIiOiJRMG5nSmNkUTgxT2hpSllWQ2FRRmNQUXpBZzQyIiwiaWF0IjoxNzEwMzUxMDc4LCJleHAiOjE3MTAzNTQ2NzgsImVtYWlsIjoiZW1haWwzQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImVtYWlsM0BleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.daveRdh4NX4EtZN74_Swze0MUYvr7ivNIGbGm2BKm4JeTHZEQJRm86ikuH-h8Edb18MTnhjfyVIJ7BjriQ98hFxK6bx6WQZk029PdmOklMhsHlukoZFU7Lfd-Phn49hLEq7Gvpd8F9OB4vw-dIwmnnjAFKnlr6Qwtpa3orOUDKRDTQX8fgdSBKY1QmQvh040nzDPpGsRnbDOkZWFyifevF4MMTiC_whUNAKDHVGZnlGsKSd4FDTl2scrqoZZUHQrZqRKrn4Fn2qXLaJHCG_a-dwLq2VRpBDVVslWIz_DIzDGANDee_gvC5ro6HubZdPY6rQ1uGg2HZgMBaXPhhuOMQ",
    "registered": true,
    "refreshToken": "AMf-vBw6Zqm4AGIf15Kx84LG48JBQ7vQdy_ufMZ0snxZ9G1dEqfm1o1kF3kikEQesAlNICEICiuSZfqAgGCFjNZPY9oN39hKbeUpL9GeYL-tw0KMSzT7j416yj3Cby7K195oM_GAzm6LERX_hYJcFmR-Z2jnYSMUHFbWf--eMHPcBS4Wiu6vmfncU4zkNu7Fv9psQ4DrftJwF9rWfYs1JUnYBAfqnOfv5g",
    "expiresIn": "3600"
}
```