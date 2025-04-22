const createMergeableStore = require("tinybase").createMergeableStore;
const createWsSynchronizer =
  require("tinybase/synchronizers/synchronizer-ws-client").createWsSynchronizer;
const createWsServer =
  require("tinybase/synchronizers/synchronizer-ws-server").createWsServer;
const createSqlite3Persister =
  require("tinybase/persisters/persister-sqlite3").createSqlite3Persister;
const WebSocketServer = require("ws").WebSocketServer;

const { Socket } = require("dgram");
const sqlite = require("sqlite3");

Database = sqlite.Database;

const db = new Database("tinybase.db");

SocketServer = new WebSocketServer({
  port: 8047,
});

SocketServer.on("connection", (ws) => {
  console.log("Client connected");
});

SocketServer.on("message", (message) => {
  console.log("message");
});

const server = createWsServer(SocketServer, (pathId) =>
  createSqlite3Persister(createMergeableStore(), db)
);
