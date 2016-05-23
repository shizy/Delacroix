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

var checkAccessor = function (type, action, cb) {

    if (typeof instance[type][action] !== 'function') return cb({
        error: true,
        message: 'Error: Accessor for "' + this.type + '" does not support the action: ' + action
    }); else return cb({
        error: false
    });
};

/* Execution wrapper for database access object 'setter' queries. Checks to ensure that
 * the accessor object contains a function for the requested action, then executes the
 * requested action. The callback returns error text, or success text.
 *
 * @action:     the name of the access object action to be performed
 * @args:       an array of arguments for the query
 * cb:
 *  err:        error text if the query did not run correctly
 *  suc:        successful query text
 */
Database.prototype.set = function (action, args, cb) {

    // ensure accessor has action defined
    checkAccessor('set', action, function (err, message) {
        
        if (err) return cb(message);

        // run and handle response
        instance.set[action](args, function (err, data) {
            if (err) cb('Error: ' + this.type + ' query failed to run for action: ' + action + ', arguments: ' + args);
            else cb(null, 'Sucessfully performed action: ' + action);
        });
    });
};

/* Execution wrapper for database access object 'getter' queries. Checks to ensure that
 * the accessor object contains a function for the requested action, then executes the
 * requested action. The callback returns error text, or success text.
 *
 * @action:     the name of the access object action to be performed
 * @args:       an array of arguments for the query
 * cb:
 *  err:        error text if the query did not run correctly
 *  data:       response data from the query
 */
Database.prototype.get = function (action, args, cb) {
    
    // ensure accessor has action defined
    checkAccessor('get', action, function (err, message) {
        
        if (err) return cb(message);

        // run and handle response
        instance.set[action](args, function (err, data) {
            if (err) cb('Error: ' + this.type + ' query failed to run for action: ' + action + ', arguments: ' + args);
            else cb(null, data);
        });
    });
};
