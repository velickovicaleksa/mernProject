async function connection(client, dataBaseName, collectionName) {
    try {
      if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
      }
      console.log("Connected to database");
      const db = client.db(dataBaseName);
      const collection = db.collection(collectionName);
      return  { collection };
    }
    catch(error) {
      console.log("Error connecting to database", error);
      throw error;
    }
  }

module.exports = { connection };