const AbstractClientStore = require('express-brute/lib/AbstractClientStore');
const moment = require('moment');

function FirestoreStore(instance, collection) {
  AbstractClientStore.apply(this, arguments);
  this.collection = collection || FirestoreStore.collection;

  if (!instance) {
    throw new ReferenceError('No firestore instance provided');
  }
  this.firestore = instance;
}

FirestoreStore.prototype.set = async function (key, value, lifetimeRaw, callback) {
  try {
    const lifetime = parseInt(lifetimeRaw, 10) || 0;
    const { firestore, options: { collection } } = this;

    await firestore.collection(collection).doc(key).set({
      count: value.count,
      firstRequest: value.firstRequest,
      lastRequest: value.lastRequest,
      expires: lifetime ? moment().add(lifetime, 'seconds').valueOf() : null,
    });
  } catch (error) {
    typeof callback === 'function' && callback(error);
  }
}

FirestoreStore.prototype.get = async function (key, callback) {
  try {
    const { firestore, options: { collection } } = this;

    const keyRef = firestore.collection(collection).doc(key);
    const snapshot = await keyRef.get();

    if (!snapshot.exists) {
      throw new ReferenceError('Key not on database!');
    }

    const value = snapshot.data();

    if (value.expires < moment().valueOf()) {
      await keyRef.delete()
    }

    typeof callback === 'function' && callback(null, value);
  } catch (error) {
    typeof callback === 'function' && callback(error);
  }
}

FirestoreStore.prototype.reset = async function (key, callback) {
  try {
    const { firestore, options: { collection } } = this;

    const keyRef = firestore.collection(collection).doc(key);
    const snapshot = await keyRef.get();

    if (!snapshot.exists) {
      throw new ReferenceError('Key not on database!');
    }

    const value = snapshot.data();

    await keyRef.delete();

    typeof callback === 'function' && callback(null, value);
  } catch (error) {
    typeof callback === 'function' && callback(error);
  }
}

FirestoreStore.collection = 'RATE_LIMITING';
