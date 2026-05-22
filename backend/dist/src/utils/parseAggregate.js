"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNullableNumber = exports.toNumber = void 0;
const toNumber = (value, fallback = 0) => {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }
    return Number(value);
};
exports.toNumber = toNumber;
const toNullableNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return Number(value);
};
exports.toNullableNumber = toNullableNumber;
