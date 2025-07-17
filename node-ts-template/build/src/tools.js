export const sayHi = (name) => {
    console.log(`Hello ${name}`);
};
export var actionName;
(function (actionName) {
    actionName["addUser"] = "addUser";
    actionName["removeUser"] = "removeUser";
    actionName["getAllUsers"] = "getAllUsers";
    actionName["updateUser"] = "updateUser";
    actionName["getUser"] = "getUser";
})(actionName || (actionName = {}));
export const LINKPATH = '/api/users/';
