const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const SCREEN_WIDTH = app.screen.width;
const SCREEN_HEIGHT = app.screen.height;
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let isFirst = true
let scoreTotal = 100;
let score = 0;
let demClick = 0;
let containerPrevious, valueCurrent, valueIndex;

// Crete a new textstyle
const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 26,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: ["#ffffff", "#00ff99"], // gradient
    stroke: "#4a1850",
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: "round",
});

//SCENCE 1
const scence1 = new PIXI.Container();
app.stage.addChild(scence1);
// Create score text
const scoreTotalText = new PIXI.Text("Số điểm hiện tại = " + scoreTotal, style)
scoreTotalText.x = SCREEN_WIDTH * 0.5;
scoreTotalText.y = SCREEN_HEIGHT * 0.5 - 100;
scoreTotalText.anchor.set(0.5)
scence1.addChild(scoreTotalText)

// Create container button start
const containerButton = new PIXI.Container();
containerButton.x = SCREEN_WIDTH * 0.5;
containerButton.y = SCREEN_HEIGHT * 0.5;
scence1.addChild(containerButton)

// Create button start
const buttonStart = new PIXI.Graphics()
buttonStart.lineStyle(1, 0xfeeb77, 1);
buttonStart.beginFill(0x650a);
buttonStart.drawRect(0, 0, 200, 50);
buttonStart.pivot.x = buttonStart.width * 0.5;
buttonStart.pivot.y = buttonStart.height * 0.5;
buttonStart.endFill();
containerButton.addChild(buttonStart)

// Create text start game
const txtStartGame = new PIXI.Text("Start game")
txtStartGame.anchor.set(0.5)
containerButton.addChild(txtStartGame);

// Event
containerButton.interactive = true;
containerButton.cursor = "pointer";
containerButton.on("pointerdown", () => {
    scence1.visible = false;
    scence2.visible = true;
    playGame();
});


//SCENCE 2
const scence2 = new PIXI.Container();
app.stage.addChild(scence2);
scence2.visible = false
// Create text score
const scoreText = new PIXI.Text("Score = " + score, style);
scoreText.x = 50;
scoreText.y = 50;
scence2.addChild(scoreText);

for (let i = 0; i < 20; i++) {
    let container = new PIXI.Container();
    container.width = 100;
    container.height = 100;
    container.x = 200 + (i % 5) * 100;
    container.y = 160 + Math.floor(i / 5) * 100;
    container.pivot.x = container._width * 0.5;
    container.pivot.y = container._height * 0.5;
    scence2.addChild(container);

    //tao 20 hinh value
    //new pixi sprite

    let img = PIXI.Sprite.from("examples/assets/" + data[i] + ".jpg");
    img.x = 100 * 0.5;
    img.y = 100 * 0.5;
    img.anchor.set(0.5);
    img.value = data[i];
    container.addChild(img);

    // Màu background
    let duplicate = new PIXI.Graphics();
    duplicate.lineStyle(1, 0xfeeb77, 1);
    duplicate.beginFill(0x650a);
    duplicate.drawRect(0, 0, 100, 100);
    duplicate.endFill();
    container.addChild(duplicate);

    // Chữ số
    let basicText = new PIXI.Text(i + 1, style);
    basicText.anchor.set(0.5);
    basicText.x = 100 * 0.5;
    basicText.y = 100 * 0.5;
    container.addChild(basicText);

    // Event
    container.interactive = true;
    container.cursor = "pointer";
    container.on("pointerdown", handleChooseImg);
}


//SCENCE 3
const scence3 = new PIXI.Container();
app.stage.addChild(scence3);
scence3.visible = false;

const victoryText = new PIXI.Text("CHÚC MỪNG BẠN ĐÃ THẮNG", style);
victoryText.x = SCREEN_WIDTH * 0.5;
victoryText.y = SCREEN_HEIGHT * 0.5 - 100;
victoryText.anchor.set(0.5)
scence3.addChild(victoryText);

const containerButtonBack = new PIXI.Container();
containerButtonBack.x = SCREEN_WIDTH * 0.5;
containerButtonBack.y = SCREEN_HEIGHT * 0.5;
scence3.addChild(containerButtonBack)

// Create button back
const buttonBack = new PIXI.Graphics()
buttonBack.lineStyle(1, 0xfeeb77, 1);
buttonBack.beginFill(0x650a);
buttonBack.drawRect(0, 0, 200, 50);
buttonBack.pivot.x = buttonBack.width * 0.5;
buttonBack.pivot.y = buttonBack.height * 0.5;
buttonBack.endFill();
containerButtonBack.addChild(buttonBack)

// Create text back game
const txtBackGame = new PIXI.Text("Quay lại")
txtBackGame.anchor.set(0.5)
containerButtonBack.addChild(txtBackGame);

containerButtonBack.interactive = true;
containerButtonBack.cursor = "pointer";
containerButtonBack.on("pointerdown", () => {
    scence3.visible = false;
    scence1.visible = true;
});

function playGame() {
    if(!isFirst) {
        score = 0;
        //Dau tien kiem tra da tao chua, neu chua thi tao, con tao roi thi for de bat

        const containerList = scence2.children;
        console.log(scoreText)
        const text = containerList[0]
        containerList.shift()
        shuffle(containerList)
        for (let i = 0; i < 20; i++) {

            containerList[i].visible = true
            containerList[i].children[1].visible = true
            containerList[i].children[2].visible = true
        }
        containerList.unshift(text);
    }
    isFirst = false
}

async function handleChooseImg(event) {
    if (demClick >= 2) return;
    demClick++;
    // [Sprite, _Graphics, _Text]
    const [img, graphics, text] = event.target.children;
    const containerCurrent = event.target;
    if (demClick === 1) {
        graphics.visible = false;
        text.visible = false;
        containerPrevious = event.target;
        valueCurrent = img.value;
        valueIndex = text._text;
        return;
    }
    if (demClick === 2) {
        graphics.visible = false;
        text.visible = false;
        await new Promise((res) => {
            if (img.value == valueCurrent && text._text != valueIndex) {
                setTimeout(() => {
                    containerCurrent.visible = false;
                    containerPrevious.visible = false;
                    scoreText.text = "Score = " + ++score;
                    if (score == 10) {
                        scoreTotal+=score
                        scoreTotalText.text = "Số điểm hiện tại = " + scoreTotal
                        scence2.visible = false;
                        scence3.visible = true;
                    }
                    res();
                }, 200);
            } else {
                setTimeout(() => {
                    graphics.visible = true;
                    text.visible = true;
                    containerPrevious.children[1].visible = true;
                    containerPrevious.children[2].visible = true;
                    res();
                }, 400);
            }
        });
        demClick = 0;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
