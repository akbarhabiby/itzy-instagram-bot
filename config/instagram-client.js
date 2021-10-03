const Instagram = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");
const { INSTAGRAM_USERNAME, INSTAGRAM_PASSWORD } = process.env;

class InstagramClient extends Instagram {
  constructor(
    username = INSTAGRAM_USERNAME,
    password = INSTAGRAM_PASSWORD,
    cookieStore = "./cookies.json"
  ) {
    super({
      username,
      password,
      cookieStore: new FileCookieStore(cookieStore),
    });
  }
}

module.exports = new InstagramClient();
