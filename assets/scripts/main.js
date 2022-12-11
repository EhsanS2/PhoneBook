const key = document.querySelectorAll(".key");
const cover_front = document.querySelector(".cover_front");
const cover_back = document.querySelector(".cover_back");
const main_container = document.querySelector(".main_container");
const tag = document.querySelector(".tag");
const add = document.querySelector(".add");
const addbox = document.querySelector(".addbox_container");
const x = document.querySelector(".x");
const add_change_button = document.getElementById("add");
const input_data = document.querySelector(".input_data");
const result = document.querySelector("#result");
const fname_result = document.querySelector("#firstname + p.result");
const lname_result = document.querySelector("#lastname + p.result");
const phn_result = document.querySelector("#phone + p.result");

//handle closing phonebook when click outside the area
document.addEventListener("click", (e) => {
    if (
        !(
            document.querySelector(".covers").contains(e.target) ||
            document.querySelector(".alphabets").contains(e.target) ||
            add.contains(e.target) ||
            addbox.contains(e.target)
        )
    )
        if (cover_front.classList.contains("animation_fwd")) {
            main_container.style.transform = "translateX(0)";
            tag.style.opacity = "1";
            cover_front.classList.add("animation_back");
        }
});

// adding listener to all alphabet buttons
key.forEach((k) => {
    k.addEventListener("click", (event) => {
        main_container.style.transform = "translateX(-225px)";
        tag.style.opacity = "0";
        cover_front.classList.remove("animation_back");
        cover_front.classList.add("animation_fwd");
        getData(event.target.innerText);
    });
});

add.addEventListener("click", showBox); // show add or change windows (both are same)

//to close add_or_change window
x.addEventListener("click", () => {
    addbox.style.display = "none";
});

// add_or_change submit button
add_change_button.addEventListener("click", (event) => {
    if (formValidation()) {
        if (add_change_button.innerText == "Add") {
            saveData();
        } else {
            saveData(0);
        }
    }
});

function showResultMsg(msg) {
    document.querySelector(".input_container").style.display = "none";
    const result = document.querySelector("#result");
    result.style.display = "block";
    switch (msg) {
        case "success":
            result.innerText = "Data Submitted Sucessfully";
            break;
        case "fail":
            result.innerText = "Data Submission failed";
            break;
        default:
            result.innerText = "Error Occured !";
    }
}

// controling text and parameters in add_or_change window
function showBox(status = "new", data = []) {
    fname_result.style.display = "none";
    lname_result.style.display = "none";
    phn_result.style.display = "none";
    document.querySelector(".input_container").style.display = "block";
    document.querySelector("#result").style.display = "none";
    const title = document.querySelector(".title");
    if (status === "edit") {
        title.innerText = "Change Contact";
        add_change_button.innerText = "Change";
        document.getElementById("firstname").value = data[0];
        document.getElementById("lastname").value = data[1];
        document.getElementById("phone").value = data[2];
        document.querySelector(".input_data").children.item(0).value = data[3];
    } else {
        title.innerText = "New Contact";
        add_change_button.innerText = "Add";
        document.getElementById("firstname").value = "";
        document.getElementById("lastname").value = "";
        document.getElementById("phone").value = "";
    }
    addbox.style.display = "flex";
}

//fetching data from a JSON file
function getData(e) {
    const path = `./assets/data/${e.toLowerCase()}.json`;
    if (path) {
        console.log("new connection to server");
        fetch(path, { cache: "no-store" })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    showData(0);
                }
            })
            .then((json) => showData(json));
    } else {
        showData(0);
    }
}

function formValidation() {
    const fname = document.getElementById("firstname").value;
    const lname = document.getElementById("lastname").value;
    const phn = document.getElementById("phone").value;
    flag = true; //default value
    if (fname.trim() === "") {
        fname_result.style.display = "block";
        fname_result.innerText = "Cannot be empty";
        flag = false;
    }
    if (lname.trim() === "") {
        lname_result.style.display = "block";
        lname_result.innerText = "Cannot be empty";
        flag = false;
    }
    const regex = /\d*/g;
    if (phn !== phn.match(regex)[0]) {
        phn_result.style.display = "block";
        phn_result.innerText = "Only digits are allowed";
        flag = false;
    }
    return flag;
}

// preparing data for changing a contact
function edit(e) {
    let data = e.target.parentElement.parentElement.children.item(1).innerText; //i know, it's a bit complicated :(
    const id = e.target.parentElement.parentElement.children.item(0).value;
    data = data.split(" ");
    showBox("edit", [data[0], data[1], data[3], id]);
}

// showing data to user
function showData(data) {
    cover_back.innerHTML = "";
    // Object.entries(data).length
    if (data) {
        data.forEach((d) => {
            const dataBox = document.createElement("div");
            const { firstname, lastname, phone, id } = d;
            dataBox.classList.add("data_card");
            dataBox.innerHTML = `
                                    <input type="hidden" name="id1" value=${id} />
                                    <p>${firstname} ${lastname} : ${phone}</p><p><i onClick="edit(event)" class="edit fa-solid fa-pencil"></i></p>
                                `;
            cover_back.appendChild(dataBox);
        });
    } else {
        cover_back.innerHTML = "<p style='text-align:center'>Not Found</p>";
    }
}

//passing data to PHP script to save in a JSON file
function saveData(isNew = 1) {
    const fname = document.getElementById("firstname").value;
    const lname = document.getElementById("lastname").value;
    const phn = document.getElementById("phone").value;
    const id = document.querySelector(".input_data").children.item(0).value;
    const xhr = new XMLHttpRequest();
    if (isNew === 1) {
        xhr.open(
            "GET",
            `./assets/scripts/script.php?fname=${fname}&lname=${lname}&phn=${phn}&act=new`
        );
    } else {
        xhr.open(
            "GET",
            `./assets/scripts/script.php?fname=${fname}&lname=${lname}&phn=${phn}&id=${id}&act=edit`
        );
    }
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getData(fname[0]);
            showResultMsg("success");
        } else {
            showResultMsg("fail");
        }
    };
    xhr.send();
}
