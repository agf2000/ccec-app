const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const peopleController = require("../controllers/peopleController.js");
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const router = express.Router();

// Gets list of users
// vscode-fold=1
router.get('/', ensureAuthenticated, function (req, res) {
	peopleController.getUsers(req, res);
});

// Adds user
// vscode-fold=2
router.post('/user', ensureAuthenticated, function (req, res, next) {
	peopleController.addUser(req, res, req.body);
});

// Updates user
// vscode-fold=3
router.put('/user', ensureAuthenticated, function (req, res, next) {
	peopleController.updateUser(req, res, req.body);
});

// Removes user
// vscode-fold=4
router.delete('/user', ensureAuthenticated, function (req, res, next) {
	peopleController.removeUser(req, res, req.body);
});

// Gets list of rolews
// vscode-fold=2
router.get('/roles', function (req, res) {
	peopleController.getRoles(req, res);
});

// Login Form
// vscode-fold=5
router.get('/login', function (req, res) {
	res.render('login', {
		title: 'Login',
		layout: false,
		script: [
			'/js/pages/login.js'
		]
	});
});

// Registration Form
// vscode-fold=6
router.get('/register', function (req, res) {
	res.render('register', {
		title: 'Cadastro de Usuários',
		pageHeader: 'Cadastro de Usuários',
		pageDesc: 'Para colaboradores e administradores',
		script: [
			'/js/pages/register.js'
		]
	});
});

// Users
// User registration proccess
// vscode-fold=7
router.post('/register', function (req, res, next) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(req.body.password, salt, function (err, hash) {
			if (err) {
				console.log(err);
			}
			req.body.password = hash;

			peopleController.addUser(req, res, req.body, function (result) {
				if (!result.error) {

					// let emailText = `Caro(a) ${req.body.firstName} ${req.body.lastName}, estamos felizes em lhe informar que seu cadastro foi aceito. \n\n
					// 		Por favor leia a informação abaixo com atenção e certifique-se que estaja disponível para futuras referências. \n\n
					// 		Endereço: ${req.headers.origin} \n
					// 		Seu login: ${req.body.email} \n\n
					// 		Obrigado e Bem Vindo a W1Buy.com`;

					// // send the message and get a callback with an error or details of the message that was sent 
					// email.send({
					// 	text: emailText,
					// 	from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
					// 	to: '"' + req.body.firstName + ' ' + req.body.lastName + '" <' + req.body.email + '>',
					// 	subject: 'Seu cadastro no portal W1Buy'
					// 	// attachment: [{
					// 	// 	data: emailHtml,
					// 	// 	alternative: true
					// 	// }]
					// }, function (emailErr, message) {
					// 	console.log(emailErr || message);
					// });

					res.json({
						UserId: result.userid
					});
				} else {
					res.json({
						"error": result.error
					});
				}
			});
		});
	});
});

// Login process
// vscode-fold=8
router.post('/login', function (req, res, next) {
	passport.authenticate('local', function (error, user, info) {
		if (error) {
			return res.status(500).json(`${error}`);
		}
		if (!user) {
			return res.status(401).json(`${info.message}`);
		}
		req.logIn(user, function (err) {
			if (err) {
				if (err) {
					next();
					return res.status(500).json(err);
				}
			} else {
				if (req.body.remember_me == 'true') {
					let oneHour = 3600000;
					req.session.cookie.expires = new Date(Date.now() + oneHour);
					req.session.cookie.maxAge = oneHour;
				} else {
					req.session.cookie._expires = false;
				}
				res.redirect("/");
			}
		});

	})(req, res, next);
});

// Send user passoword process
// vscode-fold=9
router.get('/reset/:token', function (req, res) {
	let sqlInst = `select * from users where passwordresettoken = '${req.params.token}' and passwordresetexpiration <= '${(new Date().toISOString().slice(0, 19).replace('T', ' '))}'`;
	db.querySql(sqlInst, (data, err) => {
		if (err) {
			res.render('reset', {
				title: 'Recriar Senha',
				error: err.message,
				layout: 'neutral'
			});
		}
		let user = data.recordset[0];
		if (!user) {
			res.render('reset', {
				title: 'Recriar Senha',
				error: "O link para recriação de senha é inválido ou expirou.",
				layout: 'neutral'
			});
		} else {

			res.render('reset', {
				title: 'Recriar Senha',
				layout: 'neutral'
			});
		}
	});
});

router.post('/reset/:token', function (req, res) {
	async.waterfall([
		function (done) {
			let sqlInst = `select * from users where passwordresettoken = '${req.params.token}' and passwordresetexpiration <= '${(new Date().toISOString().slice(0, 19).replace('T', ' '))}'`;
			db.querySql(sqlInst, (data, err) => {
				if (err) {
					res.render('reset', {
						title: 'Nova Senha',
						layout: 'neutral',
						error: err.message
					});
				}
				let user = data.recordset[0];
				if (!user) {
					res.render('reset', {
						title: 'Nova Senha',
						layout: 'neutral',
						error: "O link para recriação de senha é inválido ou expirou."
					});
				} else {
					bcrypt.genSalt(10, function (err, salt) {
						bcrypt.hash(req.body.password, salt, function (err, hash) {
							if (err) {
								console.log(err);
							}
							req.body.password = hash;

							let sqlInst = `update users set passwordresettoken = null, passwordresetexpiration = null, hashed_password = '${req.body.password}' where userid = ${user.UserID};`;

							db.querySql(sqlInst, function (data, err) {
								if (err) {
									res.render('reset', {
										title: 'Nova Senha',
										layout: 'neutral',
										error: err.message
									});
								}

								req.logIn(user, function (err) {
									done(err, user);
								});
							});
						});
					});
				}
			});
		},
		function (user, done) {
			let emailText = `Caro(a) ${user.FirstName} ${user.LastName}, essa mensagem é de confirmação que sua senha foi alterada com sucesso. \n\n`;

			// send the message and get a callback with an error or details of the message that was sent 
			email.send({
				text: emailText,
				from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
				to: '"' + user.FirstName + ' ' + user.LastName + '" <' + user.email + '>',
				subject: 'Aletração de Senha na W1Buy'
			}, function (emailErr, message) {
				console.log(emailErr || message);
				done(emailErr, 'done');
			});
		}
	], function (err) {
		res.render('login', {
			title: 'Login',
			layout: 'neutral',
			success: "Sua senha foi alterada com sucesso",
			css: [
				'/css/login.css'
			],
			script: [
				'/css/login.js'
			]
		});
	});
});

// User Reset passoword proccess
router.post('/resetpassword', function (req, res, next) {
	async.waterfall([
		function (done) {
			crypto.randomBytes(20, function (err, buf) {
				let token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			db.querySql("select * from users where email = '" + req.body.email + "'", (data, err) => {
				if (err) {
					res.json({
						"error": err.message
					});
				}
				let user = data.recordset[0];
				if (!user) {
					res.json({
						"error": "Email não encontrado."
					});
				} else {

					let sqlInst = `update users set passwordresettoken = '${token}', passwordresetexpiration = dateadd(hour, 1,'${new Date().toISOString().slice(0, 19).replace('T', ' ')}') where userid = ${user.UserID};`;

					db.querySql(sqlInst, function (data, err) {
						if (err) {
							res.json({
								"error": err.message
							});
						}

						done(err, token, user);
					});
				}
			});
		},
		function (token, user, done) {
			let emailText = `Caro(a) ${user.FirstName} ${user.LastName}, está recebendo essa mensagem porque requisitou criar uma nova senha. \n\n
				Favor usar o link abaixo para completar a ação: \n\n
				http://${req.headers.origin}/reset/${token} \n\n
				Caso não tenha requisitado o reset de sua senha, favor ignorar essa mensagem. \n`;

			// send the message and get a callback with an error or details of the message that was sent 
			email.send({
				text: emailText,
				from: "Administrador - W1Buy <w1buy@w1buy.com.br>",
				to: '"' + user.FirstName + ' ' + user.LastName + '" <' + req.body.email + '>',
				subject: 'Resetar Senha W1Buy'
			}, function (emailErr, message) {
				console.log(emailErr || message);
				done(emailErr, 'done');
			});
		}
	], function (err) {
		if (err) {
			res.json({
				"error": err.message
			});
		}

		res.json({
			"success": "success"
		});
	});
});

// logout
// vscode-fold=10
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;