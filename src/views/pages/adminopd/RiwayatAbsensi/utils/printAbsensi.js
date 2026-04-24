import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getNamaBulan } from "src/utils/bulan";

// ================= FOOTER =================
const addFooter = (pdf, pageWidth, pageHeight) => {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const pageNumber = pdf.internal.getNumberOfPages();

  pdf.setFontSize(9);
  pdf.setTextColor(150);

  pdf.text(
    `Dokumen ini dicetak dari E-Kinerja Kota Padangsidimpuan pada ${today}`,
    14,
    pageHeight - 8
  );

  pdf.text(`Halaman ${pageNumber}`, pageWidth - 14, pageHeight - 8, {
    align: "right",
  });

  pdf.setTextColor(0);
};

// ================= MAIN =================
const printAbsensi = ({
  profil = {},
  nama = "-",
  id = "-",
  bulan = "",
  tahun = "",
  rowsSummary = [],
  data = [],
}) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // ================= PERIODE =================
  const periode =
    bulan && tahun
      ? `${getNamaBulan(String(bulan).padStart(2, "0"))} ${tahun}`
      : "-";

  // ================= HEADER =================
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("REKAP ABSENSI PEGAWAI", pageWidth / 2, 12, {
    align: "center",
  });

  // garis bawah judul (proporsional)
  pdf.line(14, 17, pageWidth - 14, 17);

  // periode
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Periode : ${periode}`, 14, 24);


// ================= WARNA PRIMARY =================
const PRIMARY = [41, 128, 185];

// ================= PROFIL =================
autoTable(pdf, {
  startY: 30,
  margin: { left: 14, right: 14, bottom: 18 },
  tableWidth: 182,

  head: [["PROFIL PEGAWAI", ""]],
  body: [
    ["Nama", profil.nama || nama],
    ["NIP", profil.nip || id],
    ["Golongan", profil.golongan || "-"],
    ["Eselon", profil.eselon || "-"],
    ["Status Pegawai", profil.status_pegawai || "-"],
    ["Unor Induk", profil.unor_induk || "-"],
    ["Unor", profil.unor || "-"],
  ],


  theme: "grid",

  styles: {
    fontSize: 8,
    cellPadding: 2,
    valign: "middle",
  },

  headStyles: {
    fillColor: PRIMARY,
    textColor: 255,
    halign: "left",
    fontStyle: "bold",
  },

  columnStyles: {
    0: { cellWidth: 45, fontStyle: "bold" },
    1: { cellWidth: 137 },
  },

  didDrawPage: () => addFooter(pdf, pageWidth, pageHeight),
});

// ================= RINCIAN =================
const rowsDetail = data.map((item, i) => [
  i + 1,
  item.tanggal || "-",
  item.jam_absen_masuk || "-",
  item.jam_absen_keluar || "-",
  item.terlambat_menit > 0 ? `${item.terlambat_menit} menit` : "-",
  item.cepat_pulang_menit > 0 ? `${item.cepat_pulang_menit} menit` : "-",
  item.keterangan || "-",
]);

autoTable(pdf, {
  startY: pdf.lastAutoTable.finalY + 6,
  margin: { left: 14, right: 14, bottom: 18 },
  tableWidth: 182,

  head: [[
    "No",
    "Tanggal",
    "Masuk",
    "Pulang",
    "Terlambat",
    "Cepat Pulang",
    "Status",
  ]],

  body: rowsDetail,

  theme: "grid",

  styles: {
    fontSize: 8,
    cellPadding: 2,
    valign: "middle",
  },

  headStyles: {
    fillColor: PRIMARY,
    textColor: 255,
    halign: "center",
    fontStyle: "bold",
  },

  columnStyles: {
    0: { halign: "center", cellWidth: 10 },
    1: { halign: "center", cellWidth: 25 },
    2: { halign: "center", cellWidth: 22 },
    3: { halign: "center", cellWidth: 22 },
    4: { halign: "center", cellWidth: 28 },
    5: { halign: "center", cellWidth: 28 },
    6: { halign: "center", cellWidth: 47 },
  },

didParseCell: function (hookData) {
  if (hookData.section === "body" && hookData.column.index === 6) {
    const val = String(hookData.cell.raw || "")
      .toLowerCase()
      .trim();

    // ambil warna default tabel (sama seperti kolom lain)


    hookData.cell.styles.halign = "center";
    hookData.cell.styles.valign = "middle";
    hookData.cell.styles.fontStyle = "normal";

    // hadir = ikut warna tabel
    if (val === "hadir") return;

    // dash = ikut warna tabel
    if (val === "-") return;

    // sabtu / minggu / libur / cuti = merah
    if (
      val.includes("sabtu") ||
      val.includes("minggu") ||
      val.includes("libur") ||
      val.includes("cuti")
    ) {
      hookData.cell.styles.textColor = [220, 53, 69];
      hookData.cell.styles.fontStyle = "bold";
      return;
    }

    // selain itu ikut warna default tabel
    hookData.cell.styles.textColor = defaultColor;
  }
},

  didDrawPage: () => addFooter(pdf, pageWidth, pageHeight),
});

// ================= REKAP =================
const half = Math.ceil(rowsSummary.length / 2);

const bodySummary = Array.from({ length: half }).map((_, i) => [
  rowsSummary[i]?.[0] || "",
  rowsSummary[i]?.[1] || 0,
  rowsSummary[i + half]?.[0] || "",
  rowsSummary[i + half]?.[1] || 0,
]);

autoTable(pdf, {
  startY: pdf.lastAutoTable.finalY + 6,
  margin: { left: 14, right: 14, bottom: 18 },
  tableWidth: 182,

  head: [["Keterangan", "Jumlah", "Keterangan", "Jumlah"]],
  body: bodySummary,

  theme: "grid",

  styles: {
    fontSize: 8,
    cellPadding: 2,
    valign: "middle",
  },

  headStyles: {
    fillColor: PRIMARY,
    textColor: 255,
    halign: "center",
    fontStyle: "bold",
  },

  columnStyles: {
    1: { halign: "center", cellWidth: 18 },
    3: { halign: "center", cellWidth: 18 },
  },

  didDrawPage: () => addFooter(pdf, pageWidth, pageHeight),
});

  // ================= PREVIEW =================
  window.open(pdf.output("bloburl"), "_blank");
};

export default printAbsensi;