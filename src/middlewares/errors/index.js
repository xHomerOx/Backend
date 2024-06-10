import EErrors from "../../services/errors/enums.js";

export default (error, _req, res, _next) => {
    console.log(error.cause);
    switch(error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            res.send({ status: "error", error: error.name });
            break;
        default:
            res.send({ status: "error", error: "Unhandled Error" });
    }
}