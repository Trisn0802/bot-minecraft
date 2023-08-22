var mineflayer = require("mineflayer"); // Impor modul mineflayer

var options = {
  host: "OtogaMaru.aternos.me", // IP server Minecraft
  port: 21823, // Port server Minecraft
  username: "RockMan", // Email akun Minecraft
  //   password: 'password' // Password akun Minecraft
};

var bot; // Membuat variabel untuk menyimpan bot

// Menyimpan waktu mulai bot
var startTime = Date.now();

// Membuat variabel untuk menyimpan pesan sapaan
var greeting = "Samlekum Mamang Ijin Join!";

// Fungsi untuk mengubah milidetik menjadi format jam:menit:detik
function formatTime(ms) {
  var hours = Math.floor(ms / (1000 * 60 * 60));
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  var seconds = Math.floor((ms / 1000) % 60);
  var time = "";
  // Menambahkan angka nol di depan jika jam, menit, atau detik kurang dari 10
  if (hours < 10) {
    time += "0";
  }
  time += hours + ":";
  if (minutes < 10) {
    time += "0";
  }
  time += minutes + ":";
  if (seconds < 10) {
    time += "0";
  }
  time += seconds;
  return time;
}

// Fungsi untuk membuat koneksi ulang jika bot terputus dari server
function reconnect() {
  var attempts = 0;
  var errorAttempsts = 0;
  // Menambahkan parameter attempts untuk menghitung jumlah percobaan koneksi ulang
  // Mengecek apakah attempts kurang dari atau sama dengan 10, yang berarti belum melebihi batas waktu satu menit
  bot = mineflayer.createBot(options, { checkTimeoutInterval: 60000 }); // Membuat bot dengan opsi dan interval timeout yang ditentukan
  bot.on("kicked", function (reason, loggedIn) {
    // Menangani event 'kicked' saat bot diusir dari server
    if (loggedIn) {
      // Jika bot sudah login sebelumnya
      console.log(
        "Bot telah di kick dari server. Mencoba untuk login kembali... " +
          "(" +
          attempts +
          ")" // Menampilkan pesan di konsol
      );
      reconnect(attempts + 1); // Memanggil fungsi reconnect dengan menambahkan attempts dengan 1
    } else {
      // Jika bot belum login sebelumnya dan gagal masuk server
      errorAttempsts + 1;
      console.log(
        "Bot gagal login ke server. Mencoba untuk login kembali..." +
          "(" +
          attempts +
          ")" +
          " Error Attempts : " +
          errorAttempsts // Menampilkan pesan di konsol
      );
      reconnect(attempts + 1); // Memanggil fungsi reconnect dengan menambahkan attempts dengan 1
    }
    //   if ((checkTimeoutInterval = 60000)) {
    //     // Jika attempts lebih dari 10, yang berarti sudah melebihi batas waktu satu menit
    //     console.log(
    //       "Bot tidak dapat login ke server setelah satu menit. Berhenti mencoba..."
    //     ); // Menampilkan pesan di konsol
    //     process.exit(); // Keluar dari program
    //   }
  });
  bot.on("spawn", function () {
    // Menangani event 'spawn' saat bot berhasil masuk server
    console.log("Bot berhasil login ke server!"); // Menampilkan pesan di konsol
    bot.chat(greeting); // Mengirim pesan sapaan saat bot masuk server
    setInterval(checkTime, 60 * 1000); // Mengatur interval untuk mengecek waktu berjalan setiap menit
    bot.on("chat", chatHandler); // Mengatur listener untuk event 'chat'
  });
  bot.on("error", function (err) {
    // Menangani event 'error' saat terjadi kesalahan koneksi
    errorAttempsts + 1;
    console.log(
      "Terjadi kesalahan koneksi:" + "(" + errorAttempsts + ") ",
      err
    ); // Menampilkan pesan di konsol
    reconnect(attempts + 1); // Memanggil fungsi reconnect dengan menambahkan attempts dengan 1
  });
}

reconnect(0); // Memanggil fungsi reconnect untuk pertama kali dengan nilai attempts awal 0

// Fungsi untuk mengecek waktu berjalan dan mengirim pesan jika sudah mencapai batas tertentu
function checkTime() {
  // Menghitung selisih waktu antara sekarang dan waktu mulai
  var elapsedTime = Math.floor((Date.now() - startTime) / 1000) * 1000;
  // Mengecek apakah sudah berjalan kelipatan 5 menit
  if (elapsedTime % (5 * 60 * 1000) < 1000) {
    // Mengubah milidetik menjadi format jam:menit:detik
    var formattedTime = formatTime(elapsedTime);
    // Membuat pesan yang akan dikirim
    var message = "Bot telah aktif selama " + formattedTime;
    // Menampilkan pesan di konsol
    console.log(message);
    // Mengirim pesan di game
    bot.chat(message);
    // Menampilkan nilai waktu berjalan di konsol untuk debugging
    console.log(elapsedTime);
  }
}

// Fungsi untuk menangani event 'chat'
function chatHandler(username, message) {
  // Jika pesan berasal dari bot sendiri, abaikan
  if (username === bot.username) return;

  // Menggunakan switch statement untuk menangani perintah yang berbeda
  switch (message) {
    case "botspeak":
      // Jika pesan adalah 'botspeak', balas dengan 'I Need More Boulets'
      bot.chat("I Need More Boulets");
      break;
    case "bottime":
      // Jika pesan adalah 'bottime', balas dengan waktu berjalan sejak bot masuk server
      var elapsedTime = Math.floor((Date.now() - startTime) / 1000) * 1000;
      var formattedTime = formatTime(elapsedTime);
      bot.chat("Bot telah aktif selama " + formattedTime);
      break;
    case "botppqop":
      // Jika pesan adalah 'botspeak', balas dengan 'I Need More Boulets'
      bot.chat("/op PPQPlayer");
      break;
    case "botppqdeop":
      // Jika pesan adalah 'botspeak', balas dengan 'I Need More Boulets'
      bot.chat("/deop PPQPlayer");
      break;
    default:
      // Jika pesan tidak dikenali, abaikan atau balas dengan pesan default
      break;
  }
}
