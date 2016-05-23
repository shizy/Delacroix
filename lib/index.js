var irc = require('irc');
var config = require('./config.js');
var Request = require('./request.js');
var Database = require('./database.js');

// todo:
// create !reload command to diff old and new configs and take appropriate action (join, leave, nick, etc.)
// config.js check for config.json!
// config.js better check for valid JSON!
// part/join notification with hooks!
// banned hosts!

var db     = new Database(config.DATABASE);
var client = new irc.Client(config.SERVER, config.NICK, { channels: config.CHANNELS, });

/*
 * Filter's all inbound messages to only parse those which are
 * legitimate commands from legitimate sources.
 *
 * @message:    the message object to parse
 * return:      true if legitimate command, false otherwise
 */
function filterMessage (message) {

    // ignore all messages from the server except for those we explicitely allow
    if (config.PARSABLE_TYPES.indexOf(message.command) === -1) return false;

    // ignore all messages not containing an issuer
    if (typeof message.nick === 'undefined')  return false;

    // ignore all messages from the bot (prevents infinite loops)
    if (message.nick === client.nick) return false;

    // ignore all messages with empty arguments or no text
    if (message.args.length < 2) return false;

    // ignore all messages that do not conform to a command-like syntax
    if (!/^\![\!|\?]?(\w+)/.test(message.args[1])) return false;

    // ignore all messages from banned hosts
    //if (BANNED_HOSTS.indexOf(message.host) > -1) return false;

    return true;
}

// event listener for all inbound messages
client.addListener('raw', function (message) {

    if (filterMessage (message)) {

        // build a request object
        var request = new Request(message);
        db.exec('bans', function (err, res) {
            console.error(err);
            console.log(res);
        });
    }
});

// nick change notification
client.addListener('nick', function (oldnick, newnick, chans, message) { console.log('Nick changed from ' + oldnick + ' to ' + newnick); });
// successful connection notification
client.addListener('registered', function (message) { console.log('Connected to: ' + config.SERVER); });
// error notification
client.addListener('error', function (message) { console.error(message); });
