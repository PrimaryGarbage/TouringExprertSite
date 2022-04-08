const widthThreshold = 970;

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
        const eventBoxElements = c.querySelectorAll(".event-box");
        const stripeLength = window.innerWidth > widthThreshold? Number(c.getAttribute("stripe-length")) : Number(c.getAttribute("stripe-length-narrow"));
        const numberOfStripes = Math.ceil(eventBoxElements.length / stripeLength);
        const navBtns = c.getElementsByClassName("nav-btns")[0];
        for(let i = 0; i < numberOfStripes; ++i)
        {
            let stripe = document.createElement("div");
            stripe.classList += "stripe-swipe-subcontainer";
            stripe.style.gridTemplateColumns = `repeat(${stripeLength}, 1fr)`;
            for(let j = 0; j < stripeLength && i * stripeLength + j < eventBoxElements.length; ++j)
            {
                stripe.appendChild(eventBoxElements[i * stripeLength + j]);
            }
            c.insertBefore(stripe, navBtns);
        }

        const stripes = c.getElementsByClassName("stripe-swipe-subcontainer");

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
        if(c.getAttribute("nav-buttons") == "false")
        {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        }
    
        let dotsContainer = document.createElement("div");
        for(let i = 0; i < stripes.length; ++i)
        {
            let dot = document.createElement("span");
            dot.classList += "event-dot";
            dot.setAttribute("index", i);
            dot.addEventListener("click", dotClicked);
            dotsContainer.appendChild(dot);
        }
        dotsContainer.childNodes[0].classList = "event-dot-active";
        c.insertBefore(dotsContainer, prevBtn.parentElement);
        if(c.getAttribute("dots") == "false")
        {
            dotsContainer.style.display = "none";
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