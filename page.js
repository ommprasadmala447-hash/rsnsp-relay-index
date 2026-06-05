const method = document.getElementById("method");

const sections = {
    incremental: document.getElementById("incrementalSection"),
    polar: document.getElementById("polarSection"),
    rectangular: document.getElementById("rectangularSection"),
    direct: document.getElementById("directSection")
};

// ==============================
// SHOW/HIDE SECTIONS
// ==============================
method.addEventListener("change", () => {
    Object.values(sections).forEach(section => {
        section.classList.add("hidden");
    });

    sections[method.value].classList.remove("hidden");
});

// ==============================
// COMPLEX NUMBER PARSER
// ==============================
function parseComplex(str) {
    str = str.replace(/\s+/g, "");

    if (!str.includes("j")) {
        return { real: parseFloat(str), imag: 0 };
    }

    str = str.replace("j", "");

    if (str === "" || str === "+") return { real: 0, imag: 1 };
    if (str === "-") return { real: 0, imag: -1 };

    let index = -1;

    for (let i = 1; i < str.length; i++) {
        if (str[i] === "+" || str[i] === "-") {
            index = i;
        }
    }

    if (index === -1) {
        return { real: 0, imag: parseFloat(str) };
    }

    return {
        real: parseFloat(str.substring(0, index)),
        imag: parseFloat(str.substring(index))
    };
}

// ==============================
// COMPLEX OPERATIONS
// ==============================
function subtract(a, b) {
    return {
        real: a.real - b.real,
        imag: a.imag - b.imag
    };
}

function conjugate(a) {
    return {
        real: a.real,
        imag: -a.imag
    };
}

function multiply(a, b) {
    return {
        real: (a.real * b.real) - (a.imag * b.imag),
        imag: (a.real * b.imag) + (a.imag * b.real)
    };
}

// ==============================
// POLAR TO RECTANGULAR
// ==============================
function polarToComplex(mag, angleDeg) {
    let angleRad = angleDeg * Math.PI / 180;

    return {
        real: mag * Math.cos(angleRad),
        imag: mag * Math.sin(angleRad)
    };
}

// ==============================
// MAIN CALCULATION
// ==============================
function calculate() {

    let Pm2, Pn2;
    let selected = method.value;

    // ================= DIRECT =================
    if (selected === "direct") {

        let inputs = document.querySelectorAll("#directSection input");

        Pm2 = parseFloat(inputs[0].value);
        Pn2 = parseFloat(inputs[1].value);
    }

    // ================= INCREMENTAL =================
    else if (selected === "incremental") {

        let inputs = document.querySelectorAll("#incrementalSection input");

        let Vm2 = subtract(
            parseComplex(inputs[0].value),
            parseComplex(inputs[1].value)
        );

        let Im2 = subtract(
            parseComplex(inputs[2].value),
            parseComplex(inputs[3].value)
        );

        let Vn2 = subtract(
            parseComplex(inputs[4].value),
            parseComplex(inputs[5].value)
        );

        let In2 = subtract(
            parseComplex(inputs[6].value),
            parseComplex(inputs[7].value)
        );

        let Sm2 = multiply(Vm2, conjugate(Im2));
        let Sn2 = multiply(Vn2, conjugate(In2));

        Pm2 = Sm2.real;
        Pn2 = Sn2.real;
    }

    // ================= POLAR =================
    else if (selected === "polar") {

        let inputs = document.querySelectorAll("#polarSection input");

        let Vm2 = polarToComplex(
            parseFloat(inputs[0].value),
            parseFloat(inputs[1].value)
        );

        let Im2 = polarToComplex(
            parseFloat(inputs[2].value),
            parseFloat(inputs[3].value)
        );

        let Vn2 = polarToComplex(
            parseFloat(inputs[4].value),
            parseFloat(inputs[5].value)
        );

        let In2 = polarToComplex(
            parseFloat(inputs[6].value),
            parseFloat(inputs[7].value)
        );

        let Sm2 = multiply(Vm2, conjugate(Im2));
        let Sn2 = multiply(Vn2, conjugate(In2));

        Pm2 = Sm2.real;
        Pn2 = Sn2.real;
    }

    // ================= RECTANGULAR =================
    else if (selected === "rectangular") {

        let inputs = document.querySelectorAll("#rectangularSection input");

        let Vm2 = parseComplex(inputs[0].value);
        let Im2 = parseComplex(inputs[1].value);
        let Vn2 = parseComplex(inputs[2].value);
        let In2 = parseComplex(inputs[3].value);

        let Sm2 = multiply(Vm2, conjugate(Im2));
        let Sn2 = multiply(Vn2, conjugate(In2));

        Pm2 = Sm2.real;
        Pn2 = Sn2.real;
    }

    // ================= ΔPmin =================
    if (Pm2 == null || Pn2 == null) {
        alert("Invalid inputs");
        return;
    }

    let Pmin;

    if (Math.abs(Pm2) < Math.abs(Pn2)) {
        Pmin = Pm2;
    } else if (Math.abs(Pn2) < Math.abs(Pm2)) {
        Pmin = Pn2;
    } else {
        Pmin = Pm2;
    }

    // ================= ZERO CHECK =================
    if (Math.abs(Pmin) < 1e-12) {
        alert("ΔPmin is 0. Division not possible.");
        return;
    }

    // ================= FINAL RSNSP =================
    let RSNSP = (Pm2 + Pn2) / Pmin;

    // ================= OUTPUT =================
    document.getElementById("pm2").innerText = Pm2.toFixed(4);
    document.getElementById("pn2").innerText = Pn2.toFixed(4);
    document.getElementById("pmin").innerText = Pmin.toFixed(4);
    document.getElementById("rsnsp").innerText = RSNSP.toFixed(4);
}