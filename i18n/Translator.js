export default class Translator {
    language_code;
    data;
    constructor(language_code, data) {
        this.code = language_code;
        this.data = data;
    }
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