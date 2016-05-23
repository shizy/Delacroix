var instance;

/* Database agnostic management object. Handles and maintains all communication with
 * the database.
 *
 * @type:   the type of the database to use
 */
var Database = module.exports = function (type) {

    var accessor;
    var mod = null;

    // set the database type (sqlite or postgre)
    this.type = type;

    // initialize the db accessors by chosen type
    switch (type) {
        case 'sqlite3': accessor = require('./dao/sqlite3.js'); break;
        default:
            console.error('Error: Database type "' + type + '" not supported');
            process.exit(1);
            break;
    }

    // attempt to load the optional dependency to ensure it is installed
    try {
       mod = require(type);
    } catch (e) {
       console.error('Error: Optional dependency "' + type + '" not installed.\nIt can be installed by running: npm install ' + type);
       process.exit(1);
    }

    // ensure the module has been loaded correctly
    if (mod === null) {
        console.error('Error: Module "' + type + '" not loaded correctly.');
        process.exit(1);
    }

    // initialize instance of db and pass the loaded module to it
    instance = new accessor(mod);
};

/* Checks accessor objects for the existence of a function before calling it.
 *
 * @action:     the action to check for
 * cb:
 *  err:        error text if the function was not found
 */
Database.prototype.checkAccessor = function (action, cb) {

    if (typeof instance[action] !== 'function')
        return cb('Error: Accessor for "' + this.type + '" does not support the action: ' + action);
    else
        return cb(null);
};

/* Execution wrapper for database access object queries. Checks to ensure that
 * the accessor object contains a function for the requested action, then executes the
 * requested action. The callback returns error text, and a response
 *
 * @action:     the name of the access object action to be performed
 * @args:       an array of arguments for the query
 * cb:
 *  err:        error text if the query did not run correctly
 *  res:        response data (if any), or success message
 */
Database.prototype.exec = function (action, args, cb) {

    var _this = this;

    // ensure accessor has action defined
    _this.checkAccessor(action, function (err) {

        if (err) return cb(err);

        var icb = function (err, res) {
            if (err) return cb('Error: ' + _this.type + ' query failed to run for action: ' + action);

            if (typeof res !== 'undefined')
                return cb(null, res);
            else
                return cb(null, 'Sucessfully performed action: ' + action);
        };

        // shifts the callbacks if no arguments are present
        if (typeof args === 'function') {
            cb = args;
            args = icb;
        }

        // run and handle response
        instance[action](args, icb);
    });
};
