/**
 * Class that can translate Translatable objects
 */
class Translator {
    language_code;
    data;
    /**
     * @constructor
     * 
     * @param {string} language_code - "en"
     * @param {LanguagePack} data
     */
    constructor(language_code, data) {
        this.code = language_code;
        this.data = data;
    }
    
    /**
     * Transforms translatable string to Translator language
     * Replaces {tags} with corresponding data values
     * 
     * @param {Translatable} obj 
     * @returns {string}
     */
    translate(obj) {
        if (typeof obj != 'object')
            obj = { code: obj };
        if (typeof obj.data != 'object')
            obj.data = { value: obj.data || '' };
        let result = this.data[obj.code] || obj.code;
        for (let k in obj.data)
            result = result.replace('{'+k+'}', obj.data[k]);
        return result;
    }
}

/**
 * @typedef {(string|TranslatableObject|TranslatableObjectFull)} Translatable
 */
/**
 * @typedef {Object} TranslatableObject
 * @property {string} TranslatableObject.code - code from language pack
 * @property {string} TranslatableObject.data - data for default {value} tag
 */
/**
 * @typedef {Object} TranslatableObjectFull
 * @property {string} TranslatableObjectFull.code - code from language pack
 * @property {Object.<string, any>} TranslatableObjectFull.data - any data
 */
/**
 * @typedef {Map<code, template>} LanguagePack
 */

export { Translator };