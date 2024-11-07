
function pad(i) {
    return i < 10 ? `0${i}` : `${i}`;
}

function formatDateTime(date) {
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hour = pad(date.getUTCHours());
    const minute = pad(date.getUTCMinutes());
    const second = pad(date.getUTCSeconds());
    return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

// 05-11-2024 -> 20241105
// 2024-12-03T12:00:00+01:00 -> 20241203
function parseDate(date) {
    let date_splitted = date.split(/-/);
    if (2 == date_splitted[0].length) {
        // 05-11-2024
        return date_splitted[2] + date_splitted[1] + date_splitted[0];
    }
    // 2024-12-03T12:00:00+01:00
    return date_splitted[0] + date_splitted[1] + date_splitted[2].substring(0, 2);
}

function create_ics(name, products){
    let strings = []
    strings.push("BEGIN:VCALENDAR");
    strings.push("VERSION:2.0");
    strings.push("PRODID://ni2c2k//skolemad klub");
    
    for (let prod of products) {
        strings.push("BEGIN:VEVENT")

        const formatted_date = parseDate(prod.date);

        strings.push("UID:skolemad-ni2c2k-produ" + name[0] + "-" + formatted_date);
        strings.push("DTSTAMP:" + formatDateTime(new Date()));

        // let next_date = new Date(date_splitted[2], date_splitted[1], date_splitted[0]);
        // next_date.setDate(next_date.getDate() + 1);
        // let next_date_str = date_splitted[2] + String(next_date.getMonth()).padStart(2, "0") + String(next_date.getDate()).padStart(2, "0");

        strings.push("DTSTART;VALUE=DATE:" + formatted_date);
        // strings.push("DTEND;VALUE=DATE:" + next_date_str);   // it's not required for a full-day event
        strings.push("SUMMARY:Skolemad " + name + ". " + prod.product);
        strings.push("DESCRIPTION:Skolemad " + name + ". " + prod.product);
        strings.push("TRANSP:TRANSPARENT");
        strings.push("END:VEVENT")
    }

    strings.push("END:VCALENDAR");
    let result = strings.join("\r\n");

    // console.log(result)

    return {error: "", text: result}
}

export function skolemademailToIcs(content)
{
    let lines = content.split(/\r?\n/);
    let name = "";
    for (let i in lines) {
        if (lines[i].startsWith('Navn')) {
            let splitted_line = lines[i].split(/\t/);
            name = splitted_line[1];
            // console.log('name found', splitted_line[1]);
            lines = lines.slice(i)
            break;
        }
    }

    if (name.length === 0)
    {
        return {error: "can\'t find a \'Navn\'", text: ""}
    }

    let products = [];
    for (let i = 0; i < lines.length; ) {
        if (lines[i].startsWith('Total')) {
            break;
        }
        if (lines[i].startsWith('Produkt:')) {
            let product_splitted = lines[i].split(/\t/);
            if (lines[i + 1].startsWith('Udleveringsdato:')) {
                let date_splitted = lines[i + 1].split(/\t/);
                products.push({product: product_splitted[1], date: date_splitted[1]})
                i++;
                continue;
            } else {
                return {error: 'can\'t find a \'Udleveringsdato:\'', text: ""}
            }
        }

        i++;
    }

    if (products.length === 0)
    {
        return {error: "no products", text: ""}
    }

    // if we are here - name and products have been found
    // console.log(products)
    return create_ics(name, products);
}
