let initialized = false;

window.addEventListener("_event_onInitializeFirebase", e => {
    if(!initialized) {
        firebase.initializeApp(e.detail.configuration);
        command();
        initialized = true;
    }
    firebase.auth().onAuthStateChanged(user => {
        e.detail.saveUser(user);
        if(user) {
            e.detail.onSignIn();
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

window.addEventListener("_event_onSignUp", e => {
    let promise = firebase.auth().createUserWithEmailAndPassword(e.detail.email, e.detail.password);
    promise.then( () => {
        e.detail.then();
        firebase.database().ref("userinfo/"+firebase.auth().currentUser.uid).set({
            name: e.detail.name,
            answered: [],
            points: 0
        });
    }).catch(e.detail.catch);
});

window.addEventListener("_event_onSignOut", e => {
    firebase.auth().signOut();
});

window.addEventListener("_event_onGetData", e => {
    firebase.database().ref(e.detail.reference).once("value", snap => {
        e.detail.callback(snap.val());
    });
});

window.addEventListener("_event_onSetListenerOnData", e => {
    let stop = false;
    firebase.database().ref(e.detail.reference).on("value", snap => {
        if(!stop && e.detail.callback(snap.val()))
            stop = true;
    });
});

window.addEventListener("_event_onSetData", e => {
    firebase.database().ref(e.detail.reference).set(e.detail.data);
});

window.addEventListener("_event_onPushData", e => {
    firebase.database().ref(e.detail.reference).push(e.detail.data);
});
