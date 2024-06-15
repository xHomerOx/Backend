import winston from 'winston';

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'purple'
    }
};

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ 
            level: "debug", 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple()
            ) 
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: "debug",
            format: winston.format.simple()
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ 
            level: "info", 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevels.colors }),
                winston.format.simple()
            ) 
        }),
        new winston.transports.File({
            filename: './errors.log'
        })
    ]
});

export const addLogger = (req, _res, next) => {
    req.logger = devLogger;
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

export const startLogger = (message) => {
    devLogger.info(message);
}