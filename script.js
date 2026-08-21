const questionPage = document.getElementById("questionPage");
const datePage = document.getElementById("datePage");
const thankYouPage = document.getElementById("thankYouPage");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const confirmBtn = document.getElementById("confirmBtn");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");

// Google Form details from the pre-filled link
const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScX3qaJi3GDNvdWj7LuoXij7TrAqjImN77jUuY_i4nul1Ocbg/formResponse";

const ENTRY_ANSWER = "entry.181553961";
const ENTRY_DATE = "entry.187835145";
const ENTRY_TIME = "entry.995725818";

// Make the NO button run away.
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

function moveNoButton() {
  const maxX = Math.max(20, window.innerWidth - noBtn.offsetWidth - 20);
  const maxY = Math.max(20, window.innerHeight - noBtn.offsetHeight - 20);

  noBtn.style.position = "fixed";
  noBtn.style.left = Math.random() * maxX + "px";
  noBtn.style.top = Math.random() * maxY + "px";

  const messages = [
    "Are you sure? 🙈",
    "Try YES ❤️",
    "Nope 😂",
    "Think again 👀",
    "Wrong button 😌",
    "YES is right there 👉❤️"
  ];

  noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];
}

yesBtn.addEventListener("click", () => {
  questionPage.classList.remove("active");

  setTimeout(() => {
    datePage.classList.add("active");
    noBtn.style.position = "relative";
    noBtn.style.left = "auto";
    noBtn.style.top = "auto";
    noBtn.textContent = "NO 🙈";
  }, 250);
});

confirmBtn.addEventListener("click", submitResponse);

async function submitResponse() {
  const date = dateInput.value;
  const time = timeInput.value;

  if (!date || !time) {
    alert("Please choose both a date and a time ❤️");
    return;
  }

  confirmBtn.disabled = true;
  confirmBtn.textContent = "Saving... ❤️";

  // Google Forms accepts submissions through formResponse.
  const formData = new URLSearchParams();
  formData.append(ENTRY_ANSWER, "yes");
  formData.append(ENTRY_DATE, date);
  formData.append(ENTRY_TIME, time);

  try {
    // no-cors is intentional: Google Forms does not need to return data to us.
    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });
  } catch (error) {
    // Still show the final page. Google Forms commonly accepts the request
    // despite the browser being unable to read its response because of CORS.
    console.log("Google Forms submission sent.", error);
  }

  const selectedDate = new Date(date + "T00:00:00");

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const formattedTime = new Date("1970-01-01T" + time).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

  document.getElementById("selectedDate").textContent = formattedDate;
  document.getElementById("selectedTime").textContent = formattedTime;

  datePage.classList.remove("active");

  setTimeout(() => {
    thankYouPage.classList.add("active");
    createHearts();
  }, 300);
}

function createHearts() {
  const container = document.querySelector(".hearts");

  for (let i = 0; i < 25; i++) {
    const heart = document.createElement("div");

    heart.textContent = "❤️";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = Math.random() * 100 + "%";
    heart.style.fontSize = 10 + Math.random() * 20 + "px";
    heart.style.opacity = ".4";
    heart.style.animation =
      "float " + (2 + Math.random() * 3) + "s infinite ease-in-out";

    container.appendChild(heart);
  }
}
