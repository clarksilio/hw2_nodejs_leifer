const users = [{ id: 1, username: "clarks" }];
export const addUser = (user) => {
    if (users.findIndex(elem => elem.id === user.id) === -1) {
        users.push(user);
        return true;
    }
    return false;
};
export const getAllUsers = () => [...users];
export const updateUser = (userId, newUserData) => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index > -1) {
        users[index] = Object.assign(Object.assign({}, newUserData), { id: userId });
        return true;
    }
    return false;
};
export const removeUser = (userId) => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index > -1) {
        const removedUser = users[index];
        users.splice(index, 1);
        return removedUser;
    }
    return null;
};
export const getUser = (userId) => {
    const index = users.findIndex(elem => elem.id === userId);
    if (index > -1) {
        return users[index];
    }
    return null;
};
