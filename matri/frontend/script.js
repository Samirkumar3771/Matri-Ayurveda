


console.log("script loaded");

// =================== BACKEND API CONFIG ===================
const API = "https://matri-backend.onrender.com";

// =================== LOGIN / SIGNUP HANDLERS ===================
async function signup(e) {
    e.preventDefault();
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Signup Successful!");
        window.location.href = "login.html";
    } else {
        alert(data.msg);
    }
}

async function login(e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        alert("Login Successful!");
        window.location.href = "index.html";
    } else {
        alert(data.msg);
    }
    
}

// =================== BIND FORMS IF PRESENT ===================
(() => {
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", signup);
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", login);
    }
})();

// =================== AOS INIT ===================
(() => {
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 700,
            once: true,
            easing: 'ease-out'
        });
    }
})();

// =================== GSAP HERO ANIMATION ===================
window.addEventListener('load', () => {
    if (typeof gsap !== "undefined") {
        gsap.from('.brand', { y: -18, opacity: 0, duration: .6 });
        gsap.from('.hero .kicker', { y: 10, opacity: 0, duration: .6, delay: .1 });
        gsap.from('h1', { y: 14, opacity: 0, duration: .7, delay: .2 });
        gsap.from('.hero p', { y: 14, opacity: 0, duration: .7, delay: .3 });
        gsap.from('.hero-actions', { y: 14, opacity: 0, duration: .7, delay: .4 });
        gsap.from('.hero-img', { scale: .96, opacity: 0, duration: .9, delay: .35 });
    }
});
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "home.html";
}


// =================== ACTIVE NAV HIGHLIGHT ===================
(() => {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.links a');

    if (sections.length && links.length) {
        const linkMap = {};
        links.forEach(a => linkMap[a.getAttribute('href')?.replace('#', '')] = a);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(a => a.style.color = 'var(--muted)');
                    const id = entry.target.id;
                    if (linkMap[id]) linkMap[id].style.color = 'var(--sun)';
                }
            });
        }, { threshold: .5 });

        sections.forEach(section => observer.observe(section));
    }
})();

// =================== APPOINTMENT BOOKING (REAL BACKEND) ===================
async function handleBooking(ev) {
    ev.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first!");
        return window.location.href = "login.html";
    }

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const service = document.getElementById('service')?.value;
    const date = document.getElementById('date')?.value;
    const time = document.getElementById('time')?.value;
    const message = document.getElementById('message')?.value.trim();
    const result = document.getElementById('result');

    if (!name || !email || !phone || !service || !date || !time) {
        if (result) {
            result.style.color = 'var(--error)';
            result.textContent = 'Please complete all required fields.';
        }
        return;
    }

    const payload = { name, email, phone, service, date, time, message };

    try {
        const res = await fetch("http://localhost:5000/api/appointments/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            if (result) {
                result.style.color = 'var(--leaf-2)';
                result.textContent = data.msg || "Appointment booked!";
            }
            ev.target.reset();
        } else {
            alert(data.msg || "Booking failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error, please try again later.");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const display = document.getElementById("userDisplay");

    if (userName && display) {
        display.textContent = "👋 " + userName;
    }
});

// =================== FOOTER YEAR ===================
(() => {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
})();
