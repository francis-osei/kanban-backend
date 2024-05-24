export const STATUS_RESPONSE = {
    SUCCESS: 'success',
    FAIL: 'fail',
    ERRROR: 'error',
};

export enum SUCCESS_CODE {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
}

export enum CLIENT_ERROR_CODE {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
}

export enum SERVER_ERROR_CODES {
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
}
