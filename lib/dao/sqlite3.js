var Sqlite = module.exports = function (mod) {

    this.db = new mod.Database(__dirname + '/../../db.sqlite');
};

Sqlite.prototype.setup = function () {
    this.db.run("CREATE TABLE IF NOT EXISTS ban (host TEXT UNIQUE NOT NULL)");
};
