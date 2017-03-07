const got = require('got');
const md5 = require('md5-hex');

function tryJsonParse(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

function gravatars() {
  return (uw) => {
    const subscription = uw.subscription();

    function checkGravatar(userID, email) {
      const gid = md5(email.trim().toLowerCase());
      const avatarUrl = `https://gravatar.com/avatar/${gid}`;
      got(avatarUrl, { query: { d: 404 } })
        // Avatar exists:
        .then(() => uw.getUser(userID))
        .then((user) => {
          user.avatar = avatarUrl;
          return user.save();
        })
        // Avatar doesn't exist:
        .catch(() => {
          // Ignore
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
