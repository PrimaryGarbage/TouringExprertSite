const dotSize = "15px";
const dotColorIdle = "rgb(220, 220, 220)";
const dotColorActive = "rgb(176, 85, 237)"
const dotMarginHor = "20px";
const dotMarginVer = "10px";
const dotTransitionTime = "0.8s";

const containerElements = document.getElementsByClassName("horizontal-swipe-container");
let containers = [];

class Container {
    constructor(containerElement, stripeElements, prevBtn, nextBtn, dotsContainerElement)
    {
        this.containerElement = containerElement;
        this.stripeElements = stripeElements;
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.positionX = 0;
        this.dotsContainerElement = dotsContainerElement;
    }
}

init();

function init()
{
    for(c of containerElements)
    {
        const stripes = c.getElementsByClassName("stripe3-swipe-subcontainer");
        for(s of stripes)
        {
            const eventBoxes = s.getElementsByClassName("event-box");
            for(e of eventBoxes)
            {
                e.addEventListener("click", gotoEventURL);
            }
        }
        
        const prevBtn = c.getElementsByClassName("prev-event-btn")[0];
        const nextBtn = c.getElementsByClassName("next-event-btn")[0];
        prevBtn.addEventListener("click", prev);
        nextBtn.addEventListener("click", next);
    
        let dotsContainer;
        if(c.getAttribute("dots") == "true")
        {
            dotsContainer = document.createElement("div");
            for(let i = 0; i < stripes.length; ++i)
            {
                let dot = document.createElement("span");
                dot.style.display = "inline-block";
                dot.style.width = dotSize;
                dot.style.height = dotSize;
                dot.style.backgroundColor = dotColorIdle;
                dot.style.borderRadius = "50px";
                dot.style.margin = dotMarginVer + " " + dotMarginHor;
                dot.style.transition = "all " + dotTransitionTime;
                dot.style.cursor = "pointer";
                dot.setAttribute("index", i);
                dot.addEventListener("click", dotClicked);
                dotsContainer.appendChild(dot);
            }
            dotsContainer.childNodes[0].style.backgroundColor = dotColorActive;
            c.insertBefore(dotsContainer, prevBtn.parentElement);
        }

        containers.push(new Container(c, stripes, prevBtn, nextBtn, dotsContainer));
    }
}

function next(event)
{
    let container;
    for(c of containers)
    {
        if(c.nextBtn.isEqualNode(event.target))
        {
            container = c;
            break;
        }
    }

    if(container.positionX > (container.stripeElements.length - 1) * (-100))
    {
        for(s of container.stripeElements)
        {
            s.style.transform = `translateX(${container.positionX - 100}%)`;
        }
        container.positionX -= 100;
        
        if(container.containerElement.getAttribute("dots") == "true")
        {
            for(dot of container.dotsContainerElement.childNodes)
            {
                dot.style.backgroundColor = dotColorIdle;
            }
            container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].style.backgroundColor = dotColorActive;
        }
    }
}

function prev(event)
{
    let container;
    for(c of containers)
    {
        if(c.prevBtn.isEqualNode(event.target))
        {
            container = c;
            break;
        }
    }
    
    if(container.positionX < 0)
    {
        for(s of container.stripeElements)
        {
            s.style.transform = `translateX(${container.positionX + 100}%)`;
        }
        container.positionX += 100;

        if(container.containerElement.getAttribute("dots") == "true")
        {
            for(dot of container.dotsContainerElement.childNodes)
            {
                dot.style.backgroundColor = dotColorIdle;
            }
            container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].style.backgroundColor = dotColorActive;
        }
    }
}

function dotClicked(event)
{
    let container;
    for(c of containers)
    {
        if(c.containerElement.isEqualNode(event.currentTarget.parentElement.parentElement))
        {
            container = c;
            break;
        }
    }
    goto(Number(event.currentTarget.getAttribute("index")), container);
}

function goto(index, container)
{
    const newPos = -clamp(100 * index, 0, 100 * (container.stripeElements.length - 1));
    for(s of container.stripeElements)
    {
        s.style.transform = `translateX(${newPos}%)`;
    }
    container.positionX = newPos;

    if(container.containerElement.getAttribute("dots") == "true")
    {
        for(dot of container.dotsContainerElement.childNodes)
        {
            dot.style.backgroundColor = dotColorIdle;
        }
        container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].style.backgroundColor = dotColorActive;
    }
}

function gotoEventURL(event)
{
    const href = event.currentTarget.getAttribute("href")
    if(href) window.location.href = href;
}

function clamp(num, min, max)
{
    return Math.min(Math.max(num, min), max);
}