//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
const app = new PIXI.Application({
    width: 800,
    height: 600,
    // backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);
const SCREEN_WIDTH = app.screen.width;
const SCREEN_HEIGHT = app.screen.height;
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// shuffle(data);
let isFirst = true;
let scoreTotal = 100;
let score = 0;
let demClick = 0;
let containerPrevious, valueCurrent, valueIndex;
let containerCurrentTmp, containerPreviousTmp;

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

const background = PIXI.Sprite.from("examples/assets/Game_Background_142.png");
app.stage.addChild(background);
//SCENCE 1
const scence1 = new PIXI.Container();
app.stage.addChild(scence1);
// Create score text
const scoreTotalText = new PIXI.Text("Số điểm hiện tại = " + scoreTotal, style);
scoreTotalText.x = SCREEN_WIDTH * 0.5;
scoreTotalText.y = SCREEN_HEIGHT * 0.5 - 100;
scoreTotalText.anchor.set(0.5);
scence1.addChild(scoreTotalText);

// Create container button start
const containerButton = new PIXI.Container();
containerButton.x = SCREEN_WIDTH * 0.5;
containerButton.y = SCREEN_HEIGHT * 0.5;
scence1.addChild(containerButton);

// Create button start
const buttonStart = PIXI.Sprite.from("examples/assets/blank-button-png-26.png");
buttonStart.anchor.set(0.5);
containerButton.addChild(buttonStart);

// Create text start game
const txtStartGame = new PIXI.Text("Start Game");
txtStartGame.anchor.set(0.5);
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
scence2.visible = false;
// Create text score
const scoreText = new PIXI.Text("Score = " + score, style);
scoreText.x = 50;
scoreText.y = 50;
scence2.addChild(scoreText);

for (let i = 19; i >= 0; i--) {
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
victoryText.anchor.set(0.5);
scence3.addChild(victoryText);
// Create container play again
const containerButtonPlayAgain = new PIXI.Container();
containerButtonPlayAgain.x = SCREEN_WIDTH * 0.5;
containerButtonPlayAgain.y = SCREEN_HEIGHT * 0.5;
scence3.addChild(containerButtonPlayAgain);

// Create button play again
const buttonPlayAgain = PIXI.Sprite.from(
    "examples/assets/blank-button-png-26.png"
);
buttonPlayAgain.anchor.set(0.5);
containerButtonPlayAgain.addChild(buttonPlayAgain);

// Create text play again
const txtPlayAgain = new PIXI.Text("Chơi lại");
txtPlayAgain.anchor.set(0.5);
containerButtonPlayAgain.addChild(txtPlayAgain);

containerButtonPlayAgain.interactive = true;
containerButtonPlayAgain.cursor = "pointer";
containerButtonPlayAgain.on("pointerdown", () => {
    scence3.visible = false;
    scence2.visible = true;
    playGame();
});

// Create container back
const containerButtonBack = new PIXI.Container();
containerButtonBack.x = SCREEN_WIDTH * 0.5;
containerButtonBack.y = SCREEN_HEIGHT * 0.5 + 80;
scence3.addChild(containerButtonBack);

// Create button back
const buttonBack = PIXI.Sprite.from("examples/assets/blank-button-png-26.png");
buttonBack.anchor.set(0.5);
containerButtonBack.addChild(buttonBack);

// Create text back game
const txtBackGame = new PIXI.Text("Quay lại");
txtBackGame.anchor.set(0.5);
containerButtonBack.addChild(txtBackGame);

containerButtonBack.interactive = true;
containerButtonBack.cursor = "pointer";
containerButtonBack.on("pointerdown", () => {
    scence3.visible = false;
    scence1.visible = true;
});

async function playGame() {
    const centerX = SCREEN_WIDTH * 0.5;
    const centerY = SCREEN_HEIGHT * 0.5;
    score = 0;
    const text = scence2.children[0];
    text.text = "Score = " + score;
    scence2.children.shift();
    // const index = [19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]

    if (!isFirst) {
        shuffle(data);
        for (let i = 19; i >= 0; i--) {
            // [Sprite, _Graphics, _Text]
            scence2.children[i].visible = true;
            scence2.children[i].children[1].visible = true;
            scence2.children[i].children[2].visible = true;
            let textureTmp = PIXI.Texture.from(
                "examples/assets/" + data[i] + ".jpg"
            );
            scence2.children[i].children[0].texture = textureTmp;
            scence2.children[i].children[0].value = data[i];
        }
    }
    let tl = new TimelineLite().delay(1)
    for (let i = 19; i >= 0; i--) {
        const tween = TweenMax.from(scence2.children[i], 0.15,
            {
                x: centerX,
                y: centerY,
                // delay: i - 0.8 * i + 0.2,
                onStart: () => onStartAnimation(scence2, i),
                onComplete: () => onCompleteAnimation(scence2, i, i === 0)
            }
        );
        tl.add(tween)
    }
    scence2.children.unshift(text);
    isFirst = false;
}

function onStartAnimation(containerRect, i) {
    containerRect.setChildIndex(containerRect.children[i], 20)
}

function onCompleteAnimation(containerRect, i, isEnd) {
    containerRect.setChildIndex(containerRect.children[i], i);
    if (isEnd) {
        console.error("22222222222222222");

    }
}

async function handleChooseImg(event) {
    if (demClick >= 2) return;
    demClick++;
    // [Sprite, _Graphics, _Text]
    const [img, graphics, text] = event.target.children;
    const containerCurrent = event.target;
    if (demClick === 1) {
        TweenMax.from(containerCurrent.scale, 0.5, {
            x: 0,
            onStart: () => {
                graphics.visible = false;
                text.visible = false
            }
        });
        containerPrevious = event.target;
        valueCurrent = img.value;
        valueIndex = text._text;
        return;
    }
    if (demClick === 2) {
        if (text._text != valueIndex) {
            TweenMax.from([containerCurrent.scale], 0.5, {
                x: 0,
                onStart: () => {
                    graphics.visible = false;
                    text.visible = false;
                }
            });
        }
        await new Promise((res) => {
            // 2 tam hinh giong nhau
            if (img.value == valueCurrent && text._text != valueIndex) {
                setTimeout(() => {
                    new Promise((res2) => {
                        TweenMax.to([containerCurrent.scale, containerPrevious.scale], 0.5, {
                            x: 1.1,
                            y: 1.1,
                            onStart: () => {
                                containerCurrentTmp = containerCurrent.parent.getChildIndex(containerCurrent);
                                containerPreviousTmp = containerPrevious.parent.getChildIndex(containerPrevious);
                                console.log(containerCurrentTmp, containerPreviousTmp)
                                containerCurrent.parent.setChildIndex(containerCurrent, 20);
                                containerPrevious.parent.setChildIndex(containerPrevious, 20);

                            },
                            onComplete: () => {
                                containerCurrent.visible = false;
                                containerPrevious.visible = false;
                                containerCurrent.parent.setChildIndex(containerCurrent, containerCurrentTmp);
                                containerPrevious.parent.setChildIndex(containerPrevious, containerPreviousTmp);
                                res2();
                            }
                        });
                    }).then(() => {
                        scoreText.text = "Score = " + ++score;
                        if (score == 10) {
                            scoreTotal += score;
                            scoreTotalText.text =
                                "Số điểm hiện tại = " + scoreTotal;
                            scence2.visible = false;
                            scence3.visible = true;
                        }
                        res();
                    })
                }, 200);
            } else {
                // 2 tam hinh khong giong nhau
                setTimeout(() => {
                    TweenMax.fromTo([containerCurrent.scale, containerPrevious.scale], 0.5, {x: 0}, {
                        x: 1,
                        onStart: () => {
                            graphics.visible = true;
                            text.visible = true;
                            containerPrevious.children[1].visible = true;
                            containerPrevious.children[2].visible = true;
                            res();
                        }
                    })
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
