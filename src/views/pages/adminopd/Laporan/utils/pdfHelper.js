import jsPDF from "jspdf";
import autoTable, { Row } from "jspdf-autotable";
import { BULAN_LIST } from "../../../../../utils/bulan";

/* =====================================================
   HELPER
===================================================== */
const formatDurasi = (val) => Math.round(Number(val || 0));

const capitalizeWords = (str = "") =>
  str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const formatRupiah = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(val) || 0);

const formatPersen = (val) => `${Number(val || 0).toFixed(2)}%`;

const addFooter = (doc, pageWidth, pageHeight) => {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const pageNumber = doc.internal.getNumberOfPages();

  doc.setFontSize(8);
  doc.setTextColor(130);

  doc.text(
    `Dokumen ini dicetak dari E-Kinerja Kota Padangsidimpuan pada ${today}`,
    8,
    pageHeight - 6,
  );

  doc.text(`Halaman ${pageNumber}`, pageWidth - 8, pageHeight - 6, {
    align: "right",
  });
};

/* =====================================================
   MAIN
===================================================== */

export const generateLaporanPDF = ({
  data = [],
  bulan,
  tahun,
  penandatangan: penandaSelected,
  penandatangan,
  user,
  selectedTitle = "LAPORAN AKTIVITAS",
  isBulanan = true,
  modeCetak = "",
  selectedOpdNama,
  selectedOpdAlias
}) => {
  const doc = new jsPDF("l", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const namaOpdFinal =
    selectedOpdNama?.trim() ||
    user?.nama_opd?.trim() ||
    "Nama OPD";

const namaOpdTTD =
  selectedOpdAlias?.trim() ||
  selectedOpdNama?.trim() ||
  "Nama OPD";



  /* =====================================================
     HEADER
  ===================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(selectedTitle, pageWidth / 2, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);





doc.text(
  namaOpdFinal.toUpperCase(),
  pageWidth / 2,
  20,
  { align: "center" },
);


  // 🔥 BASE POSITION (BIAR KONSISTEN)
  const headerLineY = 25;
  const periodeY = headerLineY + 7;
  const tableStartY = periodeY + 4;

  doc.line(10, headerLineY, pageWidth - 10, headerLineY);

  const periodeText = new Date(tahun, bulan - 1).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(9);
  doc.setTextColor(120);

  if (modeCetak === "tpptotal") {
    doc.text(`* Daftar Tambahan Penghasilan Pegawai ${periodeText}`, 10, 30);
  } else if (modeCetak === "rekappersen") {
    doc.text(`* Rekap Pengurangan TPP ${periodeText}`, 10, 30);
  } else if (isBulanan) {
    const durasiMaksimal = Number(data?.[0]?.total_durasi_maksimal || 0);

    doc.text(
      `* Durasi maksimal aktivitas periode ${periodeText} adalah ${durasiMaksimal} jam`,
      12,
      32,
    );
  } else {
    doc.text(`* Dokumen laporan aktivitas periode ${periodeText}`, 10, 30);
  }

  doc.setTextColor(0);

  /* =====================================================
     TABLE
  ===================================================== */
  let head = [];
  let body = [];
  let columnStyles = {};
  let fontSize = 8;
  let processedData = [...data];

  console.log("===== RAW DATA FROM API =====");
  console.log("Total data:", data.length);
  console.log("Sample raw[0]:", data[0]);

  /* =====================================================
     KHUSUS MODE TPP -> HANYA PNS
  ===================================================== */
  if (modeCetak === "rekappersen" || modeCetak === "tpptotal") {
    processedData = processedData.filter(
      (item) =>
        String(item.kategori_pegawai || item.status_pegawai || "")
          .toUpperCase()
          .trim() === "PNS",
    );
    console.log("===== AFTER FILTER PNS =====");
    console.log("Total PNS:", processedData.length);
    console.log("Sample PNS[0]:", processedData[0]);
  }

  let fullWidthMode = false;

  if (!isBulanan && modeCetak === "") {
    processedData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  }

  /* =====================================================
     MODE TOTAL TPP (FULL PAGE)
  ===================================================== */
  if (modeCetak === "tpptotal") {
    head = [
      [
        { content: "No", rowSpan: 2 },
        { content: "Nama / NIP", rowSpan: 2 },
        { content: "Jabatan", rowSpan: 2 },
        { content: "TPP (Rp)", rowSpan: 2 },

        { content: "Aspek Pelaksanaan Kinerja (60%)", colSpan: 2 },
        { content: "Aspek Disiplin Kerja (40%)", colSpan: 5 },

        { content: "Total Potongan (Rp)", rowSpan: 2 },
        { content: "TPP Bruto (Rp)", rowSpan: 2 },
        { content: "PPh21 (Rp)", rowSpan: 2 },
        { content: "IWP (Rp)", rowSpan: 2 },
        { content: "Diterima (Rp)", rowSpan: 2 },
        { content: "TTD", rowSpan: 2 },
      ],
      [
        "Pengurangan Kinerja (Rp)",
        "Tidak Menilai Bawahan (Rp)",
        "Alpa (Rp)",
        "Tidak Apel (Rp)",
        "Terlambat (Rp)",
        "Pulang Cepat (Rp)",
        "Tidak Absen Sore (Rp)",
      ],
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
      ],
    ];

    body = processedData.map((row, i) => [
  i + 1,
  `${row.nama || "-"}\n${row.nip || "-"}`,
  row.jabatan_nama || "-",

  formatRupiah(row.tpp_bulanan),

  formatRupiah(row.potongan_kinerja),
  formatRupiah(row.tidak_menilai_bawahan),

  formatRupiah(row.nominal_alpa),
  formatRupiah(row.nominal_tidak_apel),
  formatRupiah(row.nominal_tmk),
  formatRupiah(row.nominal_psw),
  formatRupiah(row.nominal_sore),

  formatRupiah(row.jumlah_potongan),
  formatRupiah(row.tpp_bruto),

  formatRupiah(row.pph21),
  formatRupiah(row.potongan_iwp),
  formatRupiah(row.tpp_diterima),

  "",
]);

    columnStyles = {
      0: { cellWidth: 8, halign: "center" }, // No
      1: { cellWidth: 32 }, // Nama/NIP
      2: { cellWidth: 22 }, // Jabatan
      3: { cellWidth: 18, halign: "right" }, // TPP
      4: { cellWidth: 15, halign: "right" }, // Pengurangan Kinerja
      5: { cellWidth: 15, halign: "right" }, // Tidak Menilai Bawahan
      6: { cellWidth: 15, halign: "right" }, // Alpa
      7: { cellWidth: 15, halign: "right" }, // Tidak Apel
      8: { cellWidth: 15, halign: "right" }, // Terlambat
      9: { cellWidth: 15, halign: "right" }, // Pulang Cepat
      10: { cellWidth: 15, halign: "right" }, // Tidak Absen Sore
      11: { cellWidth: 18, halign: "right" }, // Total Potongan
      12: { cellWidth: 18, halign: "right" }, // TPP Bruto
      13: { cellWidth: 16, halign: "right" }, // PPh 21
      14: { cellWidth: 13, halign: "right" }, // Iuran BPJS
      15: { cellWidth: 18, halign: "right" }, // TPP Diterima
      16: { cellWidth: 16, halign: "center" }, // Tanda Tangan
    };
  } else if (modeCetak === "rekappersen") {
    /* =====================================================
     MODE REKAP PERSEN (FULL PAGE)
  ===================================================== */
    head = [
      [
        { content: "No", rowSpan: 2 },
        { content: "Nama / NIP", rowSpan: 2 },
        { content: "Jabatan", rowSpan: 2 },
        { content: "Kelas", rowSpan: 2 },
        { content: "Pelaksanaan Tugas", colSpan: 2 },
        { content: "Disiplin Kerja", colSpan: 11 },
        { content: "Total", rowSpan: 2 },
      ],
      [
        "Kinerja",
        "Tidak Menilai",
        "Alpa",
        "Tidak Apel",
        "TL1",
        "TL2",
        "TL3",
        "TL4",
        "PSW1",
        "PSW2",
        "PSW3",
        "PSW4",
        "Tidak Absen",
      ],
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
      ],
    ];

    body = processedData.map((row, i) => [
      i + 1,
      `${row.nama || "-"}\n${row.nip || "-"}`,
      row.jabatan_nama || "-",
      row.kelas_jabatan || "-",

      formatPersen(row.kinerjaPersen),
      formatPersen(row.tidak_menilai_bawahan_persen),

      formatPersen(row.persen_alfa),
      formatPersen(row.persen_tidak_apel),

      formatPersen(row.persen_tmk1),
      formatPersen(row.persen_tmk2),
      formatPersen(row.persen_tmk3),
      formatPersen(row.persen_tmk4),

      formatPersen(row.persen_psw1),
      formatPersen(row.persen_psw2),
      formatPersen(row.persen_psw3),
      formatPersen(row.persen_psw4),

      formatPersen(row.persen_tidak_absen_sore),
      formatPersen(row.potongan_persen),
    ]);

    columnStyles = {
      0: { cellWidth: 9, halign: "center" }, // No
      1: { cellWidth: 40 }, // Nama/NIP/Golongan
      2: { cellWidth: 22 }, // Jabatan
      3: { cellWidth: 14, halign: "center" }, // Kelas
      4: { cellWidth: 14, halign: "right" }, // Pengurangan Kinerja
      5: { cellWidth: 14, halign: "right" }, // Tidak Menilai Bawahan
      6: { cellWidth: 14, halign: "right" }, // Alfa
      7: { cellWidth: 14, halign: "right" }, // Tidak Apel
      8: { cellWidth: 14, halign: "right" }, // TL1
      9: { cellWidth: 14, halign: "right" }, // TL2
      10: { cellWidth: 14, halign: "right" }, // TL3
      11: { cellWidth: 14, halign: "right" }, // TL4
      12: { cellWidth: 14, halign: "right" }, // PSW1
      13: { cellWidth: 14, halign: "right" }, // PSW2
      14: { cellWidth: 14, halign: "right" }, // PSW3
      15: { cellWidth: 14, halign: "right" }, // PSW4
      16: { cellWidth: 14, halign: "right" }, // Tidak Absen Sore
      17: { cellWidth: 16, halign: "right" }, // Total Potongan
    };
  } else if (isBulanan) {
    /* =====================================================
     BULANAN (tetap)
  ===================================================== */
    head = [
      [
        "No",
        "Nama / NIP",
        "Besaran TPP",
        "Total Aktivitas",
        "Total Durasi",
        "Persen Kinerja",
        "Hari Kerja",
        "TPP Kinerja",
      ],
      ["1", "2", "3", "4", "5", "6", "7", "8"],
    ];

    body = processedData.map((row , i) => [
      i + 1,
      `${row.nama || "-"}\n${row.nip || "-"}`,
      formatRupiah(row.besaran_tpp),
      Number(row.total_aktivitas || 0),
      `${formatDurasi(row.total_durasi)} Jam`,
      formatPersen(row.persen_kinerja),
      `${Number(row.jumlah_hari_kerja || 0)} Hari`,
      formatRupiah(row.tpp_kinerja),
    ]);
    columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
      6: { halign: "center" },
      7: { halign: "right" },
    };
  } else {
    /* =====================================================
     HARIAN (tetap)
  ===================================================== */
    head = [
      [
        "No",
        "Nama / NIP",
        "Tanggal",
        "Jumlah Aktivitas",
        "Total Durasi",
        "Persen Kinerja",
      ],
      ["1", "2", "3", "4", "5", "6"],
    ];

    body = processedData.map((row, i) => [
      i + 1,
      `${row.nama || "-"}\n${row.nip || "-"}`,
      row.tanggal ? new Date(row.tanggal).toLocaleDateString("id-ID") : "-",
      Number(row.jumlah_aktivitas || 0),
      `${formatDurasi(row.total_durasi)} Jam`,
      formatPersen(row.persen_kinerja_harian),
    ]);
    columnStyles = {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
      5: { halign: "center" },
    };
  }

  console.log("===== FINAL DATA FOR PDF =====");
  console.log("Columns sample:", body?.[0]);

/* =====================================================
   LOGIKA TOTAL KHUSUS MODE TPP
===================================================== */
let foot = [];

if (modeCetak === "tpptotal") {
  // Hitung akumulasi
  const totals = processedData.reduce((acc, curr) => {
    acc.tpp_bulanan += Number(curr.tpp_bulanan || 0);
    acc.potongan_kinerja += Number(curr.potongan_kinerja || 0);
    acc.tidak_menilai_bawahan += Number(curr.tidak_menilai_bawahan || 0);
    acc.nominal_alpa += Number(curr.nominal_alpa || 0);
    acc.nominal_tidak_apel += Number(curr.nominal_tidak_apel || 0);
    acc.nominal_tmk += Number(curr.nominal_tmk || 0);
    acc.nominal_psw += Number(curr.nominal_psw || 0);
    acc.nominal_sore += Number(curr.nominal_sore || 0);
    acc.jumlah_potongan += Number(curr.jumlah_potongan || 0);
    acc.tpp_bruto += Number(curr.tpp_bruto || 0);
    acc.tpp_diterima += Number(curr.tpp_diterima || 0);
    return acc;
  }, { 
    tpp_bulanan: 0, potongan_kinerja: 0, tidak_menilai_bawahan: 0, 
    nominal_alpa: 0, nominal_tidak_apel: 0, nominal_tmk: 0, 
    nominal_psw: 0, nominal_sore: 0, jumlah_potongan: 0, 
    tpp_bruto: 0, tpp_diterima: 0 
  });

  // Susun baris footer sesuai kolom tpptotal
  foot = [[
    { content: "TOTAL", colSpan: 3, styles: { halign: "center" } }, // Kolom 1-3
    formatRupiah(totals.tpp_bulanan),           // Kolom 4
    formatRupiah(totals.potongan_kinerja),      // Kolom 5
    formatRupiah(totals.tidak_menilai_bawahan), // Kolom 6
    formatRupiah(totals.nominal_alpa),          // Kolom 7
    formatRupiah(totals.nominal_tidak_apel),    // Kolom 8
    formatRupiah(totals.nominal_tmk),           // Kolom 9
    formatRupiah(totals.nominal_psw),           // Kolom 10
    formatRupiah(totals.nominal_sore),          // Kolom 11
    formatRupiah(totals.jumlah_potongan),       // Kolom 12
    formatRupiah(totals.tpp_bruto),             // Kolom 13
    "", "",                                     // Kolom 14-15 (PPh & IWP)
    formatRupiah(totals.tpp_diterima),          // Kolom 16
    ""                                          // Kolom 17 (TTD)
  ]];
}


  /* =====================================================
     TABLE
  ===================================================== */
  autoTable(doc, {
    startY: tableStartY,
    theme: "grid",
    head,
    body,
    foot: foot.length > 0 ? foot : undefined,
    showFoot: "lastPage",
    columnStyles,
    tableWidth: "auto",


        
    margin: {
      top: 10,
      left: 6,
      right: 6,
      bottom: 10,
    },

    showHead: "everyPage",
    pageBreak: "auto",
    rowPageBreak: "auto",

    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      valign: "middle",
      overflow: "linebreak",
      lineWidth: 0.1,
      
    },

    headStyles: {
      fontSize: 7,
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
    footStyles: {
    fillColor: [230, 230, 230],
    textColor: [0, 0, 0],
    fontStyle: "normal",
    fontSize: 5.5, // Sedikit lebih kecil agar nominal rupiah tidak terpotong
    halign: "right",
    valign: "middle",
  },
    didParseCell: function (data) {
      if (data.section === "body") {
        if (data.row.index % 2 === 1) {
          data.cell.styles.fillColor = [245, 245, 245]; // abu tipis
        } else {
          data.cell.styles.fillColor = [255, 255, 255]; // putih
        }
      }
    },

    didDrawPage: () => {
      addFooter(doc, pageWidth, pageHeight);
    },
  });

  /* =====================================================
     TTD
  ===================================================== */
/* =====================================================
   TANDA TANGAN & TABEL PARAF (Halaman Terakhir)
===================================================== */
let y = doc.lastAutoTable.finalY + 15;
/* =====================================================
   LOGIKA TANDA TANGAN DINAMIS
===================================================== */
// Proteksi jika ruang tidak cukup untuk 3 TTD + 1 Tabel Paraf
// Proteksi ganti halaman jika sisa ruang sempit

const renderHeader = (doc, pageWidth, selectedTitle, namaOpdFinal) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(selectedTitle.toUpperCase(), pageWidth / 2, 12, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11); // Ukuran sedikit lebih besar agar terbaca
  doc.text(
    (namaOpdFinal || "PEMERINTAH KOTA PADANGSIDIMPUAN").toUpperCase(),
    pageWidth / 2,
    18,
    { align: "center" }
  );
  
  // Gambar garis di bawah header
  doc.setLineWidth(0.5);
  doc.line(10, 22, pageWidth - 10, 22);
};
if (y > pageHeight - 75) {
  doc.addPage();
  //renderHeader(doc, pageWidth, selectedTitle, BULAN_LIST, tahun); // Pastikan header digambar di hal baru
  renderHeader(doc, pageWidth, selectedTitle, namaOpdFinal);
  y = 25; 
}

if (modeCetak === "tpptotal") {
  const colKiri = pageWidth * 0.2;
  const colTengah = pageWidth * 0.5;
  const colKanan = pageWidth * 0.8;

  doc.setFontSize(8.5).setFont("helvetica", "normal");

  console.log({
    selectedOpdNama,
    selectedOpdAlias,
    namaOpdFinal,
    namaOpdTTD
  });


  const jabatanKiri = namaOpdTTD;



  /* =====================================================
   HEADER TTD 3 KOLOM RAPAT & SEJAJAR
  ===================================================== */

  // BARIS 1 → tanggal sendiri di atas
  doc.text(
    `Padangsidimpuan,     ${BULAN_LIST.find(b => b.value == bulan)?.label} ${tahun}`,
    colKanan,
    y,
    { align: "center" }
  );

  // BARIS 2 → sejajar 3 kolom
  y += 8;

  doc.text("Disetujui", colKiri, y, { align: "center" });
  doc.text("Mengetahui", colTengah, y, { align: "center" });
  doc.text("Dibayar oleh :", colKanan, y, { align: "center" });

  // BARIS 3 → jabatan sejajar
  y += 5;

  doc.text(
    jabatanKiri.toUpperCase(),
    colKiri,
    y,
    {
      align: "center",
      maxWidth: 65
    }
  );

  doc.text(
    "PEJABAT PELAKSANA TEKNIS\nKEGIATAN",
    colTengah,
    y,
    {
      align: "center",
      maxWidth: 55
    }
  );

  doc.text(
    "BENDAHARA PENGELUARAN",
    colKanan,
    y,
    {
      align: "center",
      maxWidth: 55
    }
  );



  // --- RUANG TANDA TANGAN ---
  y += 22; 

  // --- BARIS 3: NAMA PEJABAT (BOLD) ---
  doc.setFont("helvetica", "bold");
  doc.text(penandatangan.kiri?.nama || "", colKiri, y, { align: "center" });
  doc.text(penandatangan.tengah?.nama || "", colTengah, y, { align: "center" });
  doc.text(penandatangan.kanan?.nama || "", colKanan, y, { align: "center" });

  // --- BARIS 4: NIP ---
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.text(`NIP. ${penandatangan.kiri?.nip || ""}`, colKiri, y, { align: "center" });
  doc.text(`NIP. ${penandatangan.tengah?.nip || ""}`, colTengah, y, { align: "center" });
  doc.text(`NIP. ${penandatangan.kanan?.nip || ""}`, colKanan, y, { align: "center" });

  // --- 4. TABEL PARAF HIERARKI (DI SEBELAH KIRI) ---
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Paraf", ""]], // Header tabel paraf
    body: [
      ["Asisten", ""],
      ["Inspektur", ""],
      [`Ka. BKPSDM`, ""],
    ],
    tableWidth: 50,
    margin: { left: colKiri - 25 }, // Posisikan di bawah kolom tengah agar simetris dengan referensi
    styles: { fillColor: false, fontSize: 7, cellPadding: 1.5, lineColor: [0, 125, 255]},
    headStyles: { fillColor: false, textColor: 0, fontStyle: "bold", halign: "left", lineWidth: 0.1 },
    
   

    columnStyles: { 
      0: { cellWidth: 25 }, 
      1: { cellWidth: 25 } 
    }
  });

  } else {
      // --- MODE STANDAR (1 PENANDATANGAN) ---
      const rightPos = pageWidth - 80;
      doc.setFontSize(9).setFont("helvetica", "normal");
      doc.text(`Padangsidimpuan,      ${BULAN_LIST.find(b => b.value == bulan)?.label} ${tahun}`, rightPos, y);
      doc.text(penandatangan?.jabatan || "", rightPos, y + 5);
      
      y += 25;
      doc.setFont("helvetica", "bold");
      doc.text(penandatangan?.nama || "", rightPos, y);
      doc.setFont("helvetica", "normal");
      doc.text(`NIP. ${penandatangan?.nip || ""}`, rightPos, y + 5);
    }

    doc.output("dataurlnewwindow");
  };

