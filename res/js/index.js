const bgImg = document.getElementById("background-img");
const bgPath = "./res/img/background/bg";
const bgExtension = ".jpg"
const bgChangeTime = 5000;

setNextBg.currentBg = 1;
setNextBg.maxBg = 6;
setNextBg.imgScale = 1.3;
setNextBg.maxScale = 1.3;
setNextBg.scaleDelta = 0.0001;

setInterval(setNextBg, bgChangeTime);
setNextBg.scaleID = setInterval(scaleBg, 10);

function setNextBg()
{
    clearInterval(setNextBg.scaleID);
    setNextBg.imgScale = setNextBg.maxScale;
    setNextBg.scaleID = setInterval(scaleBg, 10);
    setNextBg.currentBg = setNextBg.currentBg + 1 > setNextBg.maxBg? 1 : setNextBg.currentBg + 1;
    bgImg.src = bgPath + setNextBg.currentBg + bgExtension;
    imgScale = 1.2;
}

function scaleBg(scale)
{
    if(setNextBg.imgScale <= 1.0) return;
    setNextBg.imgScale -= setNextBg.scaleDelta;
    bgImg.style.transform = `scale(${setNextBg.imgScale})`;
}