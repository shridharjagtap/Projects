import firebase from './firebase/firebase'
import "firebase/database";

const db = firebase.database().ref('/itemlist');

export const firebaseDB = firebase

class itemListDataService {

    getAll(){
        return db;
    }

    create(itemInfo) {
        return db.push(itemInfo);
    }
    
    update(key, value) {
        return db.child(key).update(value);
    }
    
    delete(key) {
        return db.child(key).remove();
    }
    
    deleteAll() {
        return db.remove();
    }
}
export default new itemListDataService()