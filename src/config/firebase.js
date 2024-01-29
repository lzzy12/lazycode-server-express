import admin from 'firebase-admin';
import serviceAccount from "../../serviceAccount.json" assert { type: "json" };;

export const initFirebase = () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
}
