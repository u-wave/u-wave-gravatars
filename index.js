const got = require('got');
const md5 = require('md5-hex');

function tryJsonParse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

const baseUrl = 'https://gravatar.com/avatar/';

function gravatars() {
  return (uw) => {
    const subscription = uw.subscription();

    function getGravatar(email) {
      const gid = md5(email.trim().toLowerCase());
      const avatarUrl = `${baseUrl}${gid}`;
      // Return the avatar URL if the avatar exists. Otherwise return null.
      return got(avatarUrl, { query: { d: 404 } })
        .then(() => avatarUrl)
        .catch(() => null);
    }

    function checkGravatar(userID, email) {
      return Promise.all([ getGravatar(), uw.getUser(userID) ]).then((results) => {
        const avatarUrl = results[0];
        const user = results[1];

        if (avatarUrl) {
          user.avatar = avatarUrl;
        } else if (user.avatar.startsWith(baseUrl)) {
          // If no Gravatar was found, but the user still has a Gravatar
          // configured, clear it.
          user.avatar = null;
        }

        return user.save();
      })
    }

    subscription.on('message', (channel, command) => {
      const p = tryJsonParse(command);

      if (p.command === 'user:create') {
        const email = p.data.auth.email;
        checkGravatar(p.data.user._id, email);
      }
    });

    uw.on('stop', () => {
      subscription.close();
    });
  };
}

module.exports = gravatars;
