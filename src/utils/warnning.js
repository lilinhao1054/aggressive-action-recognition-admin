const soundID = "Warning";

// eslint-disable-next-line no-undef
createjs.Sound.registerSound("phone_buzz.mp3", soundID);

navigator.mediaDevices.getUserMedia({ audio: true });

export function playSound () {
    // eslint-disable-next-line no-undef
    createjs.Sound.play(soundID);
}