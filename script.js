$(document).ready(function () {

    //---------------------------------------------------
    // LOAD DATA SAFELY
    //---------------------------------------------------
    let kids = JSON.parse(localStorage.getItem("kids") || "[]");
    let starTypes = JSON.parse(localStorage.getItem("starTypes") || "[]");

    if (!Array.isArray(kids)) kids = [];
    if (!Array.isArray(starTypes)) starTypes = [];

    //---------------------------------------------------
    // PASTEL AVATARS (60px SVG)
    //---------------------------------------------------
    function avatarSVG(bg, skin, eyes, mouth, blush) {
        return `
        <svg width="60" height="60" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="${bg}" stroke="#2a4a67" stroke-width="4"/>
            <circle cx="50" cy="50" r="32" fill="${skin}" stroke="#2a4a67" stroke-width="3"/>
            ${eyes}
            ${mouth}
            ${blush ? `<circle cx="35" cy="60" r="4" fill="#ffb7cf"/>
                       <circle cx="65" cy="60" r="4" fill="#ffb7cf"/>` : ""}
        </svg>`;
    }

    const AVATARS = [
        avatarSVG("#bde5ff","#ffe1c4",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M40 60 Q50 70 60 60" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#ffd4e5","#ffe1c4",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M38 60 Q50 75 62 60" stroke="black" fill="none" stroke-width="3"/>`,true),
        avatarSVG("#e0ffe4","#f7d7b2",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<line x1="40"y1="60"x2="60"y2="60"stroke="black"stroke-width="3"/>`,false),
        avatarSVG("#fff8c2","#f1c08f",`<rect x="36"y="40"width="10"height="6"fill="black"/><rect x="54"y="40"width="10"height="6"fill="black"/>`,`<path d="M40 62 Q50 72 60 62"stroke="black"fill="none"stroke-width="3"/>`,false),
        avatarSVG("#e5d9ff","#d9a06d",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M40 63 Q50 55 60 63" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#bde5ff","#9b6a43",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M40 63 Q50 73 60 63" stroke="black" fill="none" stroke-width="3"/>`,true),
        avatarSVG("#ffd4e5","#ffe1c4",`<polygon points="36,42 46,42 41,34" fill="black"/><polygon points="54,42 64,42 59,34" fill="black"/>`,`<path d="M40 62 Q50 70 60 62" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#e0ffe4","#f7d7b2",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M40 60 Q50 65 60 60" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#fff8c2","#f1c08f",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M38 63 Q50 78 62 63" stroke="black" fill="none" stroke-width="3"/>`,true),
        avatarSVG("#e5d9ff","#d9a06d",`<rect x="36" y="40" width="10" height="6" fill="black"/><rect x="54" y="40" width="10" height="6" fill="black"/>`,`<path d="M40 62 Q50 55 60 62" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#bde5ff","#f7d7b2",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<path d="M40 65 Q50 80 60 65" stroke="black" fill="none" stroke-width="3"/>`,false),
        avatarSVG("#ffd4e5","#9b6a43",`<circle cx="40" cy="45" r="4"/> <circle cx="60" cy="45" r="4"/>`,`<line x1="40"y1="60"x2="60"y2="60"stroke="black"stroke-width="3"/>`,true)
    ];

    let selectedAvatar = null;

    //---------------------------------------------------
    // RESET
    //---------------------------------------------------
    $("#resetBtn").click(() => {
        if (confirm("Reset everything?")) {
            localStorage.clear();
            location.reload();
        }
    });

    //---------------------------------------------------
    // INLINE ERROR HELPERS
    //---------------------------------------------------
    function showError(id, msg) {
        $("#" + id).addClass("error");
        $("#err_" + id).text(msg).fadeIn(150);
    }

    function clearError(id) {
        $("#" + id).removeClass("error");
        $("#err_" + id).hide();
    }

    //---------------------------------------------------
    // LOAD AVATARS
    //---------------------------------------------------
    AVATARS.forEach((svg, idx) => {
        let div = $(`<div class="avatar">${svg}</div>`);
        $("#avatarContainer").append(div);

        div.click(() => {
            $(".avatar").removeClass("selected");
            div.addClass("selected");
            selectedAvatar = svg;
        });
    });

    //---------------------------------------------------
    // SAVE
    //---------------------------------------------------
    function save() {
        localStorage.setItem("kids", JSON.stringify(kids));
        localStorage.setItem("starTypes", JSON.stringify(starTypes));
    }

    //---------------------------------------------------
    // ADD KID
    //---------------------------------------------------
    $("#addKidBtn").click(() => {

        let name = $("#kidName").val().trim();
        let valid = true;

        clearError("kidName");
        $("#err_avatar").hide();

        if (!name) { showError("kidName","Enter a name"); valid=false; }
        if (!selectedAvatar) { $("#err_avatar").text("Pick an avatar").fadeIn(); valid=false; }

        if (!valid) return;

        let k = {
            name,
            avatar: selectedAvatar,
            stars: {}
        };

        starTypes.forEach(st => k.stars[st.name] = 0);

        kids.push(k);
        save();
        renderKids();

        $("#kidName").val("");
        $(".avatar").removeClass("selected");
        selectedAvatar = null;
    });

    //---------------------------------------------------
    // ADD STAR TYPE
    //---------------------------------------------------
    $("#addStarTypeBtn").click(() => {

        let name = $("#starName").val().trim();
        let meaning = $("#starMeaning").val().trim();
        let needed = parseInt($("#starNeeded").val());
        let colour = $("#starColour").val();

        let valid = true;
        clearError("starName");
        clearError("starMeaning");
        clearError("starNeeded");

        if (!name) { showError("starName","Enter a name"); valid=false; }
        if (!meaning) { showError("starMeaning","Enter a meaning"); valid=false; }
        if (!needed || needed < 1) { showError("starNeeded","Enter >0"); valid=false; }

        if (!valid) return;

        let st = { name, meaning, needed, colour };
        starTypes.push(st);

        kids.forEach(k => k.stars[name] = 0);

        save();
        renderStarTypes();
        renderKids();

        $("#starName").val("");
        $("#starMeaning").val("");
        $("#starNeeded").val("");
    });

    //---------------------------------------------------
    // RENDER KIDS
    //---------------------------------------------------
    function renderKids() {

        $("#kidsList").html("");

        kids.forEach((kid, i) => {

            let card = $(`
                <div class="kid-card">

                    <div class="kid-header">
                        <div class="kid-avatar">${kid.avatar}</div>
                        <h3>${kid.name}</h3>
                    </div>

                    <div class="kid-controls">
                        <button class="btn small" data-action="edit" data-i="${i}">Edit</button>
                        <button class="btn small danger" data-action="del" data-i="${i}">Delete</button>
                        <button class="btn small" data-action="up" data-i="${i}">Up</button>
                        <button class="btn small" data-action="down" data-i="${i}">Down</button>
                    </div>

                    <div id="editKid_${i}" style="display:none; margin-top:12px;">
                        <input id="editKidName_${i}" class="input-text" value="${kid.name}">
                        <button class="btn small primary" data-action="saveKid" data-i="${i}">Save</button>
                        <button class="btn small danger" data-action="cancelKid" data-i="${i}">Cancel</button>
                    </div>

                    <div class="kid-stars"></div>

                </div>
            `);

            starTypes.forEach(st => {
                let count = kid.stars[st.name] || 0;

                let block = $(`
                    <div style="margin-top:18px">

                        <div style="display:flex; align-items:center; gap:10px;">
                            <div class="star-icon" style="font-size:28px; color:${st.colour}">★</div>
                            <b>${st.name}</b> (${st.meaning}): ${count}
                        </div>

                        <div class="star-controls">
                            <button class="pm-btn" data-type="${st.name}" data-i="${i}" data-op="minus" style="background:${st.colour};">-</button>
                            <button class="pm-btn" data-type="${st.name}" data-i="${i}" data-op="plus" style="background:${st.colour};">+</button>
                        </div>

                        <div class="tick-row"></div>

                    </div>
                `);

                let ticks = "";
                let sets = Math.floor(count / st.needed);
                for (let t = 0; t < sets; t++) ticks += `<span style="color:${st.colour};">✓</span>`;
                block.find(".tick-row").html(ticks);

                card.find(".kid-stars").append(block);
            });

            $("#kidsList").append(card);
        });
    }

    //---------------------------------------------------
    // KID CONTROLS
    //---------------------------------------------------
    $(document).on("click", ".kid-controls button, .kid-card button", function () {
        let i = $(this).data("i");
        let action = $(this).data("action");

        if (action === "del") {
            if (confirm("Delete this kid?")) {
                kids.splice(i,1);
                save(); renderKids();
            }
            return;
        }

        if (action === "edit") {
            $(`#editKid_${i}`).slideDown();
            return;
        }

        if (action === "cancelKid") {
            $(`#editKid_${i}`).slideUp();
            return;
        }

        if (action === "saveKid") {
            let newName = $(`#editKidName_${i}`).val().trim();
            if (newName) {
                kids[i].name = newName;
                save(); renderKids();
            }
            return;
        }

        if (action === "up" && i > 0) {
            [kids[i], kids[i-1]] = [kids[i-1], kids[i]];
            save(); renderKids();
            return;
        }

        if (action === "down" && i < kids.length - 1) {
            [kids[i], kids[i+1]] = [kids[i+1], kids[i]];
            save(); renderKids();
            return;
        }
    });

    //---------------------------------------------------
    // STAR +/-
    //---------------------------------------------------
    $(document).on("click", ".pm-btn", function () {
        let i = $(this).data("i");
        let type = $(this).data("type");
        let op = $(this).data("op");

        if (op === "plus") kids[i].stars[type]++;
        if (op === "minus" && kids[i].stars[type] > 0) kids[i].stars[type]--;

        save(); renderKids();
    });

    //---------------------------------------------------
    // RENDER STAR TYPES
    //---------------------------------------------------
    function renderStarTypes() {

        $("#starTypesList").html("");

        starTypes.forEach((st, i) => {

            let card = $(`
                <div class="card starTypeCard">

                    <div class="starTypeHeader">
                        <div style="display:flex; gap:8px; align-items:center;">
                            <div class="star-icon" style="font-size:28px; color:${st.colour}">★</div>
                            <b>${st.name}</b> (${st.meaning}) — Prize at ${st.needed}
                        </div>

                        <div class="starTypeButtons">
                            <button class="btn small" data-action="editStar" data-i="${i}">Edit</button>
                            <button class="btn small danger" data-action="delStar" data-i="${i}">Delete</button>
                        </div>
                    </div>

                    <div id="editStar_${i}" style="display:none; margin-top:12px;">

                        <label for="editStarName_${i}">Name</label>
                        <input class="input-text" id="editStarName_${i}" value="${st.name}">

                        <label for="editStarMeaning_${i}">Meaning</label>
                        <input class="input-text" id="editStarMeaning_${i}" value="${st.meaning}">

                        <label for="editStarNeeded_${i}">Needed</label>
                        <input class="input-text" id="editStarNeeded_${i}" type="number" value="${st.needed}">

                        <label for="editStarColour_${i}">Colour</label>
                        <div class="colour-picker">
                            <div class="colour-circle" id="editPrev_${i}" style="background:${st.colour};"></div>
                            <input type="color" id="editStarColour_${i}" value="${st.colour}">
                        </div>

                        <button class="btn primary small" data-action="saveStar" data-i="${i}">Save</button>
                        <button class="btn small danger" data-action="cancelStar" data-i="${i}">Cancel</button>

                    </div>

                </div>
            `);

            $("#starTypesList").append(card);
        });
    }

    //---------------------------------------------------
    // STAR TYPE ACTIONS
    //---------------------------------------------------
    $(document).on("click","#starTypesList button",function(){
        let i = $(this).data("i");
        let action = $(this).data("action");

        if (action === "delStar") {
            if (confirm("Delete this star type?")) {
                let old = starTypes[i].name;
                starTypes.splice(i,1);

                kids.forEach(k => delete k.stars[old]);

                save(); renderStarTypes(); renderKids();
            }
            return;
        }

        if (action === "editStar") {
            $(`#editStar_${i}`).slideDown();
            return;
        }

        if (action === "cancelStar") {
            $(`#editStar_${i}`).slideUp();
            return;
        }

        if (action === "saveStar") {

            let newName = $(`#editStarName_${i}`).val().trim();
            let newMeaning = $(`#editStarMeaning_${i}`).val().trim();
            let newNeeded = parseInt($(`#editStarNeeded_${i}`).val());
            let newColour = $(`#editStarColour_${i}`).val();

            if (!newName || !newMeaning || !newNeeded) return;

            // fix mapping BEFORE re-render
            let oldName = starTypes[i].name;

            starTypes[i] = {
                name: newName,
                meaning: newMeaning,
                needed: newNeeded,
                colour: newColour
            };

            kids.forEach(k => {
                let oldVal = k.stars[oldName];
                delete k.stars[oldName];
                k.stars[newName] = oldVal;
            });

            save();
            renderStarTypes();
            renderKids();
        }
    });

    //---------------------------------------------------
    // INITIAL LOAD
    //---------------------------------------------------
    renderKids();
    renderStarTypes();

});
