
export const sayHi = (name:string):void => {
    console.log(`Hello ${name}`)
}

export enum actionName {
    'addUser' = 'addUser',
    'removeUser' = 'removeUser',
    'getAllUsers' = 'getAllUsers',
    'updateUser' = 'updateUser',
    'getUser' = 'getUser',
}

export const LINKPATH = '/api/users/'