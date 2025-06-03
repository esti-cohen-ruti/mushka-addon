(() => {
    // 🧠 כל ההגדרות כאן במקום אחד!
    const config = {
        alertTime: "00:58", // 🕓 תשנה לשעה שאתה רוצה שהפופאפ יקפוץ (בפורמט HH:MM)
        alertText: "יאללה, צא לישיבה עכשיו! 😇",
        alertTitle: "הודעה חשובה",
        alertSubTitle: "זה הזמן לעלות לישיבה",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        textColor: "#ffffff",
        fontSize: "22px",
        maxAlertsPerDay: 1,
    };

    // 📦 מילון האימוג'ים
    const emojiMap = {
        חח: "😄",
        לב: "❤️",
        אש: "🔥",
        בום: "💥",
        מגניב: "😎",
        bowtie: "🤵",
        clap: "👏",
        poop: "💩",
        tada: "🎉",
        עצבני: "😠",
    };

    // 🧮 ניהול שליחה יומית
    let alertsSentToday = 0;

    function canSendAlert() {
        const today = new Date().toISOString().slice(0, 10);
        const lastSent = localStorage.getItem("lastAlertDate");
        if (lastSent !== today) {
            localStorage.setItem("lastAlertDate", today);
            alertsSentToday = 0;
        }
        return alertsSentToday < config.maxAlertsPerDay;
    }

    function markAlertSent() {
        alertsSentToday++;
    }

    // 📢 הפופאפ עצמו
    function showPopup() {
        if (document.getElementById("mushka-popup")) return;

        const popup = document.createElement("div");
        popup.id = "mushka-popup";
        Object.assign(popup.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: config.backgroundColor,
            color: config.textColor,
            fontSize: config.fontSize,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999999",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box",
            backdropFilter: "blur(5px)",
            userSelect: "none",
        });

        const title = document.createElement("h1");
        title.innerText = config.alertTitle;
        popup.appendChild(title);

        const subTitle = document.createElement("h3");
        subTitle.innerText = config.alertSubTitle;
        popup.appendChild(subTitle);

        const text = document.createElement("p");
        text.innerText = config.alertText;
        popup.appendChild(text);

        const closeBtn = document.createElement("button");
        closeBtn.innerText = "סגור";
        Object.assign(closeBtn.style, {
            marginTop: "20px",
            fontSize: "18px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#eee",
            color: "#333",
        });
        closeBtn.onclick = () => popup.remove();
        popup.appendChild(closeBtn);

        document.body.appendChild(popup);
    }

    // 🕒 מחזיר שעה נוכחית בפורמט HH:MM
    function getCurrentTimeStr() {
        const d = new Date();
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }

    // ⏰ בודק האם צריך להקפיץ הודעה
    function checkAlertTime() {
        if (getCurrentTimeStr() === config.alertTime && canSendAlert()) {
            showPopup();
            markAlertSent();
        }
    }

    // 😄 ממיר :אימוגי: לטקסט
    function replaceEmojisInInput(input) {
        const regex = /:([a-zA-Z0-9_+-]+):/g;
        input.value = input.value.replace(regex, (match, p1) => emojiMap[p1] || match);
    }

    // 🧠 מאזין להזנת טקסט ומחליף אימוג'ים בלייב
    function listenEmojiInputs() {
        document.body.addEventListener("input", (e) => {
            const el = e.target;
            if (
                (el.tagName === "INPUT" && (el.type === "text" || el.type === "search")) ||
                el.tagName === "TEXTAREA" ||
                el.isContentEditable
            ) {
                replaceEmojisInInput(el);
            }
        });
    }

    // 🚀 התחלה
    function init() {
        listenEmojiInputs();
        checkAlertTime();
        setInterval(checkAlertTime, 60 * 1000);
    }

    init();
})();
