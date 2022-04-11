const widthThreshold = 970;

const containerElements = document.getElementsByClassName("horizontal-swipe-container");
let containers = [];

class Container {
    constructor(containerElement, stripElements, prevBtn, nextBtn, dotsContainerElement)
    {
        this.containerElement = containerElement;
        this.stripElements = stripElements;
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
        let containerChildren = liveToStaticCollection(c.children);
        containerChildren.pop();
        const stripLength = window.innerWidth > widthThreshold? Number(c.getAttribute("strip-length")) : Number(c.getAttribute("strip-length-narrow"));
        const numberOfStrips = Math.ceil(containerChildren.length / stripLength);
        const navBtns = c.getElementsByClassName("nav-btns")[0];
        for(let i = 0; i < numberOfStrips; ++i)
        {
            let strip = document.createElement("div");
            strip.classList += "strip-swipe-subcontainer";
            strip.style.gridTemplateColumns = `repeat(${stripLength}, 1fr)`;
            for(let j = 0; j < stripLength && i * stripLength + j < containerChildren.length; ++j)
            {
                const idx = i * stripLength + j;
                strip.appendChild(containerChildren[idx]);
            }
            c.insertBefore(strip, navBtns);
        }

        const strips = c.getElementsByClassName("strip-swipe-subcontainer");

        for(s of strips)
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
        if(c.getAttribute("nav-buttons") == "false")
        {
            prevBtn.parentElement.style.display = "none";
        }
    
        let dotsContainer = document.createElement("div");
        for(let i = 0; i < strips.length; ++i)
        {
            let dot = document.createElement("span");
            dot.classList += "event-dot";
            dot.setAttribute("index", i);
            dot.addEventListener("click", dotClicked);
            dotsContainer.appendChild(dot);
        }
        dotsContainer.children[0].classList = "event-dot-active";
        c.insertBefore(dotsContainer, prevBtn.parentElement);
        if(c.getAttribute("dots") == "false")
        {
            dotsContainer.style.display = "none";
        }

        containers.push(new Container(c, strips, prevBtn, nextBtn, dotsContainer));
    }
}

function next(event)
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

    if(container.positionX > (container.stripElements.length - 1) * (-100))
    {
        for(s of container.stripElements)
        {
            s.style.transform = `translateX(${container.positionX - 100}%)`;
        }
        container.positionX -= 100;
        
        if(container.containerElement.getAttribute("dots") == "true")
        {
            for(dot of container.dotsContainerElement.childNodes)
            {
                dot.classList = "event-dot";
            }
            container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].classList = "event-dot-active";
        }
    }
}

function prev(event)
{
    let container;
    for(c of containers)
    {
        if(c.containerElement.isEqualNode(event.target.parentElement.parentElement))
        {
            container = c;
            break;
        }
    }
    
    if(container.positionX < 0)
    {
        for(s of container.stripElements)
        {
            s.style.transform = `translateX(${container.positionX + 100}%)`;
        }
        container.positionX += 100;

        if(container.containerElement.getAttribute("dots") == "true")
        {
            for(dot of container.dotsContainerElement.childNodes)
            {
                dot.classList = "event-dot";
            }
            container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].classList = "event-dot-active";
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
    const newPos = -clamp(100 * index, 0, 100 * (container.stripElements.length - 1));
    for(s of container.stripElements)
    {
        s.style.transform = `translateX(${newPos}%)`;
    }
    container.positionX = newPos;

    if(container.containerElement.getAttribute("dots") == "true")
    {
        for(dot of container.dotsContainerElement.childNodes)
        {
            dot.classList = "event-dot";
        }
        container.dotsContainerElement.childNodes[Math.abs(container.positionX / 100.0)].classList = "event-dot-active";
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

function liveToStaticCollection(liveCollection)
{
    let staticCollection = [];
    for(element of liveCollection)
    {
        staticCollection.push(element);
    }
    return staticCollection;
}