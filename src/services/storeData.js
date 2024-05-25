const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getAllData() {
  const db = new Firestore();
  const predictCollection = db.collection('predictions');
  const snapshot = await predictCollection.get();
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    history: doc.data()
  }));
  return data;
}

module.exports = { storeData, getAllData };
