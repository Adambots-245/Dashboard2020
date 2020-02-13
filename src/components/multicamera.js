// Set a global alias for the camera and related elements.
ui.camera = {
    viewer1: document.getElementById('camera'),
    viewer2: document.getElementById('camera2'),
    id1: 0,
    id2: 1,
	srcs: [ // Will default to first camera
        'http://localhost:1181/?action=stream',
        'http://roborio-245-frc.local:1181/?action=stream',
        'http://localhost:1183/?action=stream'
    ]
};

// Unlike most addons, this addon doesn't interact with NetworkTables. Therefore, we won't need to add any NT listeners.

// When camera is clicked on, change to the next source.
ui.camera.viewer1.onclick = function() {
    ui.camera.id1 += 1;
	if (ui.camera.id1 === ui.camera.srcs.length) ui.camera.id1 = 0;
	ui.camera.viewer1.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id1] + ')';
};

ui.camera.viewer2.onclick = function() {
    ui.camera.id2 += 1;
	if (ui.camera.id2 === ui.camera.srcs.length) ui.camera.id2 = 0;
	ui.camera.viewer2.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id2] + ')';
};

//Initialize cameras to correct initial streams:
ui.camera.viewer1.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id1] + ')';
ui.camera.viewer2.style.backgroundImage = 'url(' + ui.camera.srcs[ui.camera.id2] + ')';