const db = require("../core/db");
const util = require("util");
const _ = require('lodash');

// Gets list of users
// vscode-fold=1
exports.getUsers = function (req, res) {
    try {
        let sqlInst = "select u.*, "
        sqlInst += "(select r.rolename from roles r where u.roleid = r.roleid) as userRoleName ";
        // sqlInst += "select u.*, stuff((select ', ' + r.rolename from roles r join userroles ur on r.roleid = ur.roleid where u.userid = ur.userid for xml path('')), 1, 1, '') as userRoleNames, ";
        // sqlInst += "stuff((select ',', ' ' + convert(varchar, r.roleid) + ':' + r.rolename from roles r join userroles ur on r.roleid = ur.roleid where u.userid = ur.userid for xml path('')), 1, 2, '') as userRoles ";
        sqlInst += 'from users u; ';

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                res.status(500).json({
                    "error": err.message
                });
            } else {
                res.json(data.recordset);
            }
        });
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    }
};

// Adds user
// vscode-fold=2
exports.addUser = function (req, res, reqBody, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = 'declare @id int;';
            sqlInst += `insert into users (displayname, email, roleid, createdbyuser, createdondate) values ('${data.displayName}', '${data.email}', ${data.roleId}, ${data.createdByUser}, getdate); `;
            sqlInst += 'set @id = scope_identity(); ';

            // _.forEach(JSON.parse(data.roles), function (value) {
            //     sqlInst += `insert into userroles (userid, roleid) values (@id, (select top 1 roleid from roles where rolename = '${value.text}')); `;
            // });

            sqlINst += 'select @id as userId;';

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    };
};

// Updates user
// vscode-fold=3
exports.updateUser = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "update users set displayname = '" + data.displayName + "', email = '" + data.email + "', modifiedbyuser = " + data.modifiedByUser + ", roleid = " + data.roleId + ", modifiedondate = getdate() ";

            sqlInst += "where userid = " + data.userId + "; ";

            // sqlInst += `delete from userroles where userid = ${data.userId}; `;
            // _.forEach(JSON.parse(data.userRoles), function (value) {
            //     sqlInst += `insert into userroles (userid, roleid) values (${data.userId}, (select top 1 roleid from roles where rolename = '${value}'));`;
            // });

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    };
};

// Removes user
// vscode-fold=4
exports.removeUser = function (req, res, userId) {
    try {
        let sqlInst = `delete from users where userid = ${userId}; `;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                res.status(500).json({
                    "error": err.message
                });
            } else {
                res.json({
                    success: "success"
                });
            }
        });
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    };
};

// Updates person
// vscode-fold=5
exports.updatePerson = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "update users set portalid = " + data.portalId + ", firstname = '" + data.firstName + "', lastname = '" + data.lastName + "'";
            sqlInst += ", lastmodifiedbyuserid = " + data.lastModifiedByUserId + ", lastmodifiedondate = getdate()";
            sqlInst += ", displayname = '" + (data.displayName || data.firstName + " " + data.lastName) + "', countryid = 29";

            if (data.postalCode !== '') sqlInst += ", postalcode = " + data.postalCode;
            if (data.street) sqlInst += ", street = '" + data.street + "'";

            if (data.telephone !== '') {
                sqlInst += ", telephone = '" + data.telephone + "'"
            } else {
                sqlInst += ", telephone = " + null
            };
            if (data.cell) {
                sqlInst += ", cell = '" + data.cell + "'"
            } else {
                sqlInst += ", cell = " + null
            };
            if (data.docid !== '') {
                sqlInst += ", docid = '" + data.docId + "'"
            } else {
                sqlInst += ", docid = " + null
            };
            if (data.streetNumber !== '') {
                sqlInst += ", streetNumber = '" + data.streetNumber + "'"
            } else {
                sqlInst += ", streetNumber = " + null
            };
            if (data.district !== '') {
                sqlInst += ", district = '" + data.district + "'"
            } else {
                sqlInst += ", district = " + null
            };

            if (data.region !== '') {
                let regionId = parseInt(data.region);
                if (isNaN(regionId)) {
                    sqlInst += ", regionid = (select [entryid] from lists where [text] = '" + data.region + "')";
                } else {
                    sqlInst += ", regionid = " + regionId;
                }
            }

            if (data.city !== '') {
                let cityId = parseInt(data.city)
                if (isNaN(cityId)) {
                    sqlInst += ", cityid = (select [entryid] from lists where [text] = '" + data.city + "')";
                } else {
                    sqlInst += ", cityid = " + cityId;
                }
            }

            sqlInst += " where userid = " + data.userId;

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.send(ex);
    };
};

// Updates password
// vscode-fold=6
exports.updatePassword = function (req, res, userId, password) {
    try {
        if (!userId) throw new Error("Input not valid");

        let sqlInst = `update users set hashed_password = '${password}' where userid = ${userId}`;

        db.querySql(sqlInst, function (result, err) {
            if (err) {
                console.log(err.message);
                res.status(500).json({
                    "error": err.message
                });
            } else {
                res.json({
                    "success": "success"
                });
            }
        });
    } catch (ex) {
        res.send(ex);
    };
};

// Updates person password
// vscode-fold=7
exports.resetPassword = function (req, res, reqBody, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = `update users set hashed_password = '${data.password}', lastmodifiedbyuserid = ${data.userId}, lastmodifiedondate = getdate() where userid = ${data.userId}; `;

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    cb({
                        "error": err.message
                    });
                } else {
                    cb({
                        "success": "success"
                    });
                }
            });
        } else {
            // throw new Error("Input not valid");
            return res.status(500).json(`Input not valid (status: 500)`);
        }
    } catch (ex) {
        res.send(ex);
    };
};

// Gets list of regions, cities, etc
// vscode-fold=8
exports.getLists = function (req, res, listname, parentId, term, sortCol, sortOrder) {
    try {
        let sqlInst = "";
        if (parentId) {
            sqlInst += "select * from lists where listname = '" + listname + "' and parentid = '" + parentId + "'";
        } else {
            sqlInst += "select * from lists where listname = '" + listname + "'";
        }

        if (term) {
            sqlInst += " and [text] like '" + term + "%' ";
        }

        sqlInst += " order by [" + sortCol + "] " + sortOrder;

        db.querySql(sqlInst,
            function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        "list": data.recordset
                    });
                }
            });
    } catch (ex) {
        res.send(ex);
    }
};

// Gets person addresss
// vscode-fold=9
exports.getAddress = function (req, res, postalCode) {
    try {
        if (!postalCode) throw new Error("Input not valid");

        let sqlInst = "declare @userid nvarchar(20) ";
        sqlInst += "set @userid = (select top 1 userid from users where postalcode = '" + postalCode + "') ";
        sqlInst += "if (@userid <> '') ";
        sqlInst += "begin ";
        sqlInst += "select	'country' = (select [text] from lists where entryid = (select top 1 countryid from users where userid = @userid)) ";
        sqlInst += ",'countryid' = (select [entryid] from lists where entryid = (select top 1 countryid from users where userid = @userid))";
        sqlInst += ",'countryval' = (select [value] from lists where entryid = (select top 1 countryid from users where userid = @userid))";
        sqlInst += ",'region' = (select [text] from lists where entryid = (select top 1 regionid from users where userid = @userid)) ";
        sqlInst += ",'regionid' = (select [entryid] from lists where entryid = (select top 1 regionid from users where userid = @userid)) ";
        sqlInst += ",'regionval' = (select [value] from lists where entryid = (select top 1 regionid from users where userid = @userid)) ";
        sqlInst += ",'city' = (select [text] from lists where entryid = (select top 1 cityid from users where userid = @userid)) ";
        sqlInst += ",'cityid' = (select [entryid] from lists where entryid = (select top 1 cityid from users where userid = @userid)) ";
        sqlInst += ",'cityval' = (select [value] from lists where entryid = (select top 1 cityid from users where userid = @userid)) ";
        sqlInst += ",'district' = (select top 1 district from users where userid = @userid) ";
        sqlInst += ",'street' = (select top 1 street from users where userid = @userid) ";
        sqlInst += "end ";
        sqlInst += "else select 'CEP não existe no banco de dados' as error";

        db.querySql(sqlInst,
            function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    if (data.recordset[0].error == null) {
                        res.json({
                            "address": data.recordset
                        });
                    } else {
                        res.json({
                            "error": data.recordset[0].error
                        });
                    }
                }
            });
    } catch (ex) {
        res.send(ex);
    }
};

// Gets list of users
// vscode-fold=10
exports.getPeople = function (req, res, portalId, cb) {
    try {
        let sqlInst = "select p.Approved, p.CityId, p.CountryId, p.CreatedOnDate, p.DisplayName, p.DocId, p.Email, p.FirstChoice ";
        sqlInst += ", p.FirstName, p.IsDeleted, p.IsSuperUser, p.LastIPAddress, p.LastModifiedByUserID, p.LastModifiedOnDate, p.LastName";
        sqlInst += ", p.LastPasswordChangeDate, p.PortalId, p.PostalCode, p.RegionId, p.UserID, p.Username";
        sqlInst += ", isnull(street, '') as Street ";
        sqlInst += ", isnull(district, '') as District ";
        sqlInst += ", isnull(streetnumber, '') as StreetNumber ";
        sqlInst += ", isnull(telephone, '') as Telephone ";
        sqlInst += ", isnull(cell, '') as Cell ";
        sqlInst += ", Region = (select [value] from lists where entryid = (select regionid from users where userid = p.userid))";
        sqlInst += ", City = (select [text] from lists where entryid = (select cityid from users where userid = p.userid))";
        sqlInst += "from users p ";
        sqlInst += "where p.portalid = " + portalId + ";";

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                cb({
                    'error': err.message
                });
            } else {
                cb(data.recordsets[0]);
            }
        });
    } catch (ex) {
        cb({
            'error': ex.message
        });
    };
};

// Gets people statistics
// vscode-fold=11
exports.getPeopleDate = function (req, res, year, cb) {
    try {
        let sqlInst = `set language brazilian; select convert(char(3), datename(month, createdondate), 0) as months, count(*) as quantity from users where year(createdondate) = ${year} group by convert(char(3), datename(month, createdondate), 0);`;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                cb({
                    'error': err.message
                });
            } else {
                cb(data.recordsets[0]);
            }
        });
    } catch (ex) {
        cb({
            'error': ex.message
        });
    };
};

// Gets roles
// vscode-fold=12
exports.getRoles = function (req, res) {
    try {
        let sqlInst = `select * from roles; `;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                res.status(500).json({
                    "error": err.message
                });
            } else {
                res.json(data.recordset);
            }
        });
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    }
};