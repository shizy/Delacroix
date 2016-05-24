var Database = require('../lib/database.js');
var assert = require('assert');

describe("Database", function () {
    it("Checks for unsupported database accessor", function () {
        assert.throws(function () { new Database('foobar'); }, /Error\: Database type/);
    });

    it("Checks for uninstalled database dependency", function () {
        assert.throws(function () { new Database('test'); }, /Error\: Optional dependency/);
    });

    var db = new Database('sqlite3');
    it("Checks for existing accessor actions", function () {
        db.checkAccessor('ban', function (err) {
            assert.ifError(err);
        });
    });

    it("Ensures the ability to write to the database", function () {
        db.exec('ban', 'testhost', function (err, res) {
            assert.ifError(err);
        });
    });

    it("Ensures the ability to read from the database", function () {
        db.exec('bans', function (err, res) {
            assert.equals(res, ['testhost']);
        });
    });
});
