import { skolemademailToIcs } from "./skolemademailtoics.js";

function getTextParseAndCreateICS()
{
    const content = skolemademailToIcs(document.querySelector("textarea").value);
    if (content.error.length === 0)
    {
       const link = document.createElement("a");
       const file = new Blob([content.text], { type: 'text/calendar' });
       link.href = URL.createObjectURL(file);
       link.download = "skolemad.ics";
       link.click();
       URL.revokeObjectURL(link.href);
    }
    else
    {
        window.alert(content.error)  
    }
}

document.querySelector('button').addEventListener('click', getTextParseAndCreateICS);
