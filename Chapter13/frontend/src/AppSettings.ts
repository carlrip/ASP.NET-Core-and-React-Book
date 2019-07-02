export const server = 'http://localhost:17525';

export const webAPIUrl = `${server}/api`;

export const authSettings = {
  domain: 'your-tenantid.auth0.com',
  clientID: 'your-clientid',
  redirectUri: window.location.origin + '/signin-callback',
  responseType: 'token id_token',
  scope: 'openid profile QandAAPI email',
  audience: 'https://qanda',
};
