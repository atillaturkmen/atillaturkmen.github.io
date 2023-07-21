function loadTable(nofUrls) {
    const table = document.getElementById("url_table");
    // add url rows
    for (let i = 1; i <= nofUrls; i++) {
        let row = table.insertRow();
        // label
        let div1 = document.createElement("div");
        div1.classList.add("space_between");
        let label = document.createElement("label");
        label.id = `url_label_id${i}`;
        label.for = `url${i}`;
        label.innerHTML = localStorage.getItem(`url_name${i}`) || `Url ${i} (type&save to change)`;
        label.contentEditable = true;
        div1.appendChild(label);
        // edit label button
        let editButton = document.createElement("button");
        editButton.onclick = function () { editUrlLabel(this) };
        editButton.innerHTML = String.fromCodePoint(0x1F4BE); // 💾 floppy disc emoji
        div1.appendChild(editButton);
        row.insertCell(0).appendChild(div1);
        // input
        let input = document.createElement("input");
        input.type = "text";
        input.id = `url${i}`;
        input.value = localStorage.getItem(`url${i}`);
        row.insertCell(1).appendChild(input);
        // set button
        let setButton = document.createElement("button");
        setButton.onclick = () => { setUrl(`url${i}`) };
        setButton.classList.add("set_button");
        setButton.innerHTML = `Set ${ordinalSuffixOf(i)} URL`;
        row.insertCell(2).appendChild(setButton);
        // fire button
        let fireButton = document.createElement("button");
        fireButton.onclick = () => { windowOpen(document.getElementById(`url${i}`).value) };
        fireButton.classList.add("fire_button");
        fireButton.innerHTML = `Manual Fire ${ordinalSuffixOf(i)} URL`;
        row.insertCell(3).appendChild(fireButton);
        // delete url button
        let deleteButton = document.createElement("button");
        deleteButton.onclick = function () { deleteUrl(this, nofUrls) };
        deleteButton.innerHTML = "Delete URL";
        row.insertCell(4).appendChild(deleteButton);
    }
    let row = table.insertRow();
    // add url button
    let addUrlButton = document.createElement("button");
    addUrlButton.innerHTML = "+";
    addUrlButton.classList.add("add_url_button");
    addUrlButton.onclick = () => {
        localStorage.setItem("nof_urls", nofUrls + 1);
        location.reload();
    }
    row.insertCell(0).appendChild(addUrlButton);
    // last update time
    let lastUpdate = document.createElement("h6");
    lastUpdate.id = "last_update";
    row.insertCell(1).appendChild(lastUpdate);
    row.insertCell(2);
    // fire all button
    let fireAllButton = document.createElement("button");
    fireAllButton.onclick = () => {
        for (let i = 1; i <= nofUrls; i++) {
            let url = document.getElementById(`url${i}`).value;
            windowOpen(url);
        }
    };
    fireAllButton.classList.add("fire_all_button");
    fireAllButton.innerHTML = "Automatic Fire All URL's";
    row.insertCell(3).appendChild(fireAllButton);
    updateLastUpdateTime();
    row.insertCell(4);
}

function updateLastUpdateTime() {
    // assign default value if "lasturlupdate" is null
    let lastUpdate = localStorage.getItem("lasturlupdate") || "Not updated yet";
    document.getElementById("last_update").innerHTML = "Last Update Time: " + lastUpdate;
}

function setUrl(url) {
    var today = new Date().toLocaleString('en-UK');
    localStorage.setItem(url, document.getElementById(url).value);
    localStorage.setItem("lasturlupdate", today);
    updateLastUpdateTime();
}

function editUrlLabel(element) {
    const index = element.parentNode.parentNode.parentNode.rowIndex;
    let urlName = document.getElementById(`url_label_id${index}`).innerText;
    localStorage.setItem(`url_name${index}`, urlName);
}

function deleteUrl(element, nofUrls) {
    const index = element.parentNode.parentNode.rowIndex;
    for (let i = index; i < nofUrls - 1; i++) {
        let nextUrl = localStorage.getItem(`url${i + 1}`) || "";
        localStorage.setItem(`url${i}`, nextUrl);
        let nextUrlName = localStorage.getItem(`url_name${i + 1}`);
        if (nextUrlName === null) {
            localStorage.removeItem(`url_name${i}`);
        } else {
            localStorage.setItem(`url_name${i}`, nextUrlName);
        }
    }
    localStorage.removeItem(`url${nofUrls}`);
    localStorage.removeItem(`url_name${nofUrls}`);
    localStorage.setItem("nof_urls", nofUrls - 1);
    location.reload();
}
