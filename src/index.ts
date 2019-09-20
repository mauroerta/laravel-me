import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { csrf, objectToFormData, sanitizeUrl } from './helpers';

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
  _method?: RequestMethod;
  _token?: string;
  [key:string]: any;
}

export interface ModelFiles {
  [key:string]: File;
}

export type RequestMethod = 'get'|'post'|'put'|'delete'|'fetch';

export default class Model implements ModelData {
  _options: Partial<ModelOptions> = {
    resourceName: 'model',
    resourceKeyName: 'id',
    routeKeyName: 'slug',
    searchBaseUrl: '/',
    apiBaseUrl: '/',
    apiUrl: '/',
    url: ''
  };
  _files: ModelFiles;
  _method: RequestMethod = 'get';
  _token = null;
  _hideFields: string[] = ['_token', '_options', '_method', '_files', '_hideFields'];

  constructor(attributes: ModelData = {}) {
    const keys = Object.keys(attributes);
    for(const key of keys) {
      this[key] = attributes[key];
    }
    this._files = {};
    this.setOptions();
  }

  setOptions(): void {
    this._options.apiUrl = this._options.apiBaseUrl + this._options.resourceName;
    this._options.url = this._options.apiUrl + '/' + (this[this._options.routeKeyName] || '');
    this._options.searchBaseUrl = 'search/' + this._options.resourceName;
  }

  getHeaders(headers: AxiosRequestConfig['headers'] = {}): AxiosRequestConfig['headers'] {
    return {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': this._token || csrf(),
      ...headers
    }
  }

  serialize(): ModelData {
    let json = JSON.parse(JSON.stringify(this));
    const keys = this._hideFields;
    keys.forEach((key: string) => {
      delete json[key];
    });
    return json;
  }

  setFile(name:string = 'file', file: File): void {
    this._files[name] = file; 
  }

  getFile(name:string = 'file'): File|undefined {
    return this._files[name]; 
  }

  getFiles(): ModelFiles {
    return this._files;
  }

  async save(): Promise<AxiosResponse> {
    if(this[this._options.routeKeyName]) {
      return await this.update();
    } else {
      return await this.create();
    }
  }

  async create(): Promise<AxiosResponse> {
    const url = this._options.url;
    let data = this.serialize();
    data._method = 'post';
    return await this.call(url, data);
  }

  async update(): Promise<AxiosResponse> {
    const url = this._options.url;
    let data = this.serialize();
    data._method = 'put';
    return await this.call(url, data);
  }

  async delete(): Promise<AxiosResponse> {
    const url = this._options.url;
    let data = this.serialize();
    data._method = 'delete';
    return await this.call(url, data);
  }

  async addImage(image: File, is_picture = false): Promise<AxiosResponse> {
    const url = this._options.url + '/image';
    const data = {
      image: image,
      is_picture: is_picture
    };
    return await this.post(url, data);
  }

  async addFile(file: File, name = 'file', attributes: ModelData = {}): Promise<AxiosResponse> {
    const url = this._options.url;
    const data = attributes || {};
    data[name] = file;
    return await this.put(url, data);
  }

  async get(identifier: string): Promise<AxiosResponse> {
    return await this.call(this._options.apiUrl + '/' + identifier);
  }

  async post(url: string|null = null, data: ModelData = {}, headers: AxiosRequestConfig['headers'] = {}): Promise<AxiosResponse> {
    data._method = 'post';
    return await this.call(url, data, headers);
  }

  async put(url: string|null = null, data: ModelData = {}, headers: AxiosRequestConfig['headers'] = {}): Promise<AxiosResponse> {
    data._method = 'put';
    return await this.call(url, data, headers);
  }

  async search(text: string = '', filters: Object = {}): Promise<AxiosResponse> {
    const url = this._options.searchBaseUrl + '/' + text;
    return await this.call(url, filters);
  }

  async call(url: string|null = null, data: ModelData = null, headers: AxiosRequestConfig['headers'] = {}): Promise<AxiosResponse> {
    data = data || this.serialize();
    let method = data._method ? data._method.toLowerCase() : 'get';
    method = ['delete', 'put', 'post'].includes(method) ? 'post' : method;
    url = url || this._options.apiUrl;
    data._token = csrf();
    let formData = objectToFormData(data);
    const files = this.getFiles();
    const keys = Object.keys(files);
    for(const key of keys) {
      const file = files[key];
      formData.append(key, file);
    }
    
    return await axios[method](sanitizeUrl(url), formData, {
      headers: this.getHeaders(headers)
    });
  }
}
