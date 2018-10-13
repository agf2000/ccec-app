const db = require("../core/db");
const _ = require('lodash');

// Gets settings
// vscode-fold=1
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

// Saves settings
// vscode-fold=2
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

// Gets list of sponsors mailing list
// vscode-fold=3
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
// vscode-fold=4
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
// vscode-fold=5
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
// vscode-fold=6
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
// vscode-fold=7
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
// vscode-fold=8
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
// vscode-fold=9
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
// vscode-fold=10
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
// vscode-fold=11
exports.addCategory = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; ';
            sqlInst += `insert into categories (categoryname, categorytype) values ('${data.categoryName}', '${data.categoryType}'); `;
            sqlInst += 'set @id = scope_identity(); select @id as categoryId; ';

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        categoryId: result.recordset[0]
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
// vscode-fold=12
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
// vscode-fold=13
exports.removeCategory = function (req, res, categoryId) {
    try {
        let sqlInst = `if not exists(select 1 from sponsors where sponsorcategory = ${categoryId}) 
                       or not exists(select 1 from recipients where recipientcategory = ${categoryId})
                       delete from categories where categoryid = ${categoryId}; `;

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
// vscode-fold=14
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
// vscode-fold=15
exports.addRegion = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; ';
            sqlInst += `insert into regions (regionname) values ('${data.groupName}'); set @id = scope_identity(); select @id as regionId; `;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        regionId: result.recordset[0]
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
// vscode-fold=16
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
// vscode-fold=17
exports.removeRegion = function (req, res, regionId) {
    try {
        let sqlInst = `if not exists(select 1 from sponsors where sponsorregion = ${regionId})
                       or not exists(select 1 from recipients where recipientregion = ${regionId})
                       delete from regions where regionid = ${regionId}; `;

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
// vscode-fold=18
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
// vscode-fold=19
exports.addGroup = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = 'declare @id int; '
            sqlInst += `insert into groups (groupname) values ('${data.groupName}'); set @id = scope_identity(); select @id as groupId`;

            db.querySql(sqlInst, function (result, err) {
                if (err) {
                    console.log(err.message);
                    res.status(500).json({
                        "error": err.message
                    });
                } else {
                    res.json({
                        groupId: result.recordset[0]
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
// vscode-fold=20
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
// vscode-fold=21
exports.removeGroup = function (req, res, groupId) {
    try {
        let sqlInst = `if not exists(select 1 from sponsors where sponsorgroup = ${groupId})
                       or not exists(select 1 from recipients where recipientgroup = ${groupId})
                       delete from groups where groupid = ${groupId}; `;

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
// vscode-fold=22
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
// vscode-fold=23
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
// vscode-fold=24
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
// vscode-fold=25
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
// vscode-fold=26
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
// vscode-fold=27
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

            sqlInst += `select s.sponsorId, s.sponsorName, sponsorUrl, 
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
// vscode-fold=28
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
// vscode-fold=29
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
// vscode-fold=30
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
// vscode-fold=31
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
// vscode-fold=32
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
// vscode-fold=33
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
// vscode-fold=34
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
// vscode-fold=35
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
// vscode-fold=36
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
// vscode-fold=37
exports.addEmailLog = function (req, res, portalId, sent, toEmail, attachies, toWhom, subject, sentDate, cb) {
    try {
        let sqlInst = "insert into sendlog (portalId, sent, toemail, attachments, towhom, subject, sentondate";

        sqlInst += `) values (${portalId}, '${sent}', '${toEmail}', ${attachies}, '${toWhom}', '${subject}', '${sentDate}'); `;

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
// vscode-fold=38
exports.getHistories = function (req, res, filter) {
    try {
        let sqlInst = 'select * from sendlog ';
        sqlInst += 'where 1 = 1 ';
        if (filter.sent)
            sqlInst += `and sent = '${filter.sent}' `;
        if (filter.toEmail)
            sqlInst += `and toemail like '%${filter.toEmail}%' `;
        if (filter.toWhom)
            sqlInst += `and towhom like '%${filter.toWhom}%' `;
        if (filter.subject)
            sqlInst += `and subject like '%${filter.subject}%' `;

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

// Removes attachment(s)
// vscode-fold=39
exports.removeAttachment = function (req, res, fileId, cb) {
    try {
        let sqlInst = `delete from attachments where fileid = ${fileId}`;

        db.querySql(sqlInst, function (data, err) {
            if (err) {
                console.log(err.message);
                cb({
                    error: err.message
                });
            } else {
                cb({
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

// Removes histories
// vscode-fold=40
exports.removeHistories = function (req, res) {
    try {
        let sqlInst = 'delete from sendlog';

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

// Removes history
// vscode-fold=41
exports.removeHistory = function (req, res, sentLogId) {
    try {
        let sqlInst = `delete from sendlog where sentLogid = ${sentLogId}; `;

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

// Gets list of students
// vscode-fold=42
exports.getStudents = function (req, res) {
    try {
        let sqlInst = `select [portalId], [studentId], [studentCode], [studentGrade], [studentName], [studentEmail], 
                      isnull([studentBDay], null) as studentBDay , [studentShift], [fatherName], [fatherEmail],
                      isnull([fatherBDay], null) as fatherBDay, [motherName], [motherEmail], isnull([motherBDay], null) as motherBDay,
                      [createdOnDate], [createdByUser], [modifiedOnDate], [modifiedByUser] from students `;

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
        cb({
            'error': ex.message
        });
    };
};

// Adds student
// vscode-fold=43
exports.addStudent = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let sqlInst = "declare @id int; "

            sqlInst += "insert into students (portalId, studentcode, studentname, studentgrade, studentshift, studentemail,  fathername, fatheremail, mothername, motheremail, createdbyuser, createdondate";

            if (data.studentBDay) {
                sqlInst += `, studentbday`
            }

            if (data.fatherBDay) {
                sqlInst += `, fatherbday`
            }

            if (data.motherBDay) {
                sqlInst += `, motherbday`
            }

            sqlInst += `) values (${data.portalId}, '${data.studentCode}', '${data.studentName}', '${data.studentGrade}', '${data.studentShift}', '${data.studentEmail}', '${data.fatherName}', '${data.fatherEmail}', '${data.motherName}', '${data.motherEmail}', ${data.createdByUser}, getdate()`;

            if (data.studentBDay) {
                sqlInst += `, '${studentBDay}'`
            }

            if (data.fatherBDay) {
                sqlInst += `, '${fatherBDay}'`
            }

            if (data.motherBDay) {
                sqlInst += `, '${motherBDay}'`
            }

            sqlInst += "); set @id = scope_identity(); ";

            sqlInst += 'select * ';
            sqlInst += 'from students where studentid = @id order by createdondate desc; ';

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

// Updates student
// vscode-fold=44
exports.updateStudent = function (req, res, reqBody) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {

            let sqlInst = `update students set studentname = '${data.studentName}', studentcode = '${data.studentCode}', studentgrade = '${data.studentGrade}', 
            studentemail = '${data.studentEmail}', studentshift = '${data.studentShift}', fathername = '${data.fatherName}', 
            fatheremail = '${data.fatherEmail}', mothername = '${data.motherName}', motheremail = '${data.motherEmail}', modifiedbyuser = ${data.modifiedByUser}, modifiedondate = getdate() `;

            if (data.studentBDay)
                sqlInst += ", studentbday = '" + data.studentBDay + "' ";

            if (data.fatherBDay)
                sqlInst += ", fatherbday = '" + data.fatherBDay + "' ";

            if (data.motherBDay)
                sqlInst += ", motherbday = '" + data.motherBDay + "' ";

            sqlInst += `where studentid = ${data.studentId}; `;

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

// Removes student
// vscode-fold=45
exports.removeStudent = function (req, res, studentId) {
    try {
        let sqlInst = `delete from students where studentid = ${studentId}`;

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

// Gets students mailing list
// vscode-fold=46
exports.getStudentsMailList = function (req, res, reqBody, cb) {
    try {
        if (!reqBody) throw new Error("Input not valid");
        let data = reqBody;
        if (data) {
            let grades = '',
                shifts = '',
                sqlInst = '';

            _.forEach(JSON.parse(data.studentGrade), function (grd) {
                grades += `${grd},`;
            });

            _.forEach(JSON.parse(data.studentShift), function (grd) {
                shifts += `${grd},`;
            });

            sqlInst += 'declare @grades varchar(8000),  @shifts varchar(8000); ';

            sqlInst += `set @grades = '${grades};' `;
            sqlInst += `set @shifts = '${shifts};' `;

            sqlInst += 'delete from studentids; ';

            if (data.students == 'true')
                sqlInst += `insert into studentids (id, name, email)
                    select s.studentid, isnull(s.studentname, ''), isnull(s.studentemail, '')
                    from students s
                    where isnull(s.studentemail, '') < > ''; `;

            if (data.fathers == 'true')
                sqlInst += `insert into studentids (id, name, email)
                    select s.studentid, isnull(s.fathername, ''), isnull(s.fatheremail, '')
                    from students s
                    where isnull(s.fatheremail, '') < > ''; `;

            if (data.mothers == 'true')
                sqlInst += `insert into studentids (id, name, email)
                    select s.studentid, isnull(s.mothername, ''), isnull(s.motheremail, '')
                    from students s
                    where isnull(s.motheremail, '') < > ''; `;

            sqlInst += `select s.[studentId], s.[studentCode], s.[studentGrade], ids.name, isnull(ids.email, '') as emailAddress `;

            // if (data.students == 'true') {
            //     sqlInst += ', s.[studentName] as name ';
            // } else if (data.fathers == 'true') {
            //     sqlInst += ', s.[fatherName] as name ';
            // } else if (data.mothers == 'true') {
            //     sqlInst += ', s.[motherName] as name ';
            // }

            sqlInst += `from students s
                inner join studentids ids on ids.id = s.studentid
                where `;

            if (data.studentId !== "0") {
                sqlInst += `studentid = ${data.studentId} `;
            } else {
                if (data.students == 'true') {
                    sqlInst += `('${data.term}' = '*' or s.studentname like '${data.term}%') `;
                } else if (data.fathers == 'true') {
                    sqlInst += `('${data.term}' = '*' or s.fathername like '${data.term}%') `;
                } else if (data.mothers == 'true') {
                    sqlInst += `('${data.term}' = '*' or s.mothername like '${data.term}%') `;
                }

                if (grades.length > 2)
                    sqlInst += `and ',' + @grades + ',' like '%,' + convert(varchar(8000), isnull(studentgrade, '')) + ',%' `;

                if (shifts.length > 2)
                    sqlInst += `and ',' + @shifts + ',' like '%,' + convert(varchar(8000), isnull(studentshift, '')) + ',%' `;

                // if (data.students == 'true') {
                //     sqlInst += 'order by studentname';
                // } else if (data.fathers == 'true') {
                //     sqlInst += 'order by fathername';
                // } else if (data.mothers == 'true') {
                //     sqlInst += 'order by mothername';
                // }
            }

            sqlInst += 'order by name;';

            sqlInst += `select s.sponsorId, s.sponsorName, sponsorUrl, 
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
                            students: data.recordsets[0],
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