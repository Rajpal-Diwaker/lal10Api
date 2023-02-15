class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, room) {
        const user = { id, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        const user = this.getSocketId(id);
        if (user) {
            this.users = this.users.filter((user) => user.id != id);
        }
        return user;
    }

    getUser(room_id) {
        console.log("room_id",room_id)
        console.log("this.users",this.users)
        return this.users.filter((user) => user.room == room_id)[0];
    }

    getSocketId(id) {
        return this.users.filter((user) => user.id == id)[0];
    }

    getUserId(socketId) {
        return this.users.filter((user) => user.id == socketId)[0];
    }
}

module.exports = { Users };