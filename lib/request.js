var config = require('./config.js');

/* Request object created from parsing a legitimate and acceptable command message
 * from the server.
 *
 * @message:    the raw message data from the server
 */
module.exports = Request = function (message) {

    // the issuer of the command
    this.issuer = message.nick;

    // the admin status of the issuer (default is always false until determined later by chanserv or nick cache)
    this.issuerIsAdmin = false;

    // the time/date of the command
    this.time = new Date();

    // the channel the command was sent to (#channel for public, botname for private)
    this.channel = message.args[0];

    // the type of command (normal, help, undo)
    switch (message.args[1][1]) {
        case    config.SUBPREFIX_HELP : this.type = config.COMMAND_TYPES.HELP;
        case    config.SUBPREFIX_UNDO : this.type = config.COMMAND_TYPES.UNDO;
        default                       : this.type = config.COMMAND_TYPES.NORMAL;
    }

    // the name of the command
    this.name = message.args[1].match(/^\![\!|\?]?(\w+)/)[1];

    // the arguments of the command
    this.args = parseArgs(message.args[1]);
};

/* Parses command input into word and quote specific matches, then strips
 * any quotes from the argument before returning.
 *
 * @input : the raw string input to parse
 * return : an array of arguments
 */
var parseArgs = function (input) {
    var args = input.match(/"([^"]+)"|'([^']+)'|(\w+)/g);
    if (args === null) return [];
    for (var i in args) args[i] = args[i].replace(/^["|']|["|']$/g, '');
    return args.slice(1);
};
