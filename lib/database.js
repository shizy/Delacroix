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
    this.instance = new accessor(mod);

    // setup the database for use
    this.instance.setup();
};
