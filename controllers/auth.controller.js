const bcrypt = require('bcrypt');
const tokens = require('../services/jwt.services');

const { user } = require('../models/user.model');

exports.login = (req, resp) => {
    let params = req.body;
    if (params.email && params.password) {
        user.findOne({ email: params.email }, (err, response) => {
            if (err) {
                resp.status(500).json({
                    error: true,
                    description: 'Error interno del servidor'
                });
            }
            if (response) {
                bcrypt.compare(params.password, response.password).then((res) => {
                    if (res) {
                        response.password = ":)";
                        resp.json({
                            error: false,
                            user: response,
                            token: tokens.generateToken(response)
                        });
                    } else {
                        resp.json({
                            error: true,
                            description: "Contraseña incorrecta"
                        });
                    }
                });

            } else {
                resp.json({
                    error: true,
                    description: "Usuario no registrado"
                });
            }
        });
    } else {
        resp.status(400).json({
            error: true,
            description: 'Datos incorrectos'
        });

    }
};

exports.register = (req, resp) => {
    let params = req.body;

    if (params.email && params.name && params.password) {
        user.findOne({ email: params.email }, (err, response) => {
            if (err) {
                resp.status(500).json({
                    error: true,
                    description: 'Error interno del servidor'
                });
            } else if (response != null) {
                if (response.email) {
                    resp.status(200).json({
                        error: true,
                        description: `El correo ${params.email} ya está registrado`
                    });
                } else {
                    let newUser = user({
                        name: params.name,
                        email: params.email,
                        password: params.password,
                        img: params.img
                    });

                    newUser.save((err) => {
                        if (err) {
                            resp.status(500).json({
                                error: true,
                                description: 'Error interno del servidor'
                            });
                        } else {
                            newUser.password = ':(';
                            resp.status(200).json({
                                error: false,
                                user: newUser
                            });
                        }
                    });
                }

            } else {
                bcrypt.hash(params.password, parseInt(process.env.SALTROUNDS), function(err, hash) {
                    if (!err) {
                        let newUser = user({
                            name: params.name,
                            email: params.email,
                            password: hash,
                            img: params.img
                        });

                        newUser.save((err) => {
                            if (err) {
                                resp.status(500).json({
                                    error: true,
                                    description: 'Error interno del servidor'
                                });
                            } else {
                                newUser.password = ':(';
                                resp.status(200).json({
                                    error: false,
                                    user: newUser,
                                    token: tokens.generateToken(newUser)
                                });
                            }
                        });
                    } else {
                        console.log(err);
                        resp.status(500).json({
                            error: true,
                            description: err
                        });
                    }
                });
            }
        });
    } else {
        resp.status(400).json({
            error: true,
            description: 'Datos incorrectos'
        });

    }
};