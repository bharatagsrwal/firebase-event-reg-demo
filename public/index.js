var firebaseConfig = {
    apiKey: "XXXXXXXXXXXX",
    authDomain: "XXXXXXX.firebaseapp.com",
    databaseURL: "https://XXXXXXXX.firebaseio.com",
    projectId: "XXXXXX",
    storageBucket: "XXXXXXX.appspot.com",
    messagingSenderId: "XXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXXXXXXX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const authUser = document.getElementById('authUser');
const success = document.getElementById('success');
const noAuth = document.getElementById('notAuth');

authUser.style.display = "none";
success.style.display = "none";
noAuth.style.display = "block";


document.getElementById('googleAuth').addEventListener('click', () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        let uid = user.uid;
        let name = user.displayName;
        let email = user.email;
        authUser.style.display = "block";
        noAuth.style.display = "none";
        success.style.display = "none";
        authUser.innerHTML = `
            <img src="${user.photoURL}"><br>
            <input type="text" placeholder="Name" id="name" value="${name}" /><br>
            <input type="email" placeholder="Email" id="email" value="${email}" /><br>
            <button onclick="saveData('${uid}')">Save Data</button>
        `;
    }).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // The email of the user's account used.
        let email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;
        console.log(error);
        // ...
    });
});

const saveData = (uid) => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    if (name.length > 0 && email.length > 4) {
        const dbRef = firebase.firestore();
        dbRef.collection('users').doc(uid).set({
            "name": name,
            "email": email,
            "timeStamp": new Date()
        }).then(doc => {
            authUser.style.display = "none";
            success.style.display = "block";
            noAuth.style.display = "none";
            success.innerHTML = `
           <h1>Thanks ${name}(${email}) for Registration</h1>
           `;
        }).catch(e => {
            console.log(e);
        });
    }
}