var Sqlite = module.exports = function (mod) {

    this.db = new mod.Database(__dirname + '/../../db.sqlite');
    this.db.run("CREATE TABLE IF NOT EXISTS ban (host TEXT UNIQUE NOT NULL)");
};

// Setter queries
Sqlite.prototype.set = {
    'ban': function (host, cb) {
        this.db.run("REPLACE INTO ban (host) VALUES (?)", host, cb);
    }
};

// Getter queries
Sqlite.prototype.get = {
    'ban': function (cb) {
        
    }
};

