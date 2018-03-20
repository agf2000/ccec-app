const express = require('express');
const apiController = require('../controllers/apiController');
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const thumb = require('node-thumbnail').thumb;
const multer = require('multer');
const fse = require('fs-extra');
const path = require('path');
const shortid = require('shortid');
// const uuid = require('uuid/v4');
const email = require('../config/emailConfig');
const _ = require('lodash');
const mime = require('mime-types');
const moment = require('moment');
const router = express.Router();

let tempFolder = shortid.generate(),
    tempPath;

// Multer
// vscode-fold=1
let uploadDocs = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            tempPath = path.join(__dirname, '..', 'data/uploads/' + tempFolder);
            fse.mkdirsSync(path.join(__dirname, '..', 'data/uploads/docs'));
            callback(null, path.join(__dirname, '..', 'data/uploads/docs'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

let uploadLogo = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            tempPath = path.join(__dirname, '..', 'data/uploads/' + tempFolder);
            fse.mkdirsSync(tempPath);
            callback(null, tempPath);
        },
        filename: function (req, file, cb) {
            let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
            cb(null, shortid.generate() + '.' + ext);

        }
    })
});

let _getAllFilesFromFolder = function (dir) {

    let filesystem = require("fs");
    let results = [];

    filesystem.readdirSync(dir).forEach(function (file) {

        file = dir + '/' + file;
        let stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;

};

// Gets list of settings
// vscode-fold=2
router.get('/settings', ensureAuthenticated, function (req, res) {
    apiController.getSettings(req, res, req.body.settingName);
});

// Update settings
// vscode-fold=3
router.put('/settings', ensureAuthenticated, function (req, res, next) {
    apiController.saveSettings(req, res, req.body);
});

// Gets list of sponsors
// vscode-fold=4
router.get('/sponsors', function (req, res) {
    apiController.getSponsors(req, res);
});

// Get sponsor by id
// vscode-fold=5
router.get('/sponsor/:sponsorId', function (req, res) {
    apiController.getSponsor(req, res, req.params.sponsorId);
});

// Removes sponsor
// vscode-fold=6
router.delete('/sponsor', function (req, res) {
    fse.remove(`data/uploads/logos/${req.body.sponsorId}`, err => {
        if (err) return console.error(err);

        console.log('success!'); // I just deleted my entire HOME directory.

        apiController.removeSponsor(req, res, req.body.sponsorId);
    });
});

// Removes sponsor logo
// vscode-fold=7
router.delete('/sponsorImage', function (req, res) {
    fse.remove(`data/uploads/logos/${req.body.sponsorId}/`, err => {
        if (err) return console.error(err)

        console.log('success!') // I just deleted my entire HOME directory.

        apiController.removeSponsorImage(req, res, req.body.sponsorId);
    });
});

// Adds sponsor
// vscode-fold=8
router.post('/sponsor', ensureAuthenticated, uploadLogo.array('inputLogo'), function (req, res, next) {
    if (req.files[0]) {
        apiController.addSponsor(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.error) {
                // Create posting folders
                let pathLarge = path.join(__dirname, '..', 'data/uploads/logos/' + result.sponsor.sponsorId + '/large');
                let pathThumb = path.join(__dirname, '..', 'data/uploads/logos/' + result.sponsor.sponsorId + '/thumbnail');
                fse.mkdirsSync(pathLarge);
                fse.mkdirsSync(pathThumb);

                thumb({
                    source: tempPath,
                    destination: pathThumb,
                    width: 160
                }).then(function (files, error, stdout, stderr) {
                    if (error) return console.error(error)

                    // Move files into posting folders                
                    fse.move(tempPath, pathLarge, {
                        overwrite: false
                    }, err => {
                        if (err) return console.error(err)

                        res.json({
                            sponsor: result.sponsor
                        })
                    });
                }).catch(function (e) {
                    console.log('Error', e.toString());
                });
            } else {
                res.json({
                    error: result.error
                });
            }
        });
    } else {
        apiController.addSponsor(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.Error) {
                res.json({
                    sponsorId: result.sponsor.sponsorId
                });
            } else {
                res.json({
                    error: result.error
                });
            }
        });
    }
});

// Update sponsor
// vscode-fold=9
router.put('/sponsor', ensureAuthenticated, uploadLogo.array('inputLogo'), function (req, res, next) {
    if (req.files[0]) {
        fse.remove(path.join(__dirname, '..', 'data/uploads/logos/' + req.body.sponsorId + '/large/' + req.body.originalFileName));
        fse.remove(path.join(__dirname, '..', 'data/uploads/logos/' + req.body.sponsorId + '/thumbnail/' + req.body.originalFileName.replace(/(\.[\w\d_-]+)$/i, '_thumb$1')));

        apiController.updateSponsor(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.error) {
                // Create posting folders
                let pathLarge = path.join(__dirname, '..', 'data/uploads/logos/' + req.body.sponsorId + '/large');
                let pathThumb = path.join(__dirname, '..', 'data/uploads/logos/' + req.body.sponsorId + '/thumbnail');
                fse.mkdirsSync(pathLarge);
                fse.mkdirsSync(pathThumb);

                thumb({
                    source: tempPath,
                    destination: pathThumb,
                    width: 160
                }).then(function (files, error, stdout, stderr) {
                    if (error) return console.error(error)

                    // Move files into posting folders                
                    fse.move(tempPath, pathLarge, {
                        overwrite: false
                    }, err => {
                        if (err) return console.error(err)

                        res.json({
                            success: "success",
                            sponsorLogo: req.files[0].filename
                        })
                    });
                }).catch(function (e) {
                    console.log('Error', e);
                });
            } else {
                res.status(500).json({
                    error: result.error
                });
            }
        });
    } else {
        apiController.updateSponsor(req, res, req.body, (req.files ? req.files : null), function (result) {
            if (!result.Error) {
                res.json({
                    success: "success"
                });
            } else {
                res.status(500).json({
                    error: result.error
                });
            }
        });
    }
});

// Adds recipient
// vscode-fold=10
router.post('/recipient', ensureAuthenticated, function (req, res, next) {
    apiController.addRecipient(req, res, req.body);
});

// Updates recipient
// vscode-fold=11
router.put('/recipient', ensureAuthenticated, function (req, res, next) {
    apiController.updateRecipient(req, res, req.body);
});

// Removes recipient
// vscode-fold=12
router.delete('/recipient', function (req, res) {
    apiController.removeRecipient(req, res, req.body.recipientId);
});

// Gets list of recipients
// vscode-fold=13
router.get('/recipients', function (req, res) {
    apiController.getRecipients(req, res);
});

// Gets list of categories
// vscode-fold=14
router.get('/categories', function (req, res) {
    apiController.getCategories(req, res, req.body.categoryName, req.body.categoryType);
});

// Adds category
// vscode-fold=15
router.post('/category', ensureAuthenticated, function (req, res, next) {
    apiController.addCategory(req, res, req.body);
});

// Updates category
// vscode-fold=16
router.put('/category', ensureAuthenticated, function (req, res, next) {
    apiController.updateCategory(req, res, req.body);
});

// Remoces category
// vscode-fold=17
router.delete('/category', function (req, res) {
    apiController.removeCategory(req, res, req.body.categoryId);
});

// Gets list of groups
// vscode-fold=18
router.get('/groups', function (req, res) {
    apiController.getGroups(req, res);
});

// Adds group
// vscode-fold=19
router.post('/group', ensureAuthenticated, function (req, res, next) {
    apiController.addGroup(req, res, req.body);
});

// Updates group
// vscode-fold=20
router.put('/group', ensureAuthenticated, function (req, res, next) {
    apiController.updateGroup(req, res, req.body);
});

// Removes group
// vscode-fold=21
router.delete('/group', function (req, res) {
    apiController.removeGroup(req, res, req.body.groupId);
});

// Gets list of regions
// vscode-fold=22
router.get('/regions', function (req, res) {
    apiController.getRegions(req, res);
});

// Adds region
// vscode-fold=23
router.post('/region', ensureAuthenticated, function (req, res, next) {
    apiController.addRegion(req, res, req.body);
});

// Updates region
// vscode-fold=24
router.put('/region', ensureAuthenticated, function (req, res, next) {
    apiController.updateRegion(req, res, req.body);
});

// Removes region
// vscode-fold=25
router.delete('/region', function (req, res) {
    apiController.removeRegion(req, res, req.body.regionId);
});

// Gets list of states
// vscode-fold=26
router.get('/states', function (req, res) {
    apiController.getStates(req, res);
});

// Adds state
// vscode-fold=27
router.post('/state', ensureAuthenticated, function (req, res, next) {
    apiController.updateState(req, res, req.body);
});

// Gets list cities
// vscode-fold=28
router.get('/cities', function (req, res) {
    apiController.getCities(req, res, req.query.term, req.query.stateId);
});

// Adds city
// vscode-fold=29
router.post('/city', ensureAuthenticated, function (req, res, next) {
    apiController.addCity(req, res, req.body);
});

// Updates city
// vscode-fold=30
router.put('/city', ensureAuthenticated, function (req, res, next) {
    apiController.updateCity(req, res, req.body);
});

// Removes city
// vscode-fold=31
router.delete('/city', function (req, res) {
    apiController.removeCity(req, res, req.body.cityId);
});

// Adds email tempate
// vscode-fold=32
router.post('/emailTemplate', ensureAuthenticated, function (req, res, next) {
    apiController.addEmailTemplate(req, res, req.body);
});

// Updates email template
// vscode-fold=33
router.put('/emailTemplate', ensureAuthenticated, function (req, res, next) {
    apiController.updateEmailTemplate(req, res, req.body);
});

// Gets list of email templates
// vscode-fold=34
router.get('/emailTemplates', function (req, res) {
    apiController.getEmailTemplates(req, res);
});

// Gets email template by id
// vscode-fold=35
router.get('/emailTemplate/:templateId', function (req, res) {
    apiController.getEmailTemplate(req, res, req.params.templateId);
});

// Removes email template
// vscode-fold=36
router.delete('/emailTemplate', function (req, res) {
    apiController.removeEmailTemplate(req, res, req.body.templateId);
});

// Add docs from upload
// vscode-fold=37
router.post('/uploadDocs', ensureAuthenticated, uploadDocs.array('inputDocs'), function (req, res, next) {
    if (req.files) {
        res.json({
            success: "success"
        });
    }
});

// Gets list of files
// vscode-fold=38
// router.get('/files', function (req, res) {
//     res.json({
//         response: _getAllFilesFromFolder(path.join(__dirname, '..', 'data/uploads/'))
//     });
// });

// Gets list of email recipients
// vscode-fold=38
router.get('/recipientsMailingList', ensureAuthenticated, function (req, res, next) {
    apiController.getRecipientsMailList(req, res, req.query, function (results) {
        if (!results.error) {
            res.json({
                recipients: results
            });
        }
    });
});

// Sends emails
// vscode-fold=39
router.post('/sendEmail', ensureAuthenticated, function (req, res, next) {
    apiController.getRecipientsMailList(req, res, req.body, function (results) {
        if (!results.error) {
            let content = '',
                sent = 0,
                notSent = 0,
                counter = 1;

            let sponsors = '';

            _.forEach(results.response.sponsors, function (sponsor) {
                sponsors += `<a href="${sponsor.sponsorUrl}"><img src="http://ccecapp.riw.com.br/uploads/logos/${sponsor.sponsorId}/large/${sponsor.sponsorLogo}" title="${sponsor.sponsorName}" /></a><br />`;
            });

            _.forEach(results.response.recipients, function (person) {

                content = req.body.content.replace('[RESPONSAVEL]', person.recipientName);

                content = content.replace('[PATROCINADOR]', sponsors);

                // if (JSON.parse(req.body.singleAttach)) {
                let attachments = _getAllFilesFromFolder(path.join(__dirname, '..', 'data/uploads/docs/'));
                if (attachments) {
                    let attachArray = [];
                    attachArray.push({
                        data: `<html>${content}</html>`,
                        alternative: true
                    });

                    _.forEach(attachments, function (item) {
                        attachArray.push({
                            path: item,
                            type: mime.lookup(item),
                            name: item
                        });
                    });

                    // send the message and get a callback with an error or details of the message that was sent 
                    email.send({
                        text: content,
                        from: "Colégio CEC <contato@riw.com.br>",
                        to: '"' + person.recipientName + '" <' + person.recipientEmail + '>',
                        subject: req.body.subject,
                        attachment: attachArray
                    }, function (emailErr, message) {
                        if (emailErr) {
                            notSent++;
                        } else {
                            sent++;
                        }

                        apiController.addEmailLog(req, res, 0, sent, emailErr, notSent, attachArray.length, '"' + person.recipientName + '" <' + person.recipientEmail + '>', req.body.subject, moment(message.header.date).format('YYYY-MM-DD HH:mm'), function (cb) {
                            if (cb.error) return console.error(cb.error)

                            counter++;

                            if (counter == results.response.recipients.length) {
                                fse.remove(path.join(__dirname, '..', 'data/uploads/docs/'), err => {
                                    if (err) return console.error(err)

                                    res.json({
                                        success: "success"
                                    });
                                });
                            }
                        });

                        // console.log(emailErr || message);
                    });
                    // } else {
                    //     notSent++;

                    //     apiController.addEmailLog(req, res, 0, sent, emailErr, notSent, 0, '"' + person.recipientName + '" <' + person.recipientEmail + '>', req.body.subject, moment().format('YYYY-MM-DD HH:mm'), function (cb) {
                    //         if (cb.error) return console.error(cb.error)

                    //         res.json({
                    //             success: "success"
                    //         });
                    //     });
                    // }
                } else {

                    // fse.readdir(path.join(__dirname, '..', 'data/uploads/docs/'), function (err, files) {
                    //     if (err) {
                    //         // some sort of error
                    //     } else {
                    //         if (!files.length) {
                    //             // directory appears to be empty
                    // send the message and get a callback with an error or details of the message that was sent 
                    email.send({
                        text: content,
                        from: "Colégio CEC <contato@riw.com.br>",
                        to: '"' + person.recipientName + '" <' + person.recipientEmail + '>',
                        subject: req.body.subject,
                        attachment: [{
                            data: `<html>${content}</html>`,
                            alternative: true
                        }]
                    }, function (emailErr, message) {
                        if (emailErr) {
                            notSent++;
                        } else {
                            sent++;
                        }

                        apiController.addEmailLog(req, res, 0, sent, emailErr || '', notSent, 0, '"' + person.recipientName + '" <' + person.recipientEmail + '>', req.body.subject, moment(message.header.date).format('YYYY-MM-DD HH:mm'), function (cb) {
                            if (cb.error) console.error(cb.error);

                            counter++;

                            if (counter == results.response.recipients.length) {
                                res.json({
                                    success: "success"
                                });
                            }
                        });

                        // console.log(emailErr || message);
                    });
                    //         } else {
                    //             let attachments = _getAllFilesFromFolder(path.join(__dirname, '..', 'data/uploads/docs/'));
                    //             let attachment;
                    //             _.findKey(attachments, function (f) {
                    //                 attachment = o.indexOf(person.recipientId);
                    //             });

                    //             // send the message and get a callback with an error or details of the message that was sent 
                    //             email.send({
                    //                 text: content,
                    //                 from: "Colégio CEC <contato@riw.com.br>",
                    //                 to: '"' + person.recipientName + '" <' + person.recipientEmail + '>',
                    //                 subject: req.body.subject,
                    //                 attachment: [{
                    //                         data: `<html>${content}</html>`,
                    //                         alternative: true
                    //                     },
                    //                     {
                    //                         path: attachment,
                    //                         type: mime.lookup(attachment),
                    //                         name: "Boleto"
                    //                     }
                    //                 ]
                    //             }, function (emailErr, message) {
                    //                 if (emailErr) {
                    //                     notSent++;
                    //                 } else {
                    //                     sent++;
                    //                 }

                    //                 apiController.addEmailLog(req, res, 0, sent, emailErr || '', notSent, attachments.length, '"' + person.recipientName + '" <' + person.recipientEmail + '>', req.body.subject, moment(message.header.date).format('YYYY-MM-DD HH:mm'), function (cb) {
                    //                     console.error(cb.error);

                    //                     counter++;

                    //                     if (counter == results.response.recipients.length) {
                    //                         fse.remove(path.join(__dirname, '..', 'data/uploads/docs/'), err => {
                    //                             if (err) return console.error(err)

                    //                             res.json({
                    //                                 success: "success"
                    //                             });
                    //                         });
                    //                     }
                    //                 });

                    //                 // console.log(emailErr || message);
                    //             });
                    //         }
                    //     }
                    // });
                }
            });
        }
    });
});

// Gets list of email history
// vscode-fold=40
router.get('/histories', ensureAuthenticated, function (req, res, next) {
    apiController.getHistories(req, res, req.query, function (results) {
        if (!results.error) {
            res.json({
                histories: results
            });
        }
    });
});

// Gets list of files
// vscode-fold=41
router.get('/files', ensureAuthenticated, function (req, res, next) {
    let filesArray = [];
    let files = _getAllFilesFromFolder(path.join(__dirname, '..', 'data/uploads/docs/'));
    _.forEach(files, function (file) {
        filesArray.push({
            fileName: path.basename(file),
            filePath: path.relative(process.cwd(), file),
            fileType: mime.lookup(file),
            folder: path.dirname(path.relative(process.cwd(), file)).replace('data\\', '')
        })
    });

    res.json({
        filesArray
    });
});

// Removes sponsor logo
// vscode-fold=42
router.delete('/attachment', function (req, res) {
    fse.remove(req.body.filePath, err => {
        if (err) return console.error(err)

        // console.log('success!') // I just deleted my entire HOME directory.
        apiController.removeAttachment(req, res, req.query.files, function (result) {
            if (!result.error) {
                res.json({
                    success: "success"
                });
            } else {
                res.json({
                    error: result.error
                });
            }
        });
    });
});

module.exports = router;