export default class Result {
    constructor(result, error) {
        this.result = result;
        this.error = error;
    }
    success(fxn) {
        if (this.result !== null) {
            fxn(this.result);
            return new Result(this.result, null);
        } else {
            return new Result(null, this.error);
        }
    }
    failure(fxn) {
        if (this.error !== null) {
            fxn(this.error);
            return new Result(null, this.error);
        } else {
            return new Result(this.result, null);
        }
    }
}
