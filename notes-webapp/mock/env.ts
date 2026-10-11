export const mockEnv = {
  USER_AUTH_CLIENT_ID: "mock-client",
  USER_AUTH_ISSUER: "https://mock-idp.test",
  // `group` and `ou` are singular; the project's catalog handles follow.
  USER_AUTH_SCOPES: "openid profile email group ou notes:read notes:create notes:pin",
  USER_AUTH_RESOURCE: "https://mock-idp.test/resources/pf-notes-1821",
};
