export default class Toolbox {
    static randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static randomIntBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloatPrecision(max, precision = 1) {
        const MULTIPLIER = Math.pow(10, Math.floor(precision));

        return Math.round((Math.random() * max) * MULTIPLIER) / MULTIPLIER;
    }

    static randomFloatPrecisionBetween(min, max, precision = 1) {
        const MULTIPLIER = Math.pow(10, Math.floor(precision));

        return Math.round(((Math.random() * (max - min)) + min) * MULTIPLIER) / MULTIPLIER;
    }
}