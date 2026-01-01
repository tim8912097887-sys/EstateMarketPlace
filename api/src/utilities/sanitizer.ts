import validator from "validator";

/** 
 * Remove XSS-related characters without HTML encoding them
 * Useful for field like username,slugs
 * */ 
const DANGEROUS_CHARS = "<>&'\"`\\/";

export const sanitizer = (val: string) => {
    return validator.blacklist(val,DANGEROUS_CHARS);
}