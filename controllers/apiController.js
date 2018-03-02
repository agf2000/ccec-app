const db = require("../core/db");
const _ = require('lodash');

// Gets roles
// vscode-fold=1
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

// Gets settings
// vscode-fold=2
exports.getSettings = function (req, res, settingName) {
    try {
        let sqlInst = '';
        if (settingName) {
            sqlInst = `select * from settings where settingname = '${settingName}'); `;
        } else {
            sqlInst = `select * from settings; `;
        }

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

// Updates user
// vscode-fold=3
exports.updateUser = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "update users set displayname = '" + data.displayName + "', email = '" + data.email + "', modifiedbyuser = " + data.modifiedByUser + ", modifiedondate = getdate() ";

            sqlInst += "where userid = " + data.userId + "; ";

            sqlInst += `delete from userroles where userid = ${data.userId}; `;
            _.forEach(JSON.parse(data.roles), function (value) {
                sqlInst += `insert into userroles (userid, roleid) values (${data.userId}, (select top 1 roleid from roles where rolename = '${value.text}'));`;
            });

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

// Saves settings
// vscode-fold=4
exports.saveSettings = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = '';

            _.each(data, function (item) {
                sqlInst += `if (exists (select top 1 1 from settings where settingname = '${item.settingName}')) `;
                sqlInst += `update settings set settingvalue = '${item.settingValue}' where settingname = '${item.settingName}' `;
                sqlInst += 'else ';
                sqlInst += `insert into settings (portalid, settingname, settingvalue) values (0, '${item.settingName}', '${item.settingValue}'); `;
            });

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

// Gets recipients
// vscode-fold=28
exports.getSponsorsMailList = function (req, res, reqBody, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = `select s.sponsorId, s.sponsorName, r.fileId, r.active, r.dateStart, r.dateEnd
                        from sponsors s
                        where (${data.groupId} = 1 or r.recipientGroup = ${data.groupId})
                        and (${data.regionId} = 1 or r.recipientRegion = ${data.regionId})
                        and (${data.categoryId} = 1 or r.recipientCategory = ${data.categoryId})
                        and (${data.cityId} = 1 or r.recipientCity = ${data.cityId})
                        and (${data.stateId} = 1 or r.recipientState = ${data.stateId})
                        and (${data.recipientId} = 1 or r.recipientId = ${data.recipientId});`;

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    cb({
                        error: err.message
                    });
                } else {
                    cb({
                        recipients: data.recordset[0],
                        sponsors: data.recordset[1]
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

// Gets sponsors
// vscode-fold=5
exports.getSponsors = function (req, res) {
    try {
        let sqlInst = 'select s.*, (select top 1 f.[filename] from files f where f.fileid = s.fileid) as sponsorLogo, ';
        // sqlInst += "stuff((select ', ' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = s.sponsorid for xml path('')), 1, 1, '') as sponsorCategories, ";
        // sqlInst += "stuff((select ',', ' ' + convert(varchar, c.categoryid) + ':' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = s.sponsorid for xml path('')), 1, 2, '') as sponsorCategoriesIds, ";
        sqlInst += "(select categoryname from categories where s.sponsorCategory = categoryid) as sponsorCategoryName, ";
        sqlInst += "(select g.groupname from groups g where s.sponsorGroup = g.groupid) as sponsorGroupName, ";
        sqlInst += "(select r.regionname from regions r where s.sponsorRegion = r.regionid) as sponsorRegionName, ";
        sqlInst += "(select statename from states where s.sponsorState = stateid) as sponsorStateName, ";
        sqlInst += "(select c.cityname from cities c where s.sponsorCity = c.cityid) as sponsorCityName ";
        sqlInst += 'from sponsors s order by s.createdondate desc';

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

// Gets sponsor
// vscode-fold=6
exports.getSponsor = function (req, res, sponsorId) {
    try {
        let sqlInst = 'select s.*, (select top 1 f.[filename] from files f where f.fileid = (select fileid from sponsors where sponsorid = ' + sponsorId + ')) as sponsorLogo, ';
        // sqlInst += "stuff((select ', ' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = " + sponsorId + " for xml path('')), 1, 1, '') as sponsorCategories, ";
        // sqlInst += "stuff((select ',', ' ' + convert(varchar, c.categoryid) + ':' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = " + sponsorId + " for xml path('')), 1, 2, '') as sponsorCategoriesIds, ";
        sqlInst += "(select categoryname from categories where s.sponsorCategory = categoryid) as sponsorCategoryName, ";
        sqlInst += "(select g.groupname from groups g where s.sponsorGroup = g.groupid) as sponsorGroupName, ";
        sqlInst += "(select r.regionname from regions r where s.sponsorRegion = r.regionid) as sponsorRegionName, ";
        sqlInst += "(select statename from states where s.sponsorState = stateid) as sponsorStateName, ";
        sqlInst += "(select c.cityname from cities c where s.sponsorCity = c.cityid) as sponsorCityName ";
        sqlInst += 'from sponsors s where s.sponsorid = ' + sponsorId;

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

// Removes sponsor
// vscode-fold=7
exports.removeSponsor = function (req, res, sponsorId) {
    try {
        let sqlInst = `delete from files where fileid = (select fileid from sponsors where sponsorid = ${sponsorId}); `
        sqlInst += `delete from sponsorCategories where sponsorid = ${sponsorId}`;
        sqlInst += `delete from sponsors where sponsorid = ${sponsorId}`;

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
    }
};

// Removes sponsor image
// vscode-fold=8
exports.removeSponsorImage = function (req, res, sponsorId) {
    try {
        let sqlInst = `update sponsors set fileid = null where sponsorid = ${sponsorId}`;

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
    }
};

// Adds sponsor
// vscode-fold=9
exports.addSponsor = function (req, res, reqBody, files, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int, @fileId int; "

            _.forEach(files, function (file) {
                sqlInst += "insert into files (portalid, [filename], fileoriginalname, filesize, filemimetype, filefolder, createdbyuser, createdondate) ";
                sqlInst += `values (${data.portalId}, '${file.filename}', '${file.originalname}', ${file.size}, '${file.mimetype}', 'logo', ${data.createdByUser} `;
                sqlInst += ", getdate()); set @fileId = scope_identity(); ";
            });

            sqlInst += "insert into sponsors (portalId, sponsorname, sponsorurl, active, sponsorCategory, sponsorGroup, sponsorRegion, sponsorState, sponsorCity, createdbyuser, createdondate";

            if (files) {
                sqlInst += `, fileid`
            }
            if (data.dateStart) {
                sqlInst += `, datestart`
            }
            if (data.dateEnd) {
                sqlInst += `, dateend`
            }

            sqlInst += `) values (${data.portalId}, '${data.sponsorName}', '${data.sponsorUrl}', '${data.active}', ${data.sponsorCategory},
                                  ${data.sponsorGroup}, ${data.sponsorRegion}, ${data.sponsorState}, ${data.sponsorCity}, ${data.createdByUser}, getdate()`;

            if (files) {
                sqlInst += ", @fileId"
            }
            if (data.dateStart) {
                sqlInst += ", '" + data.dateStart + "'"
            }
            if (data.dateEnd) {
                sqlInst += ", '" + data.dateEnd + "'"
            }

            sqlInst += "); set @id = scope_identity(); ";

            // let categories = JSON.parse(data.sponsorCategories);
            // _.forEach(categories, function (category) {
            //     sqlInst += `insert into sponsorcategories (sponsorid, categoryid) values (@id, ${category.value}); `;
            // });

            sqlInst += 'select s.*, (select top 1 f.[filename] from files f where f.fileid = s.fileid) as sponsorLogo, ';
            // sqlInst += "stuff((select ', ' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = s.sponsorid for xml path('')), 1, 1, '') as sponsorCategories, ";
            // sqlInst += "stuff((select ',', ' ' + convert(varchar, c.categoryid) + ':' + c.categoryname from categories c join sponsorcategories sc on c.categoryid = sc.categoryid where sc.sponsorid = s.sponsorid for xml path('')), 1, 2, '') as sponsorCategoriesIds ";
            sqlInst += "(select categoryname from categories where s.sponsorCategory = categoryid) as sponsorCategoryName, ";
            sqlInst += "(select g.groupname from groups g where s.sponsorGroup = g.groupid) as sponsorGroupName, ";
            sqlInst += "(select r.regionname from regions r where s.sponsorRegion = r.regionid) as sponsorRegionName, ";
            sqlInst += "(select statename from states where s.sponsorState = stateid) as sponsorStateName, ";
            sqlInst += "(select c.cityname from cities c where s.sponsorCity = c.cityid) as sponsorCityName ";
            sqlInst += 'from sponsors s where s.sponsorid = @id';

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    cb({
                        error: err.message
                    });
                } else {
                    cb({
                        sponsor: data.recordset[0]
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

// Updates sponsor
// vscode-fold=10
exports.updateSponsor = function (req, res, reqBody, files, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @fileId int; "

            if (data.originalFileName && files.length) {
                sqlInst += `delete from files where filename = '${data.originalFileName}'; `;
            }

            _.forEach(files, function (file) {
                sqlInst += "insert into files (portalid, [filename], fileoriginalname, filesize, filemimetype, filefolder, createdbyuser, createdondate) ";
                sqlInst += `values (${data.portalId}, '${file.filename}', '${file.originalname}', ${file.size}, '${file.mimetype}', 'logo', ${data.createdByUser} `;
                sqlInst += ", getdate()); set @fileId = @@IDENTITY; ";
            });

            sqlInst += `update sponsors set portalId = ${data.portalId}, sponsorname = '${data.sponsorName}', sponsorurl = '${data.sponsorUrl}', 
                        active = '${data.active}', sponsorGroup = ${data.sponsorGroup}, sponsorCategory = ${data.sponsorCategory},
                        sponsorRegion = ${data.sponsorRegion}, sponsorState = ${data.sponsorState}, sponsorCity = ${data.sponsorCity}`;

            if (files.length) sqlInst += ", fileid = @fileId ";
            if (data.dateStart) sqlInst += ", datestart = '" + data.dateStart + "' ";
            if (data.dateEnd) sqlInst += ", dateend = '" + data.dateEnd + "' ";

            sqlInst += `where sponsorid = ${data.sponsorId}; `;

            // let categories = JSON.parse(data.sponsorCategories);
            // if (categories) {
            //     sqlInst += `delete from sponsorcategories where sponsorid = ${data.sponsorId}; `;
            // }
            // _.forEach(categories, function (category) {
            //     sqlInst += `insert into sponsorcategories (sponsorid, categoryid) values (${data.sponsorId}, ${category.id}); `;
            // });

            sqlInst += 'select top 1 [filename] from files where fileid = @fileId; ';

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    cb({
                        error: err.message
                    });
                } else {
                    cb({
                        success: "success",
                        sponsorLogo: data.recordset[0]
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

// Gets categories
// vscode-fold=11
exports.getCategories = function (req, res, categoryName) {
    try {
        let sqlInst = '';
        if (categoryName) {
            sqlInst = `select * from categories where categoryname = '${categoryName}'); `;
        } else {
            sqlInst = `select * from categories; `;
        }

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

// Updates category
// vscode-fold=12
exports.addCategory = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; ';
            sqlInst += `if not (exists (select top 1 1 from categories where categoryname = '${data.categoryName}')) `;
            sqlInst += `insert into categories (categoryname, categorytype) values ('${data.categoryName}', '${data.categoryType}'); set @id = scope_identity(); select @id as categoryId `;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        categoryId: data.recordset[0]
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

// Updates category
// vscode-fold=13
exports.updateCategory = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update categories set categoryname = '${data.categoryName}', categorytype = '${data.categoryType}' where categoryid = ${data.categoryId}; `;

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

// Removes category
// vscode-fold=14
exports.removeCategory = function (req, res, categoryId) {
    try {
        let sqlInst = `delete from categories where categoryid = ${categoryId}`;

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
    }
};

// Gets regions
// vscode-fold=15
exports.getRegions = function (req, res, regionName) {
    try {
        let sqlInst = '';
        if (regionName) {
            sqlInst = `select * from regions where regionname = '${regionName}'); `;
        } else {
            sqlInst = `select * from regions; `;
        }

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

// Updates region
// vscode-fold=16
exports.addRegion = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; ';
            sqlInst += `if not (exists (select top 1 1 from regions where regionname = '${data.regionName}')) `;
            sqlInst += `insert into regions (regionname) values ('${data.groupName}'); set @id = scope_identity(); select @id as regionId; `;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        regionId: data.recordset[0]
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

// Updates region
// vscode-fold=17
exports.updateRegion = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update region set regionname = '${data.regionName}' where regionid = ${data.regionId}; `;

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

// Removes region
// vscode-fold=18
exports.removeRegion = function (req, res, regionId) {
    try {
        let sqlInst = `delete from regions where regionid = ${regionId}`;

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
    }
};

// Gets groups
// vscode-fold=19
exports.getGroups = function (req, res, groupName) {
    try {
        let sqlInst = '';
        if (groupName) {
            sqlInst = `select * from groups where groupname = '${groupName}'); `;
        } else {
            sqlInst = `select * from groups; `;
        }

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

// Updates group
// vscode-fold=20
exports.addGroup = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; '
            sqlInst += `if not (exists (select top 1 1 from groups where groupname = '${data.groupName}')) `;
            sqlInst += `insert into groups (groupname) values ('${data.groupName}'); set @id = scope_identity(); select @id as groupId`;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        groupId: data.recordset[0]
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

// Updates group
// vscode-fold=21
exports.updateGroup = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update groups set groupname = '${data.groupName}' where groupid = ${data.groupId}; `;

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

// Removes group
// vscode-fold=22
exports.removeGroup = function (req, res, groupId) {
    try {
        let sqlInst = `delete from groups where groupid = ${groupId}`;

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
    }
};

// Gets states
// vscode-fold=23
exports.getStates = function (req, res, stateName) {
    try {
        let sqlInst = '';
        if (stateName) {
            sqlInst = `select * from states where statename = '${stateName}'); `;
        } else {
            sqlInst = `select * from states; `;
        }

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

// Gets cities
// vscode-fold=24
exports.getCities = function (req, res, cityName, stateId) {
    try {
        let sqlInst = '';
        if (cityName) {
            sqlInst = `select * from cities where cityname like '${cityName}%' and stateid = ${stateId}; `;
        } else if (stateId) {
            sqlInst = `select * from cities where stateid = ${stateId}; `;
        } else {
            sqlInst = `select * from cities; `;
        }

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

// Updates city
// vscode-fold=25
exports.addCity = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; ';
            sqlInst += `if not (exists (select top 1 1 from cities where cityname = '${data.cityName}' and stateid = ${data.stateId})) `;
            sqlInst += `insert into cities (cityname, stateid) values ('${data.cityName}', ${data.stateId}); set @id = scope_identity(); select @id as cityId`;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        cityId: data.recordset[0]
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

// Updates city
// vscode-fold=26
exports.updateCity = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update cities set cityname = '${data.regionName}', stateid = ${data.stateId} where cityid = '${data.cityId}'; `;

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

// Removes city
// vscode-fold=27
exports.removeCity = function (req, res, cityId) {
    try {
        let sqlInst = `delete from cities where cityid = ${cityId}`;

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
    }
};

// Gets recipients
// vscode-fold=28
exports.getRecipientsMailList = function (req, res, reqBody, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = `select r.recipientId, r.recipientName, r.recipientEmail
                           from recipients r
                           where (${data.groupId} = '' or r.recipientGroup = ${data.groupId})
                           and (${data.regionId} = '' or r.recipientRegion = ${data.regionId})
                           and (${data.categoryId} = '' or r.recipientCategory = ${data.categoryId})
                           and (${data.cityId} = '' or r.recipientCity = ${data.cityId})
                           and (${data.stateId} = '' or r.recipientState = ${data.stateId})
                           and ('${data.term}' = '' or r.recipientname like '${data.term}%')
                           and (${data.recipientId} = 0 or r.recipientid = ${data.recipientId});`;

            sqlInst += `select s.sponsorId, s.sponsorName, 
                        (select top 1 f.[filename] from files f where f.fileid = s.fileid) as sponsorLogo,
                        s.fileId from sponsors s
                        where (s.datestart is null or getdate() > s.datestart) 
	                    and (s.datestart is null or s.dateend > getdate());`;

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    cb({
                        error: err.message
                    });
                } else {
                    cb({
                        response: {
                            recipients: data.recordsets[0],
                            sponsors: data.recordsets[1]
                        }
                    })
                }
            });
        } else {
            // throw new Error("Input not valid");
            cb({
                error: `Input not valid (status: 500)`
            });
        }
    } catch (ex) {
        cb({
            error: ex.message
        });
    };
};

// Gets recipients
// vscode-fold=29
exports.getRecipients = function (req, res) {
    try {
        let sqlInst = 'select r.recipientId, r.recipientName, r.recipientPhone, r.recipientEmail, r.recipientAddress ';
        sqlInst += ",(r.recipientAddress + ', ' + (select cityname from cities where cityId = r.recipientCity) + ' - ' + (select statename from states where stateId = r.recipientState)) as completeAddress ";
        sqlInst += ",stuff((select ',', ' ' + convert(varchar, cityid) + ':' + cityname from cities where cityid = r.recipientCity for xml path('')), 1, 2, '') as recipientCity ";
        sqlInst += ",stuff((select ',', ' ' + convert(varchar, stateid) + ':' + statename from states where stateid = r.recipientState for xml path('')), 1, 2, '') as recipientState ";
        sqlInst += ",stuff((select ',', ' ' + convert(varchar, regionid) + ':' + regionname from regions where regionid = r.recipientRegion for xml path('')), 1, 2, '') as recipientRegion ";
        sqlInst += ",stuff((select ',', ' ' + convert(varchar, groupid) + ':' + groupname from groups where groupid = r.recipientGroup for xml path('')), 1, 2, '') as recipientGroup ";
        sqlInst += ",stuff((select ',', ' ' + convert(varchar, categoryid) + ':' + categoryname from categories where categoryid = r.recipientCategory for xml path('')), 1, 2, '') as recipientCategory ";
        sqlInst += 'into #temp from recipients r order by r.createdondate desc; select * from #temp; drop table #temp;';

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

// Adds recipient
// vscode-fold=230
exports.addRecipient = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int; "

            sqlInst += "insert into recipients (portalId, recipientname, recipientphone, recipientemail, recipientaddress, recipientcity, recipientstate, recipientregion, recipientgroup, recipientcategory, createdbyuser, createdondate";

            sqlInst += `) values (${data.portalId}, '${data.recipientName}', '${data.recipientPhone}', '${data.recipientEmail}', '${data.recipientAddress}', ${data.recipientCity}, ${data.recipientState}, ${data.recipientRegion}, ${data.recipientGroup}, ${data.recipientCategory}, ${data.createdByUser}, getdate()`;

            sqlInst += "); set @id = scope_identity(); ";

            sqlInst += 'select r.recipientId, r.recipientName, r.recipientPhone, r.recipientEmail, r.recipientAddress ';
            sqlInst += ",(r.recipientAddress + ', ' + (select cityname from cities where cityId = r.recipientCity) + ' - ' + (select statename from states where stateId = r.recipientState)) as completeAddress ";
            sqlInst += ",stuff((select ',', ' ' + convert(varchar, cityid) + ':' + cityname from cities where cityid = r.recipientCity for xml path('')), 1, 2, '') as recipientCity ";
            sqlInst += ",stuff((select ',', ' ' + convert(varchar, stateid) + ':' + statename from states where stateid = r.recipientState for xml path('')), 1, 2, '') as recipientState ";
            sqlInst += ",stuff((select ',', ' ' + convert(varchar, regionid) + ':' + regionname from regions where regionid = r.recipientRegion for xml path('')), 1, 2, '') as recipientRegion ";
            sqlInst += ",stuff((select ',', ' ' + convert(varchar, groupid) + ':' + groupname from groups where groupid = r.recipientGroup for xml path('')), 1, 2, '') as recipientGroup ";
            sqlInst += ",stuff((select ',', ' ' + convert(varchar, categoryid) + ':' + categoryname from categories where categoryid = r.recipientCategory for xml path('')), 1, 2, '') as recipientCategory ";
            sqlInst += 'into #temp from recipients r where recipientid = @id order by r.createdondate desc; select * from #temp; drop table #temp;';

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json(data.recordset[0]);
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

// Updates recipient
// vscode-fold=31
exports.updateRecipient = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update recipients set recipientname = '${data.recipientName}', recipientphone = '${data.recipientPhone}', recipientemail = '${data.recipientEmail}', recipientaddress = '${data.recipientAddress}', recipientcity = ${data.recipientCity}, recipientstate = ${data.recipientState}, recipientregion = ${data.recipientRegion}, recipientgroup = ${data.recipientGroup}, recipientcategory = ${data.recipientCategory} where recipientid = ${data.recipientId}; `;

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

// Removes recipient
// vscode-fold=32
exports.removeRecipient = function (req, res, recipientId) {
    try {
        let sqlInst = `delete from recipients where recipientid = ${recipientId}`;

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
    }
};

// Adds email template
// vscode-fold=33
exports.addEmailTemplate = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int; "

            sqlInst += "insert into emailtemplates (portalId, templatename, headertemplate, bodytemplate, footertemplate, createdbyuser, createdondate";

            sqlInst += `) values (${data.portalId}, '${data.templateName}', '${data.headerTemplate}', '${data.bodyTemplate}', '${data.footerTemplate}', ${data.createdByUser}, getdate()`;

            sqlInst += "); set @id = scope_identity(); ";

            sqlInst += 'select @id as templateId;';

            db.querySql(sqlInst, function (data, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json(data.recordset[0]);
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

// Updates email template
// vscode-fold=34
exports.updateEmailTemplate = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update emailtemplates set templatename = '${data.templateName}', headertemplate = '${data.headerTemplate}', bodytemplate = '${data.bodyTemplate}', footertemplate = '${data.footerTemplate}' where templateid = ${data.templateId}; `;

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

// Removes email template
// vscode-fold=35
exports.removeEmailTemplate = function (req, res, templateId) {
    try {
        let sqlInst = `delete from emailtemplates where templateid = ${templateId}`;

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
    }
};

// Gets email templates
// vscode-fold=36
exports.getEmailTemplates = function (req, res) {
    try {
        let sqlInst = 'select * from emailtemplates;';

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

// Gets email template by id
// vscode-fold=37
exports.getEmailTemplate = function (req, res, templateId) {
    try {
        let sqlInst = `select * from emailtemplates where templateid = ${templateId};`;

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

// Adds email log
// vscode-fold=38
exports.addEmailLog = function (req, res, portalId, sent, sentLog, notSent, attachies, toWhom, subject, sentDate, cb) {
    try {
        let sqlInst = "insert into sendlog (portalId, sent, sentlog, notsent, attachments, towhom, subject, sentondate";

        sqlInst += `) values (${portalId}, ${sent}, '${sentLog}', ${notSent}, ${attachies}, '${toWhom}', '${subject}', '${sentDate}'); `;

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
    } catch (ex) {
        res.status(500).send(
            ex.message
        );
    };
};

// Gets email templates
// vscode-fold=39
exports.getHistories = function (req, res) {
    try {
        let sqlInst = 'select * from sendlog;';

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