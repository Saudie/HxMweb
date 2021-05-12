var mediaPlayer;

var keepPlaying = false;
var firstBeat = true;
var soundBeginning = true;
var backToNormal = false;
var dieSlowly = false;
var wakeUpSlowly = true;

var delayMillis;
var currentVolume = 0.2;
var currentDelay = 1200;
var consecutiveBeats = 0;
var consecutiveExtreme = 1;
var frequencyIncreasing = false;

var firstBeatPlayer = new Audio('beat1.wav');
var secondBeatPlayer = new Audio('beat2.wav');

mediaPlayer = firstBeatPlayer;
playMySound();

function playSingleHeartbeat(frequency) {
	var firstBeatPlayer = new Audio('beat1.wav');
	var secondBeatPlayer = new Audio('beat2.wav');

	firstBeatPlayer.onended = function() {
	    setTimeout(function(){
	    	beat2.play();
	    }, frequency)
	};

	secondBeatPlayer.play();
}

function reviveHeart() {
	soundBeginning = false;
    keepPlaying = true;
    firstBeat = true;
    wakeUpSlowly = true;

    currentVolume = 0.2;
    currentDelay = 1200;

    controlVolume(0.2);
}

function killHeart() {
	dieSlowly = true;
}

function controlVolume(volumeLevel) {
    if (volumeLevel > 0.8) {
        volumeLevel = 0.8;
    }
    else if (volumeLevel < 0.2) {
        volumeLevel = 0.2;
    }

    firstBeatPlayer.volume = volumeLevel;
    secondBeatPlayer.volume = volumeLevel;
}

function playMySound() {
    var frequencyToAdd;

    if (keepPlaying) {
        if (firstBeat) {
            mediaPlayer = firstBeatPlayer;
            delayMillis = currentDelay;

            if (soundBeginning) {
                console.log("First time, setup");

                frequencyIncreasing = (getRandomInt(0,1) > 0);
                console.log("frequencyIncreasing : " + frequencyIncreasing);
                frequencyToAdd = frequencyIncreasing ? 40 : -40;

                currentDelay = 800;
                consecutiveBeats = 0;
                consecutiveExtreme = 1;

                soundBeginning = false;
            }
            else if (wakeUpSlowly) {
                console.log("Wake up slowly : " + currentDelay);
                frequencyToAdd = -160;

                controlVolume(currentVolume);
                currentVolume += 0.3;

                if (currentDelay <= 960) {
                    wakeUpSlowly = false;
                    soundBeginning = true;
                }
            }
            else if (dieSlowly) {
                console.log("Die slowly");
                frequencyToAdd = 160;

                if (currentDelay >= 1400) {
                    keepPlaying = false;
                    dieSlowly = false;
                }
            }
            else {
                if (backToNormal) {
                    console.log("Back to normal, frequency : " + currentDelay);

                    if (currentDelay == 800) {
                        var randomChanger = getRandomInt(0,1);

                        console.log("Compare randomChanger (" + randomChanger + ") to consecutiveExtreme (" + consecutiveExtreme + ")");

                        if (consecutiveExtreme >= randomChanger) {
                            // 50% to change the first time, always change the second time
                            frequencyIncreasing = !frequencyIncreasing;
                            consecutiveExtreme = 1;

                            console.log("Revert");
                        }
                        else {
                            console.log("Continue");
                            consecutiveExtreme++;
                        }

                        consecutiveBeats = 0;
                        backToNormal = false;

                        frequencyToAdd = frequencyIncreasing ? -40 : -40;
                    }
                    else {
                        console.log("Go back to 1000");
                        frequencyToAdd = currentDelay < 800 ? 40 : -40;
                    }
                }
                else {
                    var randomChanger = getRandomInt(1,20);

                    console.log("Compare randomChanger (" + randomChanger + ") to consecutiveBeats (" + consecutiveBeats + ")");

                    if (consecutiveBeats > randomChanger) {
                        console.log("Change extreme, back to normal");

                        backToNormal = true;
                        frequencyToAdd = currentDelay < 800 ? 40 : -40;
                    }
                    else {
                        console.log("Continue into the extreme");
                        frequencyToAdd = frequencyIncreasing ? 40 : -40;
                    }
                }
            }

            consecutiveBeats++;
            currentDelay += frequencyToAdd;

            console.log("Frequency : " + currentDelay + " - Consecutives beats : " + consecutiveBeats + " - Consecutives extreme : " + consecutiveExtreme);
        }
        else {
            mediaPlayer = secondBeatPlayer;
            delayMillis = currentDelay / 2;
        }
    }

    console.log("Loop");

    setTimeout(function(){
    	if (keepPlaying) {
            mediaPlayer.play();
            firstBeat = !firstBeat;
        }

        playMySound();
    }, currentDelay)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

alert("Bienvenue sur Human Ex Machina. Pour le bon déroulement de l'expérience, vérifiez que votre smartphone est bien connecté à l'enceinte et que le volume est augmenté au maximum. Vous pouvez maintenant placer votre smartphone dans la boîte...");
