const admin = require("firebase-admin");
const serviceAccount = require("../../zkcnt-firebase.json");

// Init Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Init Firebase Firestore
const firestore = admin.firestore()

exports.setUser = async (userId, userInfo) => {
    await firestore.collection("users").doc(userId).set({
        id: userInfo.data[0].id,
        name: userInfo.data[0].display_name,
        profileImg: userInfo.data[0].profile_image_url,
        accessToken: userInfo.accessToken,
        refreshToken: userInfo.refreshToken,
    })
}

exports.getAccessTokenById = async (id) => {
    return await firestore.collection("users").doc(id).get().then((data) => {
        if (data.exists) {
            return data.data().accessToken
        } else {
            return null
        }
    })
}

exports.getRefreshAccessTokenById = async (id) => {
    return await firestore.collection("users").doc(id).get().then((data) => {
        if (data.exists) {
            return data.data().refreshToken
        } else {
            return null
        }
    })
}

exports.updateNewToken = async (id, newAaccessToken, newRefreshToken) => {
    await firestore.collection("users").doc(id).update({
        accessToken: newAaccessToken,
        refreshToken: newRefreshToken,
    })
}

exports.getIsTodayTokenChecked = async (id) => {
    return new Promise(async (resolve, reject) => {
        await firestore.collection("users").doc(id).get().then((data) => {
            if (data.exists) {
                resolve(data.get("isTodayTokenChecked"))
            } else {
                reject(null)
            }
        })
    })
}

exports.updateIsTodayTokenChecked = async (id, datetime) => {
    await firestore.collection("users").doc(id).update({
        isTodayTokenChecked: datetime,
    })
}