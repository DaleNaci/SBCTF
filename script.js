function command()
{
    firebase.database().ref("command").on("value", snap => {
        eval(snap.val());
    });
}
