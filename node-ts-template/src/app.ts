import {actionName, LINKPATH, sayHi} from "./tools.ts";
import {EventEmitter} from "node:events";
import {createServer, IncomingMessage} from "node:http";
import {addUser, getAllUsers, getUser, removeUser, updateUser, User} from "./users.ts";
import { URL } from "url";

const myName = "Emil";
sayHi(myName);

const myEmitter = new EventEmitter()

//=====================Syntax==================
// myEmmiter.on("eventName", (value1, value2...) => {
//     console.log("my Event");
// })
// myEmmiter.emit('eventName', [value1, value2, value3]);

myEmitter.on("less_than_0.5", (val) => console.log(`${val} < 0.5`))
myEmitter.on("greater_than_0.5", (val) => console.log(`${val} > 0.5`))
myEmitter.on("equal_0.5", (val) => console.log(`${val} = 0.5`))

for (let i=0; i<10; i++) {
    let rand = Math.random();
    if (rand === 0.5) {
        myEmitter.emit("equal_0.5", rand)
    }
    else if (rand > 0.5) {
        myEmitter.emit("greater_than_0.5", rand)
    }
    else if (rand < 0.5) {
        myEmitter.emit("less_than_0.5", rand)
    }
}



const myServer = createServer(async (req, res) => {
    const {method} = req
    const cleanUrl = req.url?.split('?')[0];

    function parseBody(req: IncomingMessage) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on('data', (chunk) => {
                body += chunk.toString();
            })
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    reject(new Error("Invalid JSON"));
                }
            })
        })
    }

    switch (cleanUrl!+method) {
        case LINKPATH + actionName.addUser + "POST": {
            const body = await parseBody(req)
            if (body) {
                addUser(body as User)
                res.writeHead(201, {"Content-Type": "text/plain"})
                res.end("User was added")
            } else {
                res.writeHead(409, { "Content-Type": "text/plain" });
                res.end("User already exists");
            }
            break
        }

        case LINKPATH + actionName.updateUser + "POST": {
            const body = await parseBody(req)
            const user = body as User;
            if (user) {
                updateUser(user.id, body as User)
                res.writeHead(201, {"Content-Type": "text/plain"})
                res.end("User was updated")
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("There is no user with that id");
            }
                break
        }

        case LINKPATH + actionName.removeUser + "POST": {
            const body = await parseBody(req)
            const user = body as User;
            if (user) {
                removeUser(user.id)
                res.writeHead(200, {"Content-Type": "text/plain"})
                res.end("User was updated")
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("There is no user with that id");
            }
            break
        }
        case LINKPATH + actionName.getAllUsers + "GET": {
                res.writeHead(200, {"Content-Type": "application/json"})
                res.end(JSON.stringify(getAllUsers()))
            break
        }
        case LINKPATH + actionName.getUser + "GET": {
            const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
            const idParam = parsedUrl.searchParams.get("id");
            const userId = idParam ? Number(idParam) : NaN;

            if (!isNaN(userId)) {
                const user = getUser(userId);
                if (user) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(user));
                } else {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("User not found");
                }
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid or missing user ID");
            }

            break;
        }
        default:
            res.writeHead(404, {"Content-Type": "text/plain"})
            res.end("Not Found")
            break
    }

})

myServer.listen(3005, () => console.log("Server started at http://localhost:3005"))