const app = new PIXI.Application({
    width: 800,
    height: 600,
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const SCREEN_WIDTH = app.screen.width;
const SCREEN_HEIGHT = app.screen.height;
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
shuffle(data);
let isFirst = true;
let scoreTotal = 100;
let score = 100;
let demClick = 0;
let containerPrevious, valueCurrent, valueIndex;
let correctTurnCount = 0;
let countSuggest = 3;
//RegisterSound
let soundSuccess, soundFail, soundGameOver, soundGameVictory, soundGameStart, soundFlip;
window.onLoad = loadingSound();

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
    playSoundClickButton()
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

const containerGame = new PIXI.Container();
scence2.addChild(containerGame);

for (let i = 0; i < 20; i++) {
    let container = new PIXI.Container();
    container.width = 100;
    container.height = 100;
    container.x = 200 + (i % 5) * 100;
    container.y = 160 + Math.floor(i / 5) * 100;
    container.pivot.x = container._width * 0.5;
    container.pivot.y = container._height * 0.5;
    container.index = i;
    containerGame.addChild(container);

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
    container.on("pointerdown", handleChooseImg);
}

const suggestButton = PIXI.Sprite.from("examples/assets/glasses.png");
suggestButton.x = SCREEN_WIDTH - 100
suggestButton.y = 50;
scence2.addChild(suggestButton)
suggestButton.on("pointerdown",() => {
    suggestAction()
})
const resetButton = PIXI.Sprite.from("examples/assets/pngwing.com.png");
resetButton.x = SCREEN_WIDTH - 100;
resetButton.y = SCREEN_HEIGHT - 100;
scence2.addChild(resetButton);
resetButton.visible = false;

resetButton.on("pointerdown", () => {
    playSoundClickButton()
    playGame();
});
//SCENCE 3
const scence3 = new PIXI.Container();
app.stage.addChild(scence3);
scence3.visible = false;

const victoryText = new PIXI.Text("CHÚC MỪNG BẠN ĐẠT " + score, style);
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
    playSoundClickButton()
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
    playSoundClickButton()
    scence3.visible = false;
    scence1.visible = true;
});

function playGame() {
    const centerX = SCREEN_WIDTH * 0.5;
    const centerY = SCREEN_HEIGHT * 0.5;
    scence2.children[1].children.reverse();
    if (!isFirst) {
        shuffle(data);
        disibleAction()
        score = 100;
        correctTurnCount = 0;
        scence2.children[0].text = "Score = " + score;
        for (let i = 0; i < 20; i++) {
            // List Item container
            const updateContainer = scence2.children[1].children;
            updateContainer[i].interactive = false;
            updateContainer[i].cursor = false;
            updateContainer[i].visible = true;
            // [Sprite, _Graphics, _Text]
            updateContainer[i].children[1].visible = true;
            updateContainer[i].children[2].visible = true;
            let textureTmp = PIXI.Texture.from(
                "examples/assets/" + data[i] + ".jpg"
            );
            updateContainer[i].children[0].texture = textureTmp;
            updateContainer[i].children[0].value = data[i];
        }
    }
    const tl = new TimelineLite().delay(1);
    for (let i = 19; i >= 0; i--) {
        const tween = TweenMax.from(scence2.children[1].children[i], 0.15, {
            x: centerX,
            y: centerY,
            onStart: () => onStartAnimation(scence2, i),
            onComplete: () => onCompleteAnimation(scence2, i, i === 0),
        });
        tl.add(tween);
    }
    isFirst = false;
}

function disibleAction() {
    resetButton.interactive = false;
    resetButton.cursor = false;
    suggestButton.interactive = false;
    suggestButton.cursor = false;
}

function enableAction() {
    suggestButton.interactive = true;
    suggestButton.cursor = "pointer";
    resetButton.interactive = true;
    resetButton.cursor = "pointer";
}

function onStartAnimation(containerRect, i) {
    containerRect.children[1].setChildIndex(
        containerRect.children[1].children[i],
        19
    );
}

function onCompleteAnimation(containerRect, i, isEnd) {
    containerRect.children[1].setChildIndex(
        containerRect.children[1].children[i],
        i
    );
    if (isEnd) {
        for (let i = 0; i < 20; i++) {
            containerRect.children[1].children[i].interactive = true;
            containerRect.children[1].children[i].cursor = "pointer";
        }
        enableAction()
    }
}

function suggestAction() {
    for (let i = 0; i < 19; i++) {
        const containerFirst = containerGame.children[i];
        for(let j = i + 1; j < 20; j++){
            const containerSecond = containerGame.children[j];
            if(containerFirst.children[0].value === containerSecond.children[0].value && containerFirst.visible && containerSecond.visible) {
                setBackGroundColor(containerFirst, containerSecond)
                return;
            }
        }
    }
}

function setBackGroundColor(containerFirst, containerSecond){
    containerFirst.children[1].clear();
    containerFirst.children[1].beginFill(0xFFFF00, 0.8); // 0.8 is opacity
    containerFirst.children[1].lineStyle(1, 0xfeeb77, 1);
    containerFirst.children[1].drawRect(0, 0, 100, 100);
    containerFirst.children[1].endFill();
    containerSecond.children[1].clear();
    containerSecond.children[1].beginFill(0xFFFF00, 0.8);
    containerSecond.children[1].lineStyle(1, 0xfeeb77, 1);
    containerSecond.children[1].drawRect(0, 0, 100, 100);
    containerSecond.children[1].endFill();

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
                playSoundFlip()
                graphics.visible = false;
                text.visible = false;
            },
        });
        containerPrevious = event.target;
        valueCurrent = img.value;
        valueIndex = text._text;
        return;
    }
    if (demClick === 2) {
        if (text._text != valueIndex) {
            TweenMax.from(containerCurrent.scale, 0.5, {
                x: 0,
                onStart: () => {
                    playSoundFlip()
                    graphics.visible = false;
                    text.visible = false;
                },
            });
        }
        await new Promise((res) => {
            // 2 tam hinh giong nhau
            if (img.value == valueCurrent && text._text != valueIndex) {
                actionCompare2ItemTrue(containerCurrent,containerPrevious, res)
            } else {
                // 2 tam hinh khong giong nhau
                actionCompare2ItemFalse(containerCurrent,containerPrevious,graphics,text, res)
            }
        });
        demClick = 0;
    }
}

function actionCompare2ItemTrue(containerCurrent,containerPrevious, res) {
    new Promise((res2) => {
        setTimeout(() => {
            TweenMax.to(
                [containerCurrent.scale, containerPrevious.scale],
                0.5,
                {
                    x: 1.1,
                    y: 1.1,
                    onStart: () => {
                        containerCurrent.parent.setChildIndex(
                            containerCurrent,
                            19
                        );
                        containerPrevious.parent.setChildIndex(
                            containerPrevious,
                            18
                        );
                    },
                    onComplete: () => {
                        playSoundSuccess()
                        containerCurrent.visible = false;
                        containerPrevious.visible = false;

                        containerCurrent.scale.x = 1;
                        containerCurrent.scale.y = 1;
                        containerPrevious.scale.x = 1;
                        containerPrevious.scale.y = 1;

                        containerCurrent.parent.setChildIndex(
                            containerCurrent,
                            containerCurrent.index
                        );
                        containerPrevious.parent.setChildIndex(
                            containerPrevious,
                            containerPrevious.index
                        );
                        res2();
                    },
                }
            );
        }, 200);
    }).then(() => {
        score += 10;
        correctTurnCount++;
        scoreText.text = "Score = " + score;
        // If you win
        if (correctTurnCount == 10) {
            playSoundGameVictory()
            scoreTotal += score;
            scoreTotalText.text =
                "Số điểm hiện tại = " + scoreTotal;
            scence2.visible = false;
            scence3.visible = true;
            victoryText.text = "CHÚC MỪNG BẠN ĐẠT " + score + "đ";
        }
        res();
    });
}

function actionCompare2ItemFalse(containerCurrent,containerPrevious,graphics,text, res) {
    setTimeout(() => {
        TweenMax.from(
            [containerCurrent.scale, containerPrevious.scale],
            0.5,
            {
                x: 0,
                onStart: () => {
                    playSoundFail()
                    graphics.visible = true;
                    text.visible = true;
                    containerPrevious.children[1].visible = true;
                    containerPrevious.children[2].visible = true;
                },
                onComplete: () => {
                    score -= 10;
                    scoreText.text = "Score = " + score;

                    // If you lose
                    if (score == 0) {
                        // if (!soundGameOver) createSoundGameOver()
                        // else
                        playSoundGameOver()
                        scoreTotal += score;
                        scoreTotalText.text =
                            "Số điểm hiện tại = " + scoreTotal;
                        scence2.visible = false;
                        scence3.visible = true;
                        victoryText.text = "GAME OVER";
                    }
                    res();
                },
            }
        );
    }, 500);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadingSound() {
    createjs.Sound.registerSound("examples/assets/flip.mp3", "soundflip")
    createjs.Sound.registerSound("examples/assets/success.mp3", "soundsuccess")
    createjs.Sound.registerSound("examples/assets/fail.mp3", "soundfail")
    createjs.Sound.registerSound("examples/assets/game-over.mp3", "soundgameover")
    createjs.Sound.registerSound("examples/assets/win.mp3", "soundgamevictory")
    createjs.Sound.registerSound("examples/assets/game-start.mp3", "soundclick")
}

// sound when fip

function playSoundFlip() {
    soundFlip = createjs.Sound.play("soundflip")
}

// sound when choose success

function playSoundSuccess() {
    soundSuccess = createjs.Sound.play("soundsuccess")
}

// Sound when choose fail

function playSoundFail() {
    soundFail = createjs.Sound.play("soundfail");
}

// Sound game over

function playSoundGameOver() {
    soundGameOver = createjs.Sound.play("soundgameover")
}

// Sound game victory

function playSoundGameVictory() {
    soundGameVictory = createjs.Sound.play("soundgamevictory")
}

// Sound game start

function playSoundClickButton() {
    soundGameStart = createjs.Sound.play("soundclick")
}

// createjs.Sound.registerSound(
//     "examples/assets/sound_test.mp3",
//     "soundbackgound"
// );
// createjs.Sound.addEventListener("fileload", (event) => {
//     const bgSound = createjs.Sound.play(event.src);
//     bgSound.volume = 0.5;
// });
