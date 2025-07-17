export type User = {
    id: number,
    username: string
}

const users:User[] = [{id:1, username:"clarks"}]

export const addUser=(user:User):boolean => {
    if (users.findIndex(elem => elem.id === user.id) === -1)
    {
        users.push(user)
        return true
    }
    return false
}

export const getAllUsers = () => [...users]

export const updateUser = (userId: number, newUserData:User):boolean => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index >-1){
        users[index] = { ...newUserData, id: userId };
        return true
    }
    return false
}

export const removeUser = (userId:number):User|null => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index >-1){
        const removedUser = users[index];
        users.splice(index, 1);
        return removedUser;
    }
    return null
}

export const getUser = (userId:number):User|null => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index >-1){
        return users[index];
    }
    return null
}