let loggedInUser = undefined;
const ws = new WebSocket("ws://192.168.187.2:9090");
const cm = CodeMirror(document.querySelector('#my-div'), {
    lineNumbers: true,
    tabSize: 2,
    value: 'console.log("Hello, World");',
    mode: 'javascript',
});

cm.on('change', syncCode);

ws.addEventListener("open", () => {
    console.log("We are connected");
});

ws.addEventListener('message', function (event) {
    if (cm.getValue() == event.data) return;
    cm.setValue(event.data);
    cm.setCursor({ line: 100, ch: 1 });
});

function auth() {
    const username = document.getElementById("username").value;
    if (undefined === username || null === username || username.length < 3) {
        alert('Invalid username');
        return;
    }
    else {
        sessionStorage.setItem('username', username);
        loggedInUser = username;
        document.getElementById("auth").style = "display:none";
        document.getElementById("userid").innerText = `Welcome ${username}`;
        return;
    }
}

function validateAuth(e) {
    const username = sessionStorage.getItem('username') || 'anonymous';

    if (undefined === username || null === username || username.length < 3) {
        document.getElementById("editor").style = "display:none";
        document.getElementById("auth").style = "display:block";
        return;
    }
}

function syncCode() {
    const username = sessionStorage.getItem('username');
    const snippet = cm.getValue();
    // console.log(cm);
    ws.send(JSON.stringify({
        user: username,
        snippet: snippet
    }));
}

function changeEditorLanguage(e) {
    cm.setOption('mode', e);
}
