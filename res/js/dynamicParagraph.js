const stateMachine = new StateMachine(6);
const dynP = document.getElementById("dynamic-paragraph");
const paragraphs = dynP.children;

const maxPosition = 107;
let position = maxPosition;
const positionDelta = 2;

let maxBoxHeight = 100;
let boxHeight = 0;
const boxHeightDelta = 2;

let maxOpacity = 1.0;
let opacity = maxOpacity;
const opacityDelta = 0.005;

let maxWaitTime = 1.0;
let waitTime = 0.0;
const waitTimeDelta = 0.003;


let currentParagraph = 0;

for(p of paragraphs) p.style.transform = `translate(${maxPosition}%, 0px)`;

const animate = (function() {
    switch(stateMachine.state)
    {
        case 0:
            {
                stepBoxHeight(false);
                break;
            }
        case 1:
            {
                stepPosition(false);
                break;
            }
        case 2:
            {
                stepWait();
                break;
            }
        case 3:
            {
                //stepPosition(true);
                stateMachine.nextState();
                break;
            }
        case 4:
            {
                stepOpacity(false);
                break
            }
        case 5:
            {
                reset()
                break;
            }
    }
    requestAnimationFrame(animate);
}).bind(this);

requestAnimationFrame(animate);

function stepBoxHeight(backwards = false)
{
    if(!backwards)
    {
        if(boxHeight < maxBoxHeight)
        {
            boxHeight += boxHeightDelta;
            dynP.style.transform = `scale(100%, ${boxHeight}%)`;
        }
        else
        {
            stateMachine.nextState();
        }
    }
    else
    {
        if(boxHeight > 0)
        {
            boxHeight -= boxHeightDelta;
            dynP.style.transform = `scale(100%, ${boxHeight}%)`;
        }
        else
        {
            stateMachine.nextState();
        }
    }
}

function stepPosition(backwards = false)
{
    if(!backwards)
    {
        if(currentParagraph < paragraphs.length)
        {
            if(position > 0)
            {
                position -= positionDelta;
                paragraphs[currentParagraph].style.transform = `translate(${position}%, 0px)`;
            }
            else
            {
                position = maxPosition;
                ++currentParagraph;
            }
        }
        else
        {
            currentParagraph = 0;
            position = 0;
            stateMachine.nextState();
        }
    }
    else
    {
        if(currentParagraph < paragraphs.length)
        {
            if(position < maxPosition)
            {
                position += positionDelta;
                paragraphs[currentParagraph].style.transform = `translate(${position}%, 0px)`;
            }
            else
            {
                position = 0;
                ++currentParagraph;
            }
        }
        else
        {
            currentParagraph = 0;
            position = maxPosition;
            stateMachine.nextState();
        }
    }
}

function stepOpacity(backwards = false)
{
    if(!backwards)
    {
        if(opacity > 0.0)
        {
            opacity -= opacityDelta;
            dynP.style.opacity = `${opacity}`;
        }
        else
        {
            stateMachine.nextState();
        }
    }
    else
    {
        if(opacity < maxOpacity)
        {
            opacity -= opacityDelta;
            dynP.style.opacity = `${opacity}`;
        }
        else
        {
            stateMachine.nextState();
        }
    }
}

function stepWait()
{
    if(waitTime < maxWaitTime)
    {
        waitTime += waitTimeDelta;
    }
    else
    {
        waitTime = 0.0;
        stateMachine.nextState();
    }
}

function reset()
{
    opacity = maxOpacity;
    dynP.style.opacity = `${opacity}`;
    boxHeight = 0;
    dynP.style.transform = `scale(100%, ${boxHeight}%)`;
    stateMachine.nextState();
    position = maxPosition;
    for(p of paragraphs) p.style.transform = `translate(${position}%, 0%)`;
    return;
}