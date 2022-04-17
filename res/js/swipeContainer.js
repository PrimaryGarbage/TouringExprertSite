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
        this.positionX = 0;     // in percent
        this.dotsContainerElement = dotsContainerElement;
    }
}

class OneStripContainer {
    constructor(containerElement, stripElement, prevBtn, nextBtn, dotsContainerElement, gap, elementWidth, maxPosX)
    {
        this.containerElement = containerElement;
        this.stripElement = stripElement;
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.dotsContainerElement = dotsContainerElement;
        this.gap = gap;
        this.elementWidth = elementWidth;
        this.maxPosX = maxPosX;
        this.positionX = 0;     // in pixels
        this.animated = false;
        this.animationTime = 0;
        this.animationIntervalID = 0;
    }
}

init();

function init()
{
    for(c of containerElements)
    {
        if(c.getAttribute("one-strip") == "true") initOneStripContainer(c);
        else initContainer(c);
    }
}

function initContainer(container)
{
    let containerChildren = liveToStaticCollection(container.children);
    containerChildren.pop();
    const stripLength = window.innerWidth > widthThreshold? Number(container.getAttribute("strip-length")) : Number(container.getAttribute("strip-length-narrow"));
    const numberOfStrips = Math.ceil(containerChildren.length / stripLength);
    const navBtns = container.getElementsByClassName("nav-btns")[0];
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
        container.insertBefore(strip, navBtns);
    }

    const strips = container.getElementsByClassName("strip-swipe-subcontainer");

    // MOVE THIS SHITe!!!
    for(s of strips)
    {
        const eventBoxes = s.getElementsByClassName("event-box");
        for(e of eventBoxes)
        {
            e.addEventListener("click", gotoEventURL);
        }
    }
    
    const prevBtn = container.getElementsByClassName("prev-event-btn")[0];
    const nextBtn = container.getElementsByClassName("next-event-btn")[0];
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

    containers.push(new Container(container, strips, prevBtn, nextBtn, dotsContainer));
}

function initOneStripContainer(container)
{
    let containerChildren = liveToStaticCollection(container.children);
    containerChildren.pop();
    const stripLength = window.innerWidth > widthThreshold? Number(container.getAttribute("strip-length")) : Number(container.getAttribute("strip-length-narrow"));
    let numberOfElements = containerChildren.length;
    const navBtns = container.getElementsByClassName("nav-btns")[0];
    let strip = document.createElement("div");
    strip.classList += "strip-swipe-subcontainer";
    strip.style.gridTemplateColumns = `repeat(${numberOfElements}, 1fr)`;
    for(let i = 0; i < numberOfElements; ++i)
    {
        strip.appendChild(containerChildren[i]);
    }
    container.insertBefore(strip, navBtns);

    const prevBtn = container.getElementsByClassName("prev-event-btn")[0];
    const nextBtn = container.getElementsByClassName("next-event-btn")[0];
    prevBtn.addEventListener("click", prevOneStrip);
    nextBtn.addEventListener("click", nextOneStrip);
    if(c.getAttribute("nav-buttons") == "false")
    {
        prevBtn.parentElement.style.display = "none";
    }

    let dotsContainer = document.createElement("div");
    for(let i = 0; i < numberOfElements - stripLength + 1; ++i)
    {
        let dot = document.createElement("span");
        dot.classList += "event-dot";
        dot.setAttribute("index", i);
        dot.addEventListener("click", dotClickedOneStrip);
        dotsContainer.appendChild(dot);
    }
    dotsContainer.children[0].classList = "event-dot-active";
    c.insertBefore(dotsContainer, prevBtn.parentElement);
    if(c.getAttribute("dots") == "false")
    {
        dotsContainer.style.display = "none";
    }

    let elementWidth = containerChildren[0].offsetWidth;
    let gap = (strip.offsetWidth - elementWidth * stripLength) / (stripLength - 1);
    gapVW = (pxtovw(gap));
    strip.style.gap = gapVW + "vw";

    const maxPosX = - (containerChildren.length - stripLength) * (gap + elementWidth);

    const newContainer = new OneStripContainer(container, strip, prevBtn, nextBtn, dotsContainer, gap, elementWidth, maxPosX)

    const animTime = container.getAttribute("animation-time");
    if(animTime)
    {
        newContainer.animated = true;
        newContainer.animationTime = animTime;
        animateOneStripContainer(newContainer);
    }

    containers.push(newContainer);
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
        for(dot of container.dotsContainerElement.children)
        {
            dot.classList = "event-dot";
        }
        container.dotsContainerElement.childNodes[index].classList = "event-dot-active";
    }
}

function nextOneStrip(event)
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

    if(container.positionX > container.maxPosX)
    {
        const newPos = container.positionX - container.elementWidth - container.gap;
        container.stripElement.style.transform = `translateX(${newPos}px)`;
        container.positionX = newPos;
        
        if(container.containerElement.getAttribute("dots") == "true")
        {
            let activeIdx;
            for(let i = 0; i < container.dotsContainerElement.children.length; ++i)
            {
                if(container.dotsContainerElement.children[i].classList == "event-dot-active") activeIdx = i;
                container.dotsContainerElement.children[i].classList = "event-dot";
            }
            container.dotsContainerElement.children[activeIdx+1].classList = "event-dot-active";
        }
    }
    else
    {
        gotoOneStrip(0, container);
    }

    if(container.animated) resetAnimationOneStripContainer(container);
}

function prevOneStrip(event)
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

    if(container.positionX <= 0)
    {
        const newPos = container.positionX + container.elementWidth + container.gap;
        container.stripElement.style.transform = `translateX(${newPos}px)`;
        container.positionX = newPos;
        
        if(container.containerElement.getAttribute("dots") == "true")
        {
            let activeIdx;
            for(let i = 0; i < container.dotsContainerElement.children.length; ++i)
            {
                if(container.dotsContainerElement.children[i].classList == "event-dot-active") activeIdx = i;
                container.dotsContainerElement.children[i].classList = "event-dot";
            }
            container.dotsContainerElement.children[activeIdx-1].classList = "event-dot-active";
        }
    }
    else
    {
        gotoOneStrip(container.stripElement.children.length - container.containerElement.getAttribute("strip-length"), container);
    }

    if(container.animated) resetAnimationOneStripContainer(container);
}

function dotClickedOneStrip(event)
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
    gotoOneStrip(Number(event.currentTarget.getAttribute("index")), container);

    if(container.animated) resetAnimationOneStripContainer(container);
}

function gotoOneStrip(index, container)
{
    const newPos = - index * (container.gap + container.elementWidth);
    container.stripElement.style.transform = `translateX(${newPos}px)`;
    container.positionX = newPos;
    if(container.containerElement.getAttribute("dots") == "true")
    {
        for(dot of container.dotsContainerElement.children)
        {
            dot.classList = "event-dot";
        }
        container.dotsContainerElement.children[index].classList = "event-dot-active";
    }
}

function gotoEventURL(event)
{
    const href = event.currentTarget.getAttribute("href");
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

function pxtovw(px)
{
    return px / window.innerWidth * 100;
}

function animateOneStripContainer(container)
{
    container.animationIntervalID = setInterval(() => { 
        const event = new Event("click");
        container.nextBtn.dispatchEvent(event);
    }, container.animationTime)
}

function resetAnimationOneStripContainer(container)
{
    clearInterval(container.animationIntervalID);
    animateOneStripContainer(container);
}