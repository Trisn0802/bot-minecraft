var mineflayer = require("mineflayer");

var options = {
  host: "OtogaMaru.aternos.me", // IP server Minecraft
  port: 21823, // Port server Minecraft
  username: "RockMan", // Email akun Minecraft
  //   password: 'password' // Password akun Minecraft
};

var bot;

// Menyimpan waktu mulai bot
var startTime = Date.now();

// Fungsi untuk mengubah milidetik menjadi format jam:menit
function formatTime(ms) {
  var hours = Math.floor(ms / (1000 * 60 * 60));
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  var time = "";
  if (hours > 0) {
    time += hours + " Jam ";
  }
  if (minutes > 0) {
    time += minutes + " Menit";
  }
  return time;
}

function reconnect() {
  bot = mineflayer.createBot(options, { checkTimeoutInterval: 60000 });
  bot.on("kicked", function (reason, loggedIn) {
    if (loggedIn) {
      console.log(
        "Bot telah di kick dari server. Mencoba untuk login kembali..."
      );
      reconnect();
    }
  });
  bot.on("spawn", function () {
    console.log("Bot berhasil login ke server!");
    // Mengatur interval untuk mengecek waktu berjalan setiap menit
    setInterval(checkTime, 60 * 1000);
  });
}

reconnect();

// Fungsi untuk mengecek waktu berjalan dan mengirim pesan jika sudah mencapai batas tertentu
function checkTime() {
  // Menghitung selisih waktu antara sekarang dan waktu mulai
  var elapsedTime = Date.now() - startTime;
  // Mengecek apakah sudah berjalan kelipatan 30 menit
  if (elapsedTime % (30 * 60 * 1000) === 0) {
    // Mengubah milidetik menjadi format jam:menit
    var formattedTime = formatTime(elapsedTime);
    // Membuat pesan yang akan dikirim
    var message = "Bot telah aktif selama " + formattedTime;
    // Menampilkan pesan di konsol
    console.log(message);
    // Mengirim pesan di game
    bot.chat(message);
  }
}
