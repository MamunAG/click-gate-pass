
export type IApiResponseType<T> = {
    IsError: boolean;
    Message: string;
    Errors: string[];
    Data: T;
};

