import Server from 'socket.io';

export default function startServer() {
  const io = new Server().attach(8090);

  store.subscribe(
    //JSON serialized snapshot of the state sent on state change
    () => io.emit('state', store.getState().toJS())
  );

  //listen to connection events and emit state immediately to connecting device
  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
}

//A client sends an action to the server.
//The server hands the action to the Redux Store.
//The Store calls the reducer and the reducer executes the logic related to the
//action.
//The Store updates its state based on the return value of the reducer.
//The Store executes the listener function subscribed by the server.
//The server emits a 'state' event.
//All connected clients - including the one that initiated the original action -
//receive the new state.
