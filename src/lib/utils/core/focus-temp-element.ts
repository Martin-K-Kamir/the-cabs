export function focusTempElement() {
    const dummyElement = document.createElement("div");
    dummyElement.tabIndex = -1;
    document.body.appendChild(dummyElement);

    dummyElement.style.position = "fixed";
    dummyElement.style.top = "0";
    dummyElement.style.left = "0";
    dummyElement.style.opacity = "0";
    dummyElement.style.pointerEvents = "none";
    dummyElement.style.width = "0px";
    dummyElement.style.height = "0px";
    dummyElement.style.zIndex = "-1";
    dummyElement.style.outline = "none";
    dummyElement.style.userSelect = "none";

    dummyElement.focus();
    document.body.removeChild(dummyElement);
}
