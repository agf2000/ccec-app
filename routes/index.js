const express = require('express');
const bcrypt = require('bcryptjs');
const db = require("../core/db");
const passport = require('passport');
const peopleController = require("../controllers/peopleController.js");
const ensureAuthenticated = require('../process/js/ensureAuthenticated');
const router = express.Router();

/* GET home page. */
// vscode-fold=1
router.get('/', ensureAuthenticated, function (req, res, next) {
	res.render('index', {
		title: 'Colégio CEC :: App Comunicações',
		pageHeader: 'Colégio CEC',
		pageDesc: 'Aplicativo de Comunicações',
		user: req.user
	});
});

// Login Form
// vscode-fold=2
router.get('/login', function (req, res) {
	res.render('login', {
		title: 'CCEC :: Login',
		layout: false,
		script: [
			'/js/pages/login.js'
		]
	});
});

// Registration Form
// vscode-fold=3
router.get('/cadastro', ensureAuthenticated, function (req, res) {
	res.render('register', {
		title: 'Cadastro de Usuários',
		pageHeader: 'Cadastro de Usuários',
		pageDesc: 'Para colaboradores e administradores',
		script: [
			'/js/pages/register.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// User registration proccess
// vscode-fold=4
router.post('/register', function (req, res, next) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(req.body.password, salt, function (err, hash) {
			if (err) {
				console.log(err);
			}
			req.body.password = hash;

			peopleController.addUser(req, res, req.body, function (result) {
				if (!result.error) {

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
// vscode-fold=5
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

// User profile
// vscode-fold=6
router.get('/perfil', ensureAuthenticated, function (req, res, next) {
	res.render('profile', {
		title: 'Perfil',
		pageHeader: 'Perfil',
		pageDesc: 'Dados pessoais',
		css: [
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css'
		],
		script: [
			'/js/pages/profile.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/bootstrap-validator/js/validator.min.js'
			// '/lib/select2-bootstrap-theme/css/select2-bootstrap.min.css',
		]
	});
});

// Email provider specs
// vscode-fold=7
router.get('/provedor', ensureAuthenticated, function (req, res, next) {
	res.render('emailProvider', {
		title: 'Provedor de Email',
		pageHeader: 'Provedor de Email',
		pageDesc: 'Configurações de envio de email',
		css: [
			'/lib/sweetalert2/css/sweetalert2.min.css'
		],
		script: [
			'/js/pages/emailProvider.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// Recipients
// vscode-fold=8
router.get('/destinatarios', ensureAuthenticated, function (req, res) {
	res.render('recipients', {
		title: 'Cadastro de Destinatários',
		pageHeader: 'Cadastro de Destinatários',
		pageDesc: 'Para correspondências via emails',
		css: [
			'/css/pages/recipients.css',
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css',
			'/lib/jsgrid/css/jsgrid.min.css',
			'/lib/jsgrid/css/jsgrid-theme.min.css',
			'/lib/jquery-ui/css/jquery-ui.min.css',
			'/lib/jquery-ui/css/jquery-ui.theme.min.css'
		],
		script: [
			'/js/pages/recipients.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/jsgrid/js/jsgrid.min.js',
			'/lib/jsgrid/i18n/jsgrid-pt-br.js',
			'/lib/hotkeys-js/js/hotkeys.min.js',
			'/lib/jquery.scrollto/js/jquery.scrollTo.min.js',
			'/lib/jquery.maskedinput/js/jquery.maskedinput.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// Email provider specs
// vscode-fold=9
router.get('/patrocinadores', ensureAuthenticated, function (req, res, next) {
	res.render('sponsors', {
		title: 'Patrocinadores',
		pageHeader: 'Patrocinadores',
		pageDesc: 'Lista de patrocinadores',
		css: [
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css',
			'/lib/jsgrid/css/jsgrid.min.css',
			'/lib/jsgrid/css/jsgrid-theme.min.css',
			'/lib/pikaday/css/pikaday.css'
		],
		script: [
			'/js/pages/sponsors.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/jsgrid/js/jsgrid.min.js',
			'/lib/jsgrid/i18n/jsgrid-pt-br.js',
			'/lib/pikaday/js/pikaday.js',
			'/lib/hotkeys-js/js/hotkeys.min.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// Templates
// vscode-fold=10
router.get('/templates', ensureAuthenticated, function (req, res) {
	res.render('templates', {
		title: 'Templates',
		pageHeader: 'Templates',
		pageDesc: 'Conteúdos para envio',
		css: [
			'/css/pages/templates.css',
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css'
		],
		script: [
			'/js/pages/templates.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/ckeditor/ckeditor.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// Emails
// vscode-fold=11
router.get('/enviar', ensureAuthenticated, function (req, res) {
	res.render('send', {
		title: 'Colégio CEC :: Comunicações',
		pageHeader: 'Comunicações',
		pageDesc: 'Envio de Correspondência',
		css: [
			'/css/pages/send.css',
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css'
		],
		script: [
			'/js/pages/send.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/ckeditor/ckeditor.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// Emails history
// vscode-fold=12
router.get('/historico', ensureAuthenticated, function (req, res) {
	res.render('history', {
		title: 'Histórico',
		pageHeader: 'Histórico detalhado',
		pageDesc: 'Envio de Correspondência',
		css: [
			'/css/pages/history.css',
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css',
			'/lib/jsgrid/css/jsgrid.min.css',
			'/lib/jsgrid/css/jsgrid-theme.min.css'
		],
		script: [
			'/js/pages/history.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/jsgrid/js/jsgrid.min.js',
			'/lib/jsgrid/i18n/jsgrid-pt-br.js'
		]
	});
});

// Emails history
// vscode-fold=12
router.get('/arquivos', ensureAuthenticated, function (req, res) {
	res.render('xplorer', {
		title: 'Arquivos',
		pageHeader: 'Arquivos',
		pageDesc: 'Gerenciador de Anexos',
		css: [
			'/css/pages/xplorer.css',
			'/lib/select2/css/select2.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css',
			'/lib/jsgrid/css/jsgrid.min.css',
			'/lib/jsgrid/css/jsgrid-theme.min.css'
		],
		script: [
			'/js/pages/xplorer.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/jsgrid/js/jsgrid.min.js',
			'/lib/jsgrid/i18n/jsgrid-pt-br.js'
		]
	});
});

// Users management
// vscode-fold=13
router.get('/usuarios', ensureAuthenticated, function (req, res) {
	res.render('users', {
		title: 'Usuários',
		pageHeader: 'Usuários',
		pageDesc: 'Gerenciador',
		css: [
			'/css/pages/users.css',
			'/lib/select2/css/select2.min.css',
			'/lib/jsgrid/css/jsgrid.min.css',
			'/lib/jsgrid/css/jsgrid-theme.min.css',
			'/lib/sweetalert2/css/sweetalert2.min.css'
		],
		script: [
			'/js/pages/users.js',
			'/lib/select2/js/select2.full.min.js',
			'/lib/select2/i18n/pt-BR.js',
			'/lib/jsgrid/js/jsgrid.min.js',
			'/lib/jsgrid/i18n/jsgrid-pt-br.js',
			'/lib/sweetalert2/js/sweetalert2.min.js',
			'/lib/bootstrap-validator/js/validator.min.js'
		]
	});
});

// User alter passoword
// vscode-fold=14
router.put('/alterPassword', ensureAuthenticated, function (req, res, next) {
	db.querySql("select * from users where userid = '" + req.body.userId + "'", (data, err) => {
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
		bcrypt.compare(req.body.password, user.hashed_password, function (err, isMatch) {
			if (err) throw err;
			if (isMatch) {
				bcrypt.genSalt(10, function (err, salt) {
					bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
						if (err) {
							console.log(err);
						}

						peopleController.updatePassword(req, res, req.body.userId, hash);
					});
				});
			} else {
				res.status(200).json({
					"error": 'Senha atual incorreto.'
				});
			}
		});
	});
});

// logout
// vscode-fold=14
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;