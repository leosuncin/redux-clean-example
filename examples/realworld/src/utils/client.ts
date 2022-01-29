import ky from 'ky';

let token: string;

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_BACKEND_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        if (token) {
          request.headers.set('Authorization', `Token ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (/\/user(?:s\/)?/iu.test(response.url) && response.ok) {
          const json = await response.json();
          token = json.user.token;
        }
      },
    ],
  },
});
