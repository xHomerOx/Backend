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
}

const devLogger = winston.createLogger({
    levels: customLevels,
})