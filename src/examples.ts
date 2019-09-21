import Model from './index';
import { AxiosResponse } from 'axios';

class User extends Model {
    constructor(attributes: Object = {}) {
        super(attributes);
        this._options.resourceName = 'users';
        this._options.routeKeyName = 'id';
        this._options.apiBaseUrl = '/';
        this._options.apiUrl = '/users';

        this.setOptions();
    }
}

async function findUser(id: string|number): Promise<AxiosResponse> {
    const user = new User();
    return await user.get(id);
};

async function createUser(attributes: Object): Promise<AxiosResponse> {
    const user = new User(attributes);
    return await user.save(); // or return await user.create();
};

async function updateUser(id: string|number, data: Object): Promise<AxiosResponse> {
    const user = new User({
        id,
        ...data
    });
    return await user.save(); // or return await user.update();
};

async function deleteUser(id: string|number): Promise<AxiosResponse> {
    return await new User({ id }).delete();
};

export default async function main() {
    const attributes = {
        name: 'Mauro',
        email: 'mauro@vlkstudio.com',
        password: 'K33pTh3S3cr3t'
    };
    console.log(`1 - Create a new user`);
    const userCreate = await createUser(attributes);
    console.log(userCreate.data);
    console.log(`2 - Updare the user`);
    const userUpdate = await updateUser(userCreate.data.id, { name: 'Mauro Erta' });
    console.log(userUpdate.data);
    console.log(`3 - Find the user`);
    const userFind = await findUser(userCreate.data.id);
    console.log(userFind.data);
    console.log(`4 - Delete the user`);
    const userDelete = await deleteUser(userCreate.data.id);
    console.log(userDelete.data);
}