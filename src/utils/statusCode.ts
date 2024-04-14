export enum SuccessCodes {
    ok = 200,
    created = 201,
    accepted = 202,
    noContent = 204,
}

export enum ClientErrorCodes {
    badRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
}

export enum ServerErrorCodes {
    internalServerError = 500,
    notImplemented = 501,
}
