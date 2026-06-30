/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */

module.exports = {
    execute: function () {
        let ecosystem = require("./ecosystem.config.js");

        // 1. Buscamos una variable personalizada "APP_ENV" para decidir qué datos cargar.
        // Si no existe, usamos NODE_ENV, y si no, por defecto 'development'.
        let targetEnv = process.env.APP_ENV || process.env.NODE_ENV || "development";

        // Mapeamos 'staging' o 'development' a la key del ecosystem 'env_development'
        // Mapeamos 'production' a 'env_production'
        let ecosystemKey = (targetEnv === 'production') ? 'env_production' : 'env_development';

        console.log(`> Cargando variables desde ecosystem: [${ecosystemKey}] para el entorno real: [${process.env.NODE_ENV || 'Sin definir'}]`);

        let apps = ecosystem.apps;
        apps.map(function (app, i) {
            Object.keys(app).forEach(function (env, j) {
                // Solo cargamos las variables del bloque que coincide (env_development o env_production)
                if (env === ecosystemKey) {
                    Object.keys(app[env]).forEach(function (key, j) {
                        // Convertimos objetos a string (como GOOGLE, IMAGES, etc.)
                        if (typeof app[env][key] === "object") {
                            app[env][key] = JSON.stringify(app[env][key]);
                        }

                        // OJO: Inyectamos todas las variables EXCEPTO NODE_ENV
                        // No queremos sobreescribir NODE_ENV si ya está en 'production'
                        if (key !== 'NODE_ENV') {
                            process.env[key] = app[env][key];
                        }
                    });
                }
            });
        });

        // Aseguramos que, si estamos haciendo build, tengamos acceso a las variables
        // pero NO cambiamos NODE_ENV a 'development' si Next ya lo puso en 'production'.
    },
};