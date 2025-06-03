(() => {
    // ======= הגדרות ראשיות =======
    const CONFIG = {
        // זמן ההתראה (24 שעות)
        alertTime: "01:21",
        
        // תוכן הפופאפ
        alertTitle: "הודעה חשובה!",
        alertSubTitle: "זה הזמן לעלות לישיבה!",
        alertText: "יאללה, צא לישיבה עכשיו! 😇",
        
        // עיצוב הפופאפ
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#fff",
        fontSize: "22px",
        titleFontSize: "32px",
        subTitleFontSize: "24px",
        
        // משפטים לאימות סגירה (יבחר אחד באקראי)
        closePhrases: [
            "אני מבטיח לעלות לישיבה",
            "כבר יוצא מהמקום",
            "תן לי עוד דקה אחת",
            "בסדר כבר הבנתי",
            "אוקיי אוקיי אני הולך"
        ],
        
        // תגובות מצחיקות לטקסט שגוי
        funnyResponses: [
            "לא לא לא! תנסה שוב 😏",
            "אה אה אה, לא ככה! 🙄",
            "טעות! תקליד נכון הפעם 😤",
            "בואנה, תתרכז קצת! 🤨",
            "שגוי! נסה עוד פעם 😂",
            "לא נכון! אולי תקליד יותר לאט? 🐌"
        ]
    };

    // ======= מילון אימוג'ים =======
    const EMOJI_MAP = {
        // עברית
        חח: "😄",
        לב: "❤️",
        אש: "🔥",
        בום: "💥",
        מגניב: "😎",
        עצבני: "😠",
        כעס: "😡",
        צחוק: "😂",
        חיוך: "😊",
        עין: "😉",
        לשון: "😛",
        נשיקה: "😘",
        מחשבה: "🤔",
        חכם: "🤓",
        מגניב: "😎",
        עייף: "😴",
        בכי: "😢",
        פחד: "😨",
        הפתעה: "😱",
        טירוף: "🤪",
        
        // אנגלית
        heart: "❤️",
        fire: "🔥",
        boom: "💥",
        cool: "😎",
        laugh: "😂",
        cry: "😢",
        angry: "😠",
        love: "😍",
        kiss: "😘",
        wink: "😉",
        tongue: "😛",
        think: "🤔",
        nerd: "🤓",
        sleep: "😴",
        scared: "😱",
        crazy: "🤪",
        clap: "👏",
        tada: "🎉",
        poop: "💩",
        bowtie: "🤵",
        
        // סימנים
        כוכב: "⭐",
        חץ: "➡️",
        צ'ק: "✅",
        איקס: "❌",
        שאלה: "❓",
        קריאה: "❗",
        זהירות: "⚠️",
        אסור: "🚫"
    };

    // ======= משתנים גלובליים =======
    let currentPopup = null;
    let currentValidationPhrase = "";

    // ======= פונקציות עזר =======
    
    // מחזיר את השעה הנוכחית כ-string "HH:MM"
    function getCurrentTimeStr() {
        const d = new Date();
        const h = d.getHours().toString().padStart(2, "0");
        const m = d.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    // בוחר משפט אקראי מהרשימה
    function getRandomPhrase() {
        const phrases = CONFIG.closePhrases;
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    // בוחר תגובה מצחיקה אקראית
    function getRandomFunnyResponse() {
        const responses = CONFIG.funnyResponses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // מונע העתק-הדבק בשדה הטקסט
    function preventCopyPaste(input) {
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            showFunnyResponse("אי אי אי! לא לעשות העתק-הדבק! 😤");
        });
        
        input.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        input.addEventListener('keydown', (e) => {
            // מונע Ctrl+V, Ctrl+C, Ctrl+X
            if (e.ctrlKey && (e.key === 'v' || e.key === 'c' || e.key === 'x')) {
                e.preventDefault();
                showFunnyResponse("בלי קיצורי מקלדת! תקליד בעצמך! 😏");
            }
        });
    }

    // מציג תגובה מצחיקה באזור ההודעות
    function showFunnyResponse(message) {
        const responseArea = document.getElementById('response-area');
        if (responseArea) {
            responseArea.innerHTML = `<div style="color: #ff6b6b; font-weight: bold; margin-top: 10px;">${message}</div>`;
            setTimeout(() => {
                responseArea.innerHTML = '';
            }, 3000);
        }
    }

    // יוצר ומציג את הפופאפ
    function showPopup() {
        // אם כבר יש פופאפ פתוח, אל תפתח שוב
        if (currentPopup) return;

        // בוחר משפט אימות אקראי
        currentValidationPhrase = getRandomPhrase();

        // יוצר את הפופאפ
        const popup = document.createElement("div");
        popup.id = "mushka-popup";
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${CONFIG.backgroundColor};
            color: ${CONFIG.textColor};
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            text-align: center;
            padding: 40px;
            box-sizing: border-box;
            backdrop-filter: blur(10px);
            user-select: none;
            animation: fadeIn 0.5s ease-in-out;
        `;

        // מוסיף CSS לאנימציה
        if (!document.getElementById('popup-styles')) {
            const style = document.createElement('style');
            style.id = 'popup-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        // כותרת ראשית
        const title = document.createElement("h1");
        title.innerHTML = CONFIG.alertTitle;
        title.style.cssText = `
            font-size: ${CONFIG.titleFontSize};
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-weight: bold;
        `;
        popup.appendChild(title);

        // כותרת משנה
        const subTitle = document.createElement("h2");
        subTitle.innerHTML = CONFIG.alertSubTitle;
        subTitle.style.cssText = `
            font-size: ${CONFIG.subTitleFontSize};
            margin-bottom: 30px;
            opacity: 0.9;
        `;
        popup.appendChild(subTitle);

        // טקסט הודעה עיקרי
        const text = document.createElement("p");
        text.innerHTML = CONFIG.alertText;
        text.style.cssText = `
            font-size: ${CONFIG.fontSize};
            margin-bottom: 40px;
            line-height: 1.5;
        `;
        popup.appendChild(text);

        // הוראות לסגירה
        const instructions = document.createElement("div");
        instructions.innerHTML = `
            <p style="font-size: 18px; margin-bottom: 20px; opacity: 0.8;">
                כדי לסגור את ההודעה, תקליד את המשפט הבא בדיוק:
            </p>
            <div style="
                background: rgba(255,255,255,0.2);
                padding: 15px;
                border-radius: 10px;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                border: 2px dashed rgba(255,255,255,0.5);
            ">
                "${currentValidationPhrase}"
            </div>
        `;
        popup.appendChild(instructions);

        // שדה הקלדה
        const inputContainer = document.createElement("div");
        inputContainer.style.cssText = "margin-bottom: 20px; width: 100%; max-width: 500px;";
        
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "הקלד כאן את המשפט...";
        input.style.cssText = `
            width: 100%;
            padding: 15px;
            font-size: 18px;
            border: none;
            border-radius: 10px;
            text-align: center;
            background: rgba(255,255,255,0.9);
            color: #333;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        `;
        
        preventCopyPaste(input);
        inputContainer.appendChild(input);
        popup.appendChild(inputContainer);

        // אזור תגובות
        const responseArea = document.createElement("div");
        responseArea.id = "response-area";
        responseArea.style.cssText = "min-height: 30px; margin-bottom: 20px;";
        popup.appendChild(responseArea);

        // כפתור בדיקה
        const checkBtn = document.createElement("button");
        checkBtn.innerHTML = "בדוק ✓";
        checkBtn.style.cssText = `
            font-size: 18px;
            padding: 12px 30px;
            margin: 0 10px;
            cursor: pointer;
            border-radius: 25px;
            border: none;
            background: #28a745;
            color: white;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        checkBtn.onmouseover = () => {
            checkBtn.style.background = "#218838";
            checkBtn.style.transform = "translateY(-2px)";
        };
        checkBtn.onmouseout = () => {
            checkBtn.style.background = "#28a745";
            checkBtn.style.transform = "translateY(0)";
        };
        
        checkBtn.onclick = () => {
            const userInput = input.value.trim();
            if (userInput === currentValidationPhrase) {
                // נכון! נסגור את הפופאפ
                popup.style.animation = "fadeOut 0.3s ease-in-out";
                setTimeout(() => {
                    popup.remove();
                    currentPopup = null;
                }, 300);
            } else {
                // שגוי! נציג תגובה מצחיקה
                const funnyResponse = getRandomFunnyResponse();
                showFunnyResponse(funnyResponse);
                input.classList.add('shake');
                input.value = '';
                input.focus();
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 500);
            }
        };

        // מאפשר אנטר לבדיקה
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkBtn.click();
            }
        });

        popup.appendChild(checkBtn);

        // מוסיף לדף ושומר רפרנס
        document.body.appendChild(popup);
        currentPopup = popup;
        
        // פוקוס על שדה הקלדה
        setTimeout(() => input.focus(), 100);

        // מוסיף CSS נוסף לאנימציית יציאה
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }

    // בודק אם הגיע זמן ההתראה
    function checkAlertTime() {
        const now = getCurrentTimeStr();
        if (now === CONFIG.alertTime) {
            showPopup();
        }
    }

    // מחליף טקסט אימוג'י (:שם:) לאימוג'י אמיתי
    function replaceEmojisInText(text) {
        const regex = /:([a-zA-Z0-9א-ת_+-]+):/g;
        return text.replace(regex, (match, emojiName) => {
            return EMOJI_MAP[emojiName] || match;
        });
    }

    // מטפל בהחלפת אימוג'ים בזמן אמת
    function handleEmojiReplacement(element) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
            const cursorPos = element.selectionStart;
            const newValue = replaceEmojisInText(element.value);
            if (newValue !== element.value) {
                element.value = newValue;
                // שומר על מיקום הסמן
                element.setSelectionRange(cursorPos, cursorPos);
            }
        } else if (element.tagName === 'TEXTAREA') {
            const cursorPos = element.selectionStart;
            const newValue = replaceEmojisInText(element.value);
            if (newValue !== element.value) {
                element.value = newValue;
                element.setSelectionRange(cursorPos, cursorPos);
            }
        } else if (element.isContentEditable) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const newText = replaceEmojisInText(element.textContent);
            if (newText !== element.textContent) {
                element.textContent = newText;
                // מנסה לשמור על מיקום הסמן
                try {
                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (e) {
                    // אם לא מצליח, זה בסדר
                }
            }
        }
    }

    // מאזין לשינויים בשדות טקסט
    function initEmojiListener() {
        document.addEventListener('input', (e) => {
            handleEmojiReplacement(e.target);
        });

        // גם עבור שדות שנוספים דינמית
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // בודק אם הצומח עצמו הוא שדה טקסט
                        if ((node.tagName === 'INPUT' && node.type === 'text') || 
                            node.tagName === 'TEXTAREA' || 
                            node.isContentEditable) {
                            node.addEventListener('input', () => handleEmojiReplacement(node));
                        }
                        // בודק שדות טקסט בתוך הצומח
                        const textFields = node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
                        textFields.forEach(field => {
                            field.addEventListener('input', () => handleEmojiReplacement(field));
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ======= הפעלה ראשונית =======
    function init() {
        console.log("🚀 תוסף Mushka הופעל בהצלחה!");
        console.log(`⏰ ההתראה תופיע בשעה: ${CONFIG.alertTime}`);
        console.log(`😀 ${Object.keys(EMOJI_MAP).length} אימוג'ים זמינים`);

        // מפעיל מערכת האימוג'ים
        initEmojiListener();

        // בודק זמן התראה כל דקה
        setInterval(checkAlertTime, 60 * 1000);

        // בדיקה ראשונית
        checkAlertTime();
    }

    // מפעיל הכול כשהדף נטען
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
