const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require("../core/db");

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        db.querySql("select * from users where username = '" + username + "'", (data, err) => {
            if (err) {
                console.log(err);
                return done(null, false, {
                    message: err.message
                });
            }

            let user = data.recordset[0];
            if (!user) {
                return done(null, false, {
                    message: 'Usuário ou senha incorreto.'
                });
            }

            // Match Password
            bcrypt.compare(password, user.hashed_password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Usuário ou senha incorreto.'
                    });
                }
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.userId);
    });

    passport.deserializeUser(function (id, done) {
        // let sqlInst = `declare @listStr varchar(max); select  @listStr = coalesce(@listStr + ',', '') + r.roleName `;
        // sqlInst += `from roles r join userroles ur on r.roleid = ur.roleid where ur.userid = ${id}; `;
        // let sqlInst = `select *, isnull(@listStr, '') as roles from users where userid = ${id} `;
        let sqlInst = `select * into #temp from users where userid = ${id} `;
        sqlInst += `select *, (select rolename from roles where roleid = #temp.roleid) as userRoleName from #temp; `;
        db.querySql(sqlInst, (user, err) => {
            done(err, user.recordset[0]);
        }, true);
    });
};