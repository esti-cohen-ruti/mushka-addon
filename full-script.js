(() => {
    // כתובת הקובץ JSON עם ההגדרות בגיטהאב (אפשר לשנות בקלות)
    const configUrl = "https://raw.githubusercontent.com/esti-cohen-ruti/-/main/קובץ.json";

    // מילון אימוג'ים לדוגמה (אפשר להרחיב)
    const emojiMap = {
        smile: "😄",
        heart: "❤️",
        fire: "🔥",
        boom: "💥",
        cool: "😎",
        bowtie: "🤵",
        clap: "👏",
        poop: "💩",
        tada: "🎉",
        angry: "😠",
    };

    // משתנים פנימיים לניהול ההתראות
    let config = null;
    let alertsSentToday = 0;
    const maxAlertsPerDayDefault = 1;

    // הורדת קובץ ההגדרות והפעלתו
    async function loadConfig() {
        try {
            const res = await fetch(configUrl);
            if (!res.ok) throw new Error("שגיאה בטעינת הקונפיג");
            config = await res.json();
            if (!config) throw new Error("קונפיג ריק");
            if (!config.maxAlertsPerDay) config.maxAlertsPerDay = maxAlertsPerDayDefault;
            console.log("קונפיג נטען:", config);
        } catch (e) {
            console.warn("טעינת קונפיג נכשלה, משתמש בברירת מחדל", e);
            // ברירת מחדל
            config = {
                alertTime: "16:45",
                alertText: "יאללה, צא לישיבה עכשיו! 😇",
                alertTitle: "הודעה חשובה",
                alertSubTitle: "זה הזמן לעלות לישיבה",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                textColor: "#fff",
                fontSize: "20px",
                maxAlertsPerDay: maxAlertsPerDayDefault,
            };
        }
    }

    // מחזיר true אם יש כבר הודעה היום
    function canSendAlert() {
        const lastSentDate = localStorage.getItem("lastAlertDate") || "";
        const today = new Date().toISOString().slice(0, 10);
        if (lastSentDate !== today) {
            alertsSentToday = 0;
            localStorage.setItem("lastAlertDate", today);
        }
        return alertsSentToday < config.maxAlertsPerDay;
    }

    // מסמן שהודעה נשלחה
    function markAlertSent() {
        alertsSentToday++;
    }

    // מראה פופאפ עם ההודעה, לכיסוי כל הדף
    function showPopup() {
        if (document.getElementById("mushka-popup")) return; // אם כבר פתוח, אל תפתח שוב

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

        // כותרת
        const title = document.createElement("h1");
        title.innerText = config.alertTitle;
        popup.appendChild(title);

        // כותרת משנה
        const subTitle = document.createElement("h3");
        subTitle.innerText = config.alertSubTitle;
        popup.appendChild(subTitle);

        // טקסט הודעה
        const text = document.createElement("p");
        text.innerText = config.alertText;
        popup.appendChild(text);

        // כפתור סגירה
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "סגור";
        Object.assign(closeBtn.style, {
            marginTop: "20px",
            fontSize: "18px",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#eee",
            color: "#333",
            userSelect: "auto",
        });
        closeBtn.onclick = () => {
            popup.remove();
        };
        popup.appendChild(closeBtn);

        document.body.appendChild(popup);
    }

    // מחזיר את השעה כ-string "HH:MM"
    function getCurrentTimeStr() {
        const d = new Date();
        const h = d.getHours().toString().padStart(2, "0");
        const m = d.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    // בודק אם הגיע זמן ההתראה
    function checkAlertTime() {
        if (!config) return;

        const now = getCurrentTimeStr();

        if (now === config.alertTime && canSendAlert()) {
            showPopup();
            markAlertSent();
        }
    }

    // מחליף מילים עם :שם_אימוגי: לאימוג'ים
    // רק פסיק אחד לפני ואחרי, לא כפול (::)
    function replaceEmojisInInput(input) {
        const regex = /:([a-zA-Z0-9_+-]+):/g;
        input.value = input.value.replace(regex, (match, p1) => {
            return emojiMap[p1] || match;
        });
    }

    // מאזין לכל תיבות הטקסט ומחליף את האימוג'ים בזמן אמת
    function listenEmojiInputs() {
        document.body.addEventListener("input", (e) => {
            const el = e.target;
            if (
                el.tagName === "INPUT" && (el.type === "text" || el.type === "search") ||
                el.tagName === "TEXTAREA" ||
                el.isContentEditable
            ) {
                replaceEmojisInInput(el);
            }
        });
    }

    // לוגיקה ראשונית
    async function init() {
        await loadConfig();
        listenEmojiInputs();

        // בדיקת זמן כל דקה
        setInterval(checkAlertTime, 60 * 1000);

        // גם לבדיקה ראשונית ברגע הטעינה
        checkAlertTime();
    }

    init();
})();
