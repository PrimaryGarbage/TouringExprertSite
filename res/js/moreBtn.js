const moreBtns = document.getElementsByClassName("more-btn");
const defaultHeights = [];
const hideTimeout = 1000;

for(b of moreBtns)
{
    b.addEventListener("click", openMore);
}

function openMore(event)
{
    event.target.style.transform = "translate(-50%, -50%) rotateX(180deg)"; 
    event.target.parentElement.style.height = "fit-content";
    const oldHeight = event.target.parentElement.offsetHeight;
    defaultHeights[event.target] = oldHeight + "px";
    const additionalInfo = event.target.parentElement.getElementsByClassName("additional-info")[0];
    additionalInfo.style.display = "block";
    event.target.parentElement.style.height = oldHeight + "px";
    event.target.parentElement.style.height = (oldHeight + additionalInfo.offsetHeight) + "px";
    event.target.removeEventListener("click", openMore);
    event.target.addEventListener("click", closeMore);
}

function closeMore(event)
{
    event.target.style.transform = "translate(-50%, -50%) rotateX(0deg)";
    event.target.parentElement.style.height = defaultHeights[event.target];
    setTimeout(hideMore, hideTimeout, event);
    event.target.removeEventListener("click", closeMore);
    event.target.addEventListener("click", openMore);
}

function hideMore(event)
{
    event.target.parentElement.getElementsByClassName("additional-info")[0].style.display = "none";
}

function showMore(event)
{
    const additionalInfo = event.target.parentElement.getElementsByClassName("additional-info")[0].style.display = "block"
}