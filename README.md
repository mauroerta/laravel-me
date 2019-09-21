

# Laravel-Me

A Javascript (`Typescript`) package for make requests to laravel as simple as possible!

## ⚙️ Installation

Install the package by running 

```bash
npm install laravel-me
```

Use it by importing the package wherever your want:

```typescript
import Model from 'laravel-me';
```

## 🎓 How it works

Our advise it's to create a new class that extends the `Model` class, for example we can create a new `User` class to handle the [Laravel User Model](https://laravel.com/docs/6.x/eloquent).

```typescript
import Model from 'laravel-me';
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
```

Now we can make create, read, update, or delete (CRUD) requests:

```typescript
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
        email: 'mauro@email.com',
        password: 'K33pTh3S3cr3t'
    };
    console.log(`1 - Create a new user`);
    const userCreate = await createUser(attributes);
    console.log(userCreate.data);
    console.log(`2 - Update the user`);
    const userUpdate = await updateUser(userCreate.data.id, { name: 'Mauro Erta' });
    console.log(userUpdate.data);
    console.log(`3 - Find the user`);
    const userFind = await findUser(userCreate.data.id);
    console.log(userFind.data);
    console.log(`4 - Delete the user`);
    const userDelete = await deleteUser(userCreate.data.id);
    console.log(userDelete.data);
}
```

The log of this script will be something like:

```
1 - Create a new user 
{
  created_at: "2019-09-21 08:59:08"
  email: "mauro@vlkstudio.com"
  id: 9
  name: "Mauro"
  updated_at: "2019-09-21 08:59:08"
}
2 - Update the user
{
	created_at: "2019-09-21 08:59:08"
  email: "mauro@vlkstudio.com"
  email_verified_at: null
  id: 9
  name: "Mauro Erta"
  updated_at: "2019-09-21 08:59:08"
}
3 - Find the user
{
	created_at: "2019-09-21 08:59:08"
	email: "mauro@vlkstudio.com"
	email_verified_at: null
	id: 9
	name: "Mauro Erta"
	updated_at: "2019-09-21 08:59:08"
}
4 - Delete the user
{
	message: "User successfully deleted"
}
```