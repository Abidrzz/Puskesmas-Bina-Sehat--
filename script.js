let dataPasien = { nama: "", umur: 0 };

const daftarGejala = {
  "Sakit Kepala": [
    "Nyeri berdenyut di kepala",
    "Pusing atau terasa berat",
    "Sensitif terhadap cahaya",
    "Leher terasa tegang",
    "Pandangan kabur",
  ],
  Mual: [
    "Ingin muntah",
    "Perut tidak nyaman",
    "Mulut terasa pahit",
    "Keringat dingin",
    "Mual setelah makan",
  ],
  Diare: [
    "BAB cair lebih dari 3 kali sehari",
    "Kram atau nyeri perut",
    "Tubuh terasa lemas",
    "Dehidrasi (haus berlebihan)",
    "Demam ringan",
  ],
  "Batuk Pilek": [
    "Batuk kering atau berdahak",
    "Hidung tersumbat atau berair",
    "Bersin-bersin",
    "Sakit tenggorokan",
    "Demam ringan",
  ],
  "Luka Ringan": [
    "Luka gores atau lecet",
    "Perdarahan ringan",
    "Memar (biru/kehitaman)",
    "Nyeri di area luka",
    "Bengkak ringan",
  ],
};

function showStep(id) {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "step-gejala") {
    document.getElementById("display-date").innerText =
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
}

function validateData() {
  const n = document.getElementById("nama").value.trim();
  const u = parseInt(document.getElementById("umur").value);
  if (/^[A-Za-z ]{4,}$/.test(n) && u >= 1 && u <= 100) {
    dataPasien.nama = n;
    dataPasien.umur = u;
    showStep("step-emergency");
  } else {
    document.getElementById("error-box").classList.remove("hidden");
  }
}

function updateGejalaList() {
  const val = document.getElementById("keluhan-utama").value;
  const wrapper = document.getElementById("gejala-wrapper");
  wrapper.innerHTML = "";

  if (val && daftarGejala[val]) {
    daftarGejala[val].forEach((g, index) => {
      const div = document.createElement("div");
      div.className = "gejala-item";
      div.innerHTML = `
                <input type="checkbox" name="gejala" value="${g}" id="chk${index}">
                <label for="chk${index}">${g}</label>
            `;
      wrapper.appendChild(div);
    });
  } else {
    wrapper.innerHTML =
      '<p style="color: #888; font-style: italic;">Silakan pilih keluhan utama...</p>';
  }
}

function handleEmergency(isEmergency) {
  if (isEmergency) {
    generateReceipt("IGD", "DARURAT", "E-1");
  } else {
    showStep("step-gejala");
  }
}

function processGejala() {
  const checked = document.querySelectorAll('input[name="gejala"]:checked');
  if (checked.length >= 5) {
    generateReceipt("IGD", "DARURAT", "E-2");
  } else {
    let poli = "";
    let pref = "";
    if (dataPasien.umur <= 18) {
      poli = "Poli Anak";
      pref = "A";
    } else if (dataPasien.umur >= 50) {
      poli = "Poli Lansia";
      pref = "L";
    } else {
      poli = "Poli Umum";
      pref = "U";
    }

    const num = Math.floor(Math.random() * 50) + 1;
    generateReceipt(poli, "REGULER", `${pref}-${num}`);
  }
}

function generateReceipt(poli, status, nomor) {
  document.getElementById("res-nama").innerText = dataPasien.nama;
  document.getElementById("res-umur").innerText = dataPasien.umur;
  document.getElementById("res-poli").innerText = poli;
  document.getElementById("res-nomor").innerText = nomor;
  document.getElementById("res-date").innerText = new Date().toLocaleString(
    "id-ID",
  );

  const qr = document.getElementById("qrcode");
  qr.innerHTML = "";
  new QRCode(qr, {
    text: `ANTRIAN|${nomor}|${dataPasien.nama}`,
    width: 120,
    height: 120,
  });

  showStep("step-receipt");
}

function downloadPDF() {
  const element = document.getElementById("receipt-area");
  html2pdf().from(element).save(`Antrian_${dataPasien.nama}.pdf`);
}
