var Sqlite = module.exports = function (mod) {

    this.db = new mod.Database(__dirname + '/../../db.sqlite');
    this.db.run("CREATE TABLE IF NOT EXISTS ban (host TEXT UNIQUE NOT NULL)");
};

Sqlite.prototype.ban = function (host, cb) {
    this.db.run("REPLACE INTO ban (host) VALUES (?)", host, cb);
};

Sqlite.prototype.bans = function (cb) {
    this.db.all("SELECT * FROM ban", function (err, res) {
        if (err) cb(err);
        else cb(null, res);
    });
};
