/** @format */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    Timestamp,
    query,
    orderBy,
    doc,
    deleteDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBCbKf72aiOBE7mptTEB4c_Sxmj-R8V8_Y",
    authDomain: "studentrecords-5531a.firebaseapp.com",
    projectId: "studentrecords-5531a",
    storageBucket: "studentrecords-5531a.appspot.com",
    messagingSenderId: "510964334379",
    appId: "1:510964334379:web:e382816d5a4585acef4f6e",
    measurementId: "G-FV11C5GZRH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

onSnapshot(
    query(collection(db, "chats"), orderBy("createdAt", "asc")),
    (snapshot) => {
        const chatSection = document.querySelector("section#chatSection");
        chatSection.innerHTML = "";

        snapshot.forEach((chat) => {
            const id = chat.id;
            const { sender, message, createdAt } = chat.data();

            createChatBox({ sender, message, id, createdAt });
            document
                .querySelector("section#chatSection")
                .scrollTo(
                    0,
                    document.querySelector("section#chatSection").scrollHeight
                );
        });
    }
);

const nameInput = document.querySelector("#name");
const nameButton = document.querySelector("#nameButton");

const chatInput = document.querySelector("#chatInput");
const chatButton = document.querySelector("#chatButton");

if (!localStorage.getItem("name")) {
    chatButton.disabled = true;
    chatButton.classList.add("cursor-not-allowed", "opacity-50");
    console.log("disabled");
    chatInput.placeholder = "Please enter your name first";
    chatInput.disabled = true;
} else {
    chatInput.placeholder = "Enter your message";
    chatInput.disabled = false;
    chatButton.disabled = false;
    greetUser();
}

chatButton.addEventListener("click", () => {
    if (!chatInput.value.trim() === "") {
        chatInput.classList.add(
            "border-red-500",
            "border-2",
            "animate-pulse",
            "transition-all",
            "duration-300"
        );
        return;
    }

    // createChatBox({
    //     sender: localStorage.getItem("name"),
    //     message: chatInput.value.trim(),
    // });

    addDoc(collection(db, "chats"), {
        sender: localStorage.getItem("name"),
        message: chatInput.value.trim(),
        createdAt: Timestamp.fromDate(new Date()),
    });
    chatInput.value = "";
});
nameInput.addEventListener("input", () => {
    nameInput.classList.remove(
        "border-red-500",
        "border-2",
        "animate-pulse",
        "transition-all",
        "duration-300"
    );
});

nameButton.addEventListener("click", () => {
    if (nameInput.value === "") {
        nameInput.classList.add(
            "border-red-500",
            "border-2",
            "animate-pulse",
            "transition-all",
            "duration-300"
        );
        return;
    }

    chatButton.disabled = false;
    chatButton.classList.remove("cursor-not-allowed", "opacity-50");
    chatInput.placeholder = "Enter your message";
    chatInput.disabled = false;

    localStorage.setItem("name", nameInput.value);
    greetUser();
});

nameInput.addEventListener("input", () => {
    nameInput.classList.remove(
        "border-red-500",
        "border-2",
        "animate-pulse",
        "transition-all",
        "duration-300"
    );
});

function createChatBox({ sender, message, id, createdAt }) {

    const chatSection = document.querySelector("section#chatSection");
    chatSection.setAttribute("id", "chatSection");
    // hh:mm AM/PM
    const time = createdAt.toDate().toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }
    );
    // Month and day
    const date = createdAt.toDate().toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
        }
    )
    const timeAndDateElement = document.createElement("span");
    timeAndDateElement.innerHTML = `<br>${date} | ${time}`;
    timeAndDateElement.className = `
        text-xs 
        text-right 
        ${sender === localStorage.getItem("name") ? "text-slate-300" : "text-slate-500"}`;
    console.log(date, time)
    
    const chatBox = document.createElement("div");
    chatBox.className = "sm:w-1/2 w-[300px] border border-slate-500 rounded-md p-2 my-2";
    if (sender === localStorage.getItem("name")) {
        chatBox.classList.add("ml-auto", "bg-blue-500");
        chatBox.classList.remove("bg-slate-100", "border-slate-500");
    }

    const senderElement = document.createElement("h4");
    senderElement.className = `text-black text-slate-900 text-lg
    ${sender === localStorage.getItem("name") ? "text-white" : "text-slate-800"}
    `;
    senderElement.innerText = sender;

    const messageElement = document.createElement("span");
    messageElement.className = `text-sm 
    ${sender === localStorage.getItem("name") ? "text-white" : "text-slate-800"}
    `;
    messageElement.innerText = message;

    chatBox.appendChild(senderElement);
    chatBox.appendChild(messageElement);
    chatBox.appendChild(timeAndDateElement);

    chatSection.appendChild(chatBox);
}

function greetUser() {
    const name = localStorage.getItem("name");
    const nameSection = document.querySelector("section#nameSection");

    while (nameSection.firstChild) {
        nameSection.removeChild(nameSection.firstChild);
    }

    const greeting = document.createElement("h1");
    greeting.className = "text-2xl text-slate-800";
    greeting.innerText = `Welcome ${name}`;
    nameSection.appendChild(greeting);
}
