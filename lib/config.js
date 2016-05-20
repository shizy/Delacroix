var fs = require('fs');

/* Object responsible for loading and storing config file values.
 */
var Config = function () {

    // ensure singleton instance of object (for config hot-loading)
    if (Config.prototype._instance) return Config.prototype._instance;
    Config.prototype._instance = this;
    this.reload();
};

/* Hot-loading of configuration changes. Updates changed values or
 * sets defaults if no configuration is present.
 */
Config.prototype.reload = function () {

    // ! check for existance of file !
    var data = fs.readFileSync(__dirname + '/../config.json', 'utf-8');

    // ! do a better check for valid JSON !
    data = (data.length > 0) ? JSON.parse(data) : {};

    this.PARSABLE_TYPES = data.parsable_types || [ 'PRIVMSG' ];
    this.SERVER         = data.server         || 'irc.freenode.net';
    this.NICK           = data.nick           || '[Delacroix]';
    this.CHANNELS       = data.channels       || [];
    this.MASTERS        = data.masters        || [];
    this.SUBPREFIX_HELP = '?';
    this.SUBPREFIX_UNDO = '!';
    this.COMMAND_TYPES  = {
            NORMAL: 0,
            HELP:   1,
            UNDO:   2,
    };
};

// always export new instance to trigger singleton functionality
module.exports = new Config();
