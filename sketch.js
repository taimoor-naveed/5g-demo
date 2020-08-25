let logoImage;
let roomImage;
let buildingGraphics;
let cpeLocation = 2;

let mouseLocation = {
    x: 0,
    y: 0
};

let easyCam;

let bsLocations = [];

let buildingWidth;
let buildingHeight;
let buildingLocation;

let antennaLocation;
let antennaHeight;
let antennaWidth;

let theta = 10;
let phi = 0;
let canvas;

function insertLogo() {
    const aspectRatio = logoImage.width / logoImage.height;
    const newWidth = width / 8;
    const newHeight = newWidth / aspectRatio;
    image(
        logoImage,
        (width * 3) / 4 - newWidth * 0.5,
        newHeight / 2,
        newWidth,
        newHeight
    );
}

function createBuildingGraphics() {
    buildingHeight = height / 2;
    buildingWidth = width / 2;
    buildingGraphics = createGraphics(buildingWidth, buildingHeight);
}
function createAntennaGraphics() {
    antennaLocation = {
        x: 0,
        y: height / 2
    };
    antennaHeight = height / 2;
    antennaWidth = width / 2;
    const antennaGraphics = createGraphics(antennaWidth, antennaHeight, WEBGL);

    easyCam = new Dw.EasyCam(antennaGraphics._renderer);
    easyCam.attachMouseListeners(this._renderer);
    easyCam.setViewport([
        antennaLocation.x,
        antennaLocation.y,
        antennaWidth,
        antennaHeight
    ]);
}

function drawBuilding() {
    buildingLocation = {
        x: width / 2,
        y: height / 2
    };

    buildingGraphics.background(255);

    buildingGraphics.noStroke();
    buildingGraphics.fill(128);

    buildingGraphics.rect(0, 0, buildingWidth / 4, buildingHeight);
    buildingGraphics.rect(
        (buildingWidth / 4) * 3,
        0,
        buildingWidth / 4,
        buildingHeight
    );

    const balconyRoomHeight = buildingHeight / 10;
    const balconyRoomWidth = ((buildingWidth / 4) * 2) / 4;
    const cpeWidth = balconyRoomWidth * 0.7;
    const cpeHeight = balconyRoomHeight * 0.7;
    for (let i = 0; i < 4; i++) {
        buildingGraphics.stroke(0);
        buildingGraphics.fill(255);
        buildingGraphics.rect(
            buildingWidth / 4 + i * balconyRoomWidth,
            buildingHeight - balconyRoomHeight,
            balconyRoomWidth,
            balconyRoomHeight
        );

        if (i == cpeLocation) {
            buildingGraphics.noStroke();
            buildingGraphics.fill(0, 128, 0);
            buildingGraphics.rect(
                buildingWidth / 4 +
                    i * balconyRoomWidth +
                    (balconyRoomWidth - cpeWidth) / 2,
                buildingHeight -
                    balconyRoomHeight +
                    (balconyRoomHeight - cpeHeight) / 2,
                cpeWidth,
                cpeHeight,
                min(cpeWidth, cpeHeight) * 0.2
            );
            buildingGraphics.stroke(255);
            buildingGraphics.fill(255);
            buildingGraphics.textAlign(CENTER, CENTER);
            buildingGraphics.text(
                'CPE',
                buildingWidth / 4 +
                    i * balconyRoomWidth +
                    (balconyRoomWidth - cpeWidth) / 2 +
                    cpeWidth / 2,
                buildingHeight -
                    balconyRoomHeight +
                    (balconyRoomHeight - cpeHeight) / 2 +
                    cpeHeight / 2
            );
        }
    }

    buildingGraphics.stroke(0, 128, 255);
    buildingGraphics.fill(0, 128, 255);
    buildingGraphics.rect(
        buildingWidth / 4,
        0,
        buildingWidth / 100,
        buildingHeight - balconyRoomHeight
    );

    buildingGraphics.rect(
        (buildingWidth / 4) * 3 - buildingWidth / 100,
        0,
        buildingWidth / 100,
        buildingHeight - balconyRoomHeight
    );

    buildingGraphics.noStroke();
    buildingGraphics.rect(
        buildingWidth / 4,
        buildingHeight - balconyRoomHeight * 2,
        (buildingWidth / 4) * 2,
        balconyRoomHeight
    );

    buildingGraphics.stroke(255);
    buildingGraphics.fill(255);
    buildingGraphics.textAlign(CENTER, CENTER);
    buildingGraphics.text(
        'Balcony',
        buildingWidth / 2,
        buildingHeight - balconyRoomHeight * 2 + balconyRoomHeight / 2
    );

    buildingGraphics.stroke(0);
    buildingGraphics.fill(0);
    buildingGraphics.text(
        'Roof Top',
        buildingWidth / 4 / 2,
        buildingHeight - balconyRoomHeight * 2 + balconyRoomHeight / 2
    );

    buildingGraphics.text(
        'Roof Top',
        (buildingWidth / 4) * 4 - buildingWidth / 4 / 2,
        buildingHeight - balconyRoomHeight * 2 + balconyRoomHeight / 2
    );

    bsLocations = [];
    bsLocations.push({
        x: (buildingWidth / 4) * 4 - buildingWidth / 8,
        y: (buildingHeight / 8) * 1,
        selected: false,
        scanAngles: {
            theta: -32,
            phi: 14
        },
        color: [255, 0, 0]
    });

    bsLocations.push({
        x: buildingWidth / 4 - buildingWidth / 8,
        y: (buildingHeight / 8) * 3,
        selected: false,
        scanAngles: {
            theta: 64,
            phi: -12
        },
        color: [255, 215, 0]
    });
    bsLocations.push({
        x: (buildingWidth / 4) * 4 - buildingWidth / 8,
        y: (buildingHeight / 8) * 4,
        selected: false,
        scanAngles: {
            theta: -54,
            phi: 16
        },
        color: [0, 0, 0]
    });

    theta = 0;
    phi = 0;

    for (let i = 0; i < bsLocations.length; i++) {
        buildingGraphics.stroke(0);
        buildingGraphics.fill(255);

        buildingGraphics.circle(
            bsLocations[i].x,
            bsLocations[i].y,
            buildingWidth / 4 / 5
        );

        const localMouseLocation = {
            x: mouseLocation.x - buildingLocation.x,
            y: mouseLocation.y - buildingLocation.y
        };

        if (
            dist(
                localMouseLocation.x,
                localMouseLocation.y,
                bsLocations[i].x,
                bsLocations[i].y
            ) <
            buildingWidth / 4 / 8
        ) {
            bsLocations[i].selected = true;
        }

        if (bsLocations[i].selected) {
            textSize(16);
            text(
                `Selected Location: ${i + 1}`,
                (width * 3) / 4,
                height / 2 - 15
            );
            theta = bsLocations[i].scanAngles.theta;
            phi = bsLocations[i].scanAngles.phi;

            buildingGraphics.fill(0);
            buildingGraphics.circle(
                bsLocations[i].x,
                bsLocations[i].y,
                buildingWidth / 4 / 8
            );

            beamStart = {
                x:
                    buildingWidth / 4 +
                    cpeLocation * balconyRoomWidth +
                    (balconyRoomWidth - cpeWidth) / 2 +
                    cpeWidth / 2,
                y:
                    buildingHeight -
                    balconyRoomHeight +
                    (balconyRoomHeight - cpeHeight) / 2
            };
            const midPoint = {
                x: (beamStart.x + bsLocations[i].x) / 2,
                y: (beamStart.y + bsLocations[i].y) / 2
            };

            const length = dist(
                beamStart.x,
                beamStart.y,
                bsLocations[i].x,
                bsLocations[i].y
            );

            const angle = atan2(
                beamStart.y - midPoint.y,
                beamStart.x - midPoint.x
            );
            buildingGraphics.push();
            buildingGraphics.translate(midPoint.x, midPoint.y);
            buildingGraphics.rotate(-(radians(90) - angle));
            buildingGraphics.noStroke();
            buildingGraphics.fill(
                bsLocations[i].color[0],
                bsLocations[i].color[1],
                bsLocations[i].color[2]
            );
            buildingGraphics.ellipse(0, 0, length * 0.05, length);
            buildingGraphics.pop();
        }
    }

    image(
        buildingGraphics,
        buildingLocation.x,
        buildingLocation.y,
        buildingWidth,
        buildingHeight
    );
}

function drawInfo() {
    const infoTableWidth = (width / 2) * 0.8;
    const infoTableHeight = (height / 2) * 0.8;

    strokeWeight(1);
    stroke(0);
    fill(255);
    rect(
        (width / 2 - infoTableWidth) / 2,
        (height / 2 - infoTableHeight) / 2,
        infoTableWidth,
        infoTableHeight
    );

    line(
        (width / 2 - infoTableWidth) / 2 + infoTableWidth / 2,
        (height / 2 - infoTableHeight) / 2,
        (width / 2 - infoTableWidth) / 2 + infoTableWidth / 2,
        (height / 2 - infoTableHeight) / 2 + infoTableHeight
    );

    fill(0);

    const labelTexts = ['Power Consumption', 'Theta', 'Phi'];
    const values = [
        `${(3.14 + random(-0.03, 0.03)).toFixed(2)}W`,
        `${theta}°`,
        `${phi}°`
    ];
    for (let i = 0; i < 3; i++) {
        line(
            (width / 2 - infoTableWidth) / 2,
            (height / 2 - infoTableHeight) / 2 + (i * infoTableHeight) / 3,
            (width / 2 - infoTableWidth) / 2 + infoTableWidth,
            (height / 2 - infoTableHeight) / 2 + (i * infoTableHeight) / 3
        );
        textAlign(CENTER, CENTER);
        textSize(23);
        text(
            labelTexts[i],
            (width / 2 - infoTableWidth) / 2 + infoTableWidth / 4,
            (height / 2 - infoTableHeight) / 2 +
                (i * infoTableHeight) / 3 +
                infoTableHeight / 6
        );

        text(
            values[i],
            (width / 2 - infoTableWidth) / 2 + (infoTableWidth / 4) * 3,
            (height / 2 - infoTableHeight) / 2 +
                (i * infoTableHeight) / 3 +
                infoTableHeight / 6
        );
    }
    stroke(0);
    fill(0);
    textSize(50);
    text('ALCAN 5G FWA Demo', (width * 23.5) / 32, (height * 2.5) / 8);
}

function drawAntenna() {
    const antennaGraphics = easyCam.graphics;

    antennaGraphics.clear();
    // antennaGraphics.background(0);

    antennaGraphics.strokeWeight(5);

    {
        antennaGraphics.stroke(128);
        antennaGraphics.line(-500, 0, 0, 500, 0, 0);
        antennaGraphics.line(0, -500, 0, 0, 500, 0);
    }

    {
        antennaGraphics.push();
        antennaGraphics.stroke(0);
        antennaGraphics.fill(0, 255, 0);
        antennaGraphics.translate(0, 0, -15);
        antennaGraphics.box(150, 150, 30);
        antennaGraphics.pop();
    }
    antennaGraphics.strokeWeight(1);
    antennaGraphics.stroke(128, 128, 128);
    antennaGraphics.fill(128, 128, 128);
    antennaGraphics.push();
    antennaGraphics.rotateZ(radians(90 + phi));
    antennaGraphics.rotateX(radians(theta));
    antennaGraphics.translate(0, 0, 100);
    antennaGraphics.ellipsoid(10, 10, 100);
    antennaGraphics.pop();

    const vp = easyCam.getViewport();
    image(roomImage, vp[0], vp[1], vp[2], vp[3]);
    image(easyCam.graphics, vp[0], vp[1], vp[2], vp[3]);
}

let element;
var clientX, clientY;
function setup() {
    canvas = createCanvas(1194, 700);
    canvas.mousePressed(mouseHandler);
    logoImage = loadImage('alcan-logo.png');
    roomImage = loadImage('empty-room-source-file.jpg');
    createBuildingGraphics();
    createAntennaGraphics();
    element = document.getElementById('defaultCanvas0');
    element.addEventListener(
        'touchstart',
        function (e) {
            if (
                e.touches[0].clientX > buildingLocation.x &&
                e.touches[0].clientX < buildingLocation.x + buildingWidth &&
                e.touches[0].clientY > buildingLocation.y &&
                e.touches[0].clientY < buildingLocation.y + buildingHeight
            ) {
                mouseLocation.x = e.touches[0].clientX;
                mouseLocation.y = e.touches[0].clientY;
            }
        },
        false
    );
}

function draw() {
    background(192);
    insertLogo();
    drawBuilding();
    drawAntenna();
    drawInfo();
}

function mouseHandler() {
    if (
        mouseX > buildingLocation.x &&
        mouseX < buildingLocation.x + buildingWidth &&
        mouseY > buildingLocation.y &&
        mouseY < buildingLocation.y + buildingHeight
    ) {
        mouseLocation.x = mouseX;
        mouseLocation.y = mouseY;
    }
}
