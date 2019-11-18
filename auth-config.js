const AUTH0_DOMAIN = 'moodmuse.auth0.com';
const AUTH0_CLIENT_ID = 'RWYKn1NSBG6LjReho2WItTjxxdtBxjXj';

let AUTH0_AUDIENCE;
if (process.env.NODE_ENV === 'development') {
  AUTH0_AUDIENCE = 'http://localhost:5000';
} else if (process.env.NODE_ENV === 'staging') {
  AUTH0_AUDIENCE = 'https://moodmuse.herokuapp.com';
} else if (process.env.NODE_ENV === 'production') {
  AUTH0_AUDIENCE = 'https://moodmuse-production.herokuapp.com';
}

module.exports = { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE };
