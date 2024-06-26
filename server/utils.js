const { auth, db, storage} = require('./connections/firebase');
const {signInWithEmailAndPassword, createUserWithEmailAndPassword} = require('firebase/auth');
const {ref,get,set, child} = require('firebase/database');
// const { v4: uuidv4 } = require('uuid');
const { ref : storageRef, uploadBytes, getDownloadURL, listAll, updateMetadata } = require("firebase/storage");


exports.loginQuery = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth,email, password);
        console.log(result);
        if(result) {
            const dbRef = ref(db);
            const snapshot = await get(child(dbRef,`users/${result.user.uid}`));
            if(snapshot.exists()) {
                return {auth : true, response : snapshot.val()}
            } else {
                return {auth : false}
            }
           
        } else {
            return {auth : false}
        }
    } catch (err) {

        console.error("Error in Signin : ", err);
        return {auth : false}
    }
}

exports.signUpQuery = async (email,password, userData) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log(result);
        if(result) {
            console.log(result);

            
            const dbRef = ref(db);
            await set(child(dbRef,`users/${result.user.uid}`),{...userData, email,'uid':result.user.uid,'rideActive': false, 'balance': 0, 'buspass': {'exist': false, 'details': {'passID': "", 'passtype': "", 'validity': ""}}});

            return {auth : true, response : result}
        } else {
            return {auth : false}
        }
    } catch (err) {

        console.error("Error in Signin : ", err);
        return {auth : false}
    }
}

exports.uploadPfp = async(userID, fileItem, fileName) => {
    console.log(fileItem)

    try {
        const pfpRef = storageRef(storage, `images/pfp/${userID}/${fileName}`);
        const metadata = {
            contentType: 'image/png'
          };
        
        uploadBytes(pfpRef, fileItem, metadata).then(() => {
            const pfpFileRef = storageRef(storage, `images/pfp/${userID}/`)
            listAll(pfpFileRef).then((res) =>{
                res.items.forEach((item)=>{
                    getDownloadURL(item).then(async(url) => {
                        const dbRef = ref(db, `users/${userID}/pfp`);
                        await set(dbRef, url);
                    })
                })
            })
            
            return true
        }, (error)=>{
            console.log("Error in upload", error);
            return false;
        }
        )
        

    } catch(error){
        console.log(error)
    }

}

exports.getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }