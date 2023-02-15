module.exports = () => {
  let streamList = [];

  let Stream = (id, name, userId, type) => {
    this.name = name;
    this.id = id;
    this.userId = userId;
    this.type = type;
  };

  return {
    addStream: (id, name, userId, type) => {
      let stream = new Stream(id, name, userId, type);
      streamList = streamList.filter(obj => obj.userId != userId);
      streamList.push(stream);
    },
    removeStream: (id) => {
      let index = 0;
      while (index < streamList.length && streamList[index].id != id) {
        index++;
      }
      streamList.splice(index, 1);
    },
    update: (id, name, userId, type) => {
      if (!type) return;

      streamList = streamList.filter(obj => obj.userId != userId);

      let stream = streamList.find(function(element, i, array) {
        return element.id == id;
      });
      if (stream) {
        stream.name = name ? name : null;
        stream.userId = userId ? userId : null;
        stream.type = type ? type : null;
      }
    },
    getStreams: () => {
      return streamList;
    }
  };
};
