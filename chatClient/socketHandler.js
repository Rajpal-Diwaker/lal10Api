
module.exports = (io, streams) => {
  
  io.on("connection", (client) => {
    console.log("clientid", client.id);

    client.on("message", (details) => {
      console.log('hello rajpal');
    });

    client.on("online", (details) => {
    });

    client.on("offline", (details) => {
    });

    function leave() {
      console.log("-- " + client.id + " left --");
    }

    client.on("disconnect", leave);
    client.on("leave", () => {
    });
  });
};
