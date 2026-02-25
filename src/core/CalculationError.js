/**
 * Error while trying to combine ingredients
 * 
 * @extends Error
 */
export class CalculationError extends Error {
	code;
	message;
	constructor(code, data) {
		super();
		this.code = code || 'UNKNOWN';
		this.message = {
            code: 'ERROR_' + this.code,
            data: {
                info: (typeof data != 'undefined') ? JSON.stringify(data) : ''
            }
        };
	}
}