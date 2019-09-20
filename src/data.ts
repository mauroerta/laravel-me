export interface ModelOptions {
    resourceName: string;
    resourceKeyName: string;
    routeKeyName: string;
    searchBaseUrl: string;
    apiBaseUrl: string;
    apiUrl: string;
    url: string;
}

export interface ModelData {
    _method?: ModelRequestMethod;
    _token?: string;
    [key:string]: any;
}

export interface ModelFiles {
    [key:string]: File;
}

export type ModelRequestMethod = 'get'|'post'|'put'|'delete'|'fetch';