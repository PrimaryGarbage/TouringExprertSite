const containerElements = document.getElementsByClassName("horizontal-swipe-container");
let containers = [];

class Container {
    constructor(containerElement, stripeElements, prevBtn, nextBtn)
    {
        this.containerElement = containerElement;
        this.stripeElements = stripeElements;
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.positionX = 0;
    }
}

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

    containers.push(new Container(c, stripes, prevBtn, nextBtn));
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
    }
}

function gotoEventURL(event)
{
    const href = event.currentTarget.getAttribute("href")
    if(href) window.location.href = href;
}