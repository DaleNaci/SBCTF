window.addEventListener("_event_onInitializeFirebase", e => {
    firebase.initializeApp(e.detail.configuration);
    command();
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            window.dispatchEvent(new CustomEvent("signedIn"));
        }
        else {
            window.dispatchEvent(new CustomEvent("signedOut"));
        }
    });
});

window.addEventListener("_event_onSignIn", e => {
    let promise = firebase.auth().signInWithEmailAndPassword(e.detail.email, e.detail.password);
    promise.then(e.detail.then).catch(e.detail.catch);
});

window.addEventListener("_event_onSignOut", e => {
    firebase.auth().signOut();
});
