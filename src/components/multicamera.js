// Set a global alias for the camera and related elements.
ui.camera = {
    viewer1: document.getElementById('camera'),
    button: "",
    id1: 0,
	srcs: [ // Will default to first camera
        'http://localhost:1181/?action=stream',
        'http://roborio-245-frc.local:1181/?action=stream',
        'http://localhost:1183/?action=stream'
    ]
};

// Unlike most addons, this addon doesn't interact with NetworkTables. Therefore, we won't need to add any NT listeners.

$(ui.camera.viewer1).html(`<div id="camera-bar"><p>Camera 1</p><button>Toggle</button></div>`);

// When camera is clicked on, change to the next source.
let cameraListener = () => {
    ui.camera.button = document.querySelector("#camera button");
    ui.camera.button.onclick = function() {
        ui.camera.id1 += 1;
        if (ui.camera.id1 === ui.camera.srcs.length) ui.camera.id1 = 0;
        ui.camera.viewer1.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id1] + ')';
        $(ui.camera.viewer1).html(`<div id="camera-bar"><p>Camera ${ui.camera.id1 + 1}</p><button>Toggle</button></div>`);
        ui.camera.button = document.querySelector("#camera button");
        cameraListener();
    };
}

setTimeout(cameraListener, 1000);


//Initialize cameras to correct initial streams:
ui.camera.viewer1.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id1] + ')';