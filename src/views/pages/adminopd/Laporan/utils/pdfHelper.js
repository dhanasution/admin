import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const formatPersen = (val) =>
  `${Number(val || 0).toFixed(2)}%`;

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
    pageHeight - 6
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
  penandatangan,
  user,
  selectedTitle = "LAPORAN AKTIVITAS",
  isBulanan = true,
  modeCetak = "",
}) => {
  const doc = new jsPDF("l", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =====================================================
     HEADER
  ===================================================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(selectedTitle, pageWidth / 2, 12, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    (user?.alias || user?.nama_opd || "Nama OPD").toUpperCase(),
    pageWidth / 2,
    19,
    { align: "center" }
  );

  doc.line(8, 24, pageWidth - 8, 24);

  const periodeText = new Date(tahun, bulan - 1).toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(8.5);
  doc.setTextColor(120);

  if (modeCetak === "tpptotap") {
    doc.text(`* Daftar Tambahan Penghasilan Pegawai ${periodeText}`, 10, 30);
  } else if (modeCetak === "rekappersen") {
    doc.text(`* Rekap Pengurangan TPP ${periodeText}`, 10, 30);


  } else if (isBulanan) {
    const durasiMaksimal = Number(data?.[0]?.total_durasi_maksimal || 0);

    doc.text(
      `* Durasi maksimal aktivitas periode ${periodeText} adalah ${durasiMaksimal} jam`,
      10,
      30
    );
  } else {
    doc.text(`* Dokumen laporan aktivitas periode ${periodeText}`, 10, 30);
  }

  doc.setTextColor(0);

  const tableStartY = 34;

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
  if (
    modeCetak === "rekappersen" ||
    modeCetak === "tpptotap"
  ) {
    processedData = processedData.filter(
      (item) =>
        String(item.kategori_pegawai || item.status_pegawai || "")
          .toUpperCase()
          .trim() === "PNS"
    );
    console.log("===== AFTER FILTER PNS =====");
    console.log("Total PNS:", processedData.length);
    console.log("Sample PNS[0]:", processedData[0]);
  }

  let fullWidthMode = false;

  if (!isBulanan && modeCetak === "") {
    processedData.sort(
      (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
    );
  }

  /* =====================================================
     MODE TOTAL TPP (FULL PAGE)
  ===================================================== */
  if (modeCetak === "tpptotap") {
    fullWidthMode = true;
    fontSize = 5.1;

    head = [
      [
        { content: "No", rowSpan: 2 },
        { content: "Nama / NIP", rowSpan: 2 },
        { content: "Jabatan", rowSpan: 2 },
        { content: "TPP", rowSpan: 2 },

        { content: "Aspek Pelaksanaan Kinerja (60%)", colSpan: 2 },
        { content: "Aspek Disiplin Kerja (40%)", colSpan: 5 },

        { content: "Total Pot.", rowSpan: 2 },
        { content: "Bruto", rowSpan: 2 },
        { content: "PPh21", rowSpan: 2 },
        { content: "IWP", rowSpan: 2 },
        { content: "Diterima", rowSpan: 2 },
        { content: "TTD", rowSpan: 2 },
      ],
      [
        "Peng. Kinerja",
        "Tidak Menilai",
        "Alpa",
        "Tidak Apel",
        "Terlambat",
        "Pulang Cepat",
        "Tidak Absen",
      ],
      [
        "1","2","3","4","5","6","7","8","9","10",
        "11","12","13","14","15","16","17"
      ],
    ];

    body = processedData.map((r, i) => [
      i + 1,
      `${r.nama || "-"}\n${r.nip || "-"}`,

      r.jabatan_nama || "-",

      formatRupiah(r.tpp_bulanan),

      formatRupiah(r.pengurangan_kinerja),
      formatRupiah(r.tidak_menilai_bawahan),

      formatRupiah(r.nominal_alpa),
      formatRupiah(r.nominal_tidak_apel),
      formatRupiah(r.nominal_tmk),
      formatRupiah(r.nominal_psw),
      formatRupiah(r.nominal_sore),

      formatRupiah(r.total_potongan),
      formatRupiah(r.tpp_bruto),
      formatRupiah(r.pph21),
      formatRupiah(r.potongan_iwp),
      formatRupiah(r.tpp_diterima),
      "",
    ]);

    columnStyles = {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 42 },
      2: { cellWidth: 20 },
      16: { cellWidth: 10, halign: "center" },
    };
  }

  /* =====================================================
     MODE REKAP PERSEN (FULL PAGE)
  ===================================================== */
  else if (modeCetak === "rekappersen") {
    fullWidthMode = true;
    fontSize = 5.2;

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
        "1","2","3","4","5","6","7","8","9","10",
        "11","12","13","14","15","16","17","18"
      ],
    ];

    body = processedData.map((r, i) => [
      i + 1,
      `${r.nama || "-"}\n${r.nip || "-"}`,
      r.jabatan_nama || "-",
      r.kelas_jabatan || "-",

      formatPersen(r.kinerjaPersen),
      formatPersen(r.tidak_menilai_bawahan_persen),

      formatPersen(r.persen_alfa),
      formatPersen(r.persen_tidak_apel),

      formatPersen(r.persen_tmk1),
      formatPersen(r.persen_tmk2),
      formatPersen(r.persen_tmk3),
      formatPersen(r.persen_tmk4),

      formatPersen(r.persen_psw1),
      formatPersen(r.persen_psw2),
      formatPersen(r.persen_psw3),
      formatPersen(r.persen_psw4),

      formatPersen(r.persen_tidak_absen_sore),
      formatPersen(r.potongan_persen),
    ]);

    columnStyles = {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 42 },
      2: { cellWidth: 20 },
      3: { cellWidth: 10, halign: "center" },
    };
  }

  /* =====================================================
     BULANAN (tetap)
  ===================================================== */
  else if (isBulanan) {
    fontSize = 9;

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

    body = processedData.map((r, i) => [
      i + 1,
      `${r.nama || "-"}\n${r.nip || "-"}`,
      formatRupiah(r.besaran_tpp),
      Number(r.total_aktivitas || 0),
      `${formatDurasi(r.total_durasi)} Jam`,
      formatPersen(r.persen_kinerja),
      `${Number(r.jumlah_hari_kerja || 0)} Hari`,
      formatRupiah(r.tpp_kinerja),
    ]);
  }

  /* =====================================================
     HARIAN (tetap)
  ===================================================== */
  else {
    fontSize = 9;

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

    body = processedData.map((r, i) => [
      i + 1,
      `${r.nama || "-"}\n${r.nip || "-"}`,
      r.tanggal
        ? new Date(r.tanggal).toLocaleDateString("id-ID")
        : "-",
      Number(r.jumlah_aktivitas || 0),
      `${formatDurasi(r.total_durasi)} Jam`,
      formatPersen(r.persen_kinerja_harian),
    ]);
  }


  console.log("===== FINAL DATA FOR PDF =====");
  console.log("Columns sample:", body?.[0]);

  /* =====================================================
     TABLE
  ===================================================== */
  autoTable(doc, {
    startY: tableStartY,
    theme: "grid",

    pageBreak: "auto",
    rowPageBreak: "avoid",
    
    head,
    body,
    columnStyles,

    tableWidth: fullWidthMode ? pageWidth - 8 : "auto",

    margin: {
      left: 4,
      right: 4,
      top: tableStartY,
      bottom: 10,
    },

    showHead: "everyPage",

    styles: {
      fontSize,
      cellPadding: 1,
      valign: "middle",
      overflow: "linebreak",
      cellWidth: "wrap",
      
      lineWidth: 0.15,
      lineColor: [160, 160, 160],
      textColor: 0,
    },

    didParseCell: (d) => {
      if (d.section === "head") {
        const last = head.length - 1;

        d.cell.styles.halign = "center";
        d.cell.styles.valign = "middle";
        d.cell.styles.fontStyle = "bold";

        if (d.row.index === last) {
          d.cell.styles.fillColor = [255, 255, 255];
          d.cell.styles.textColor = 0;
          d.cell.styles.fontSize = fontSize - 0.4;
          d.cell.styles.minCellHeight = 4;
          d.cell.styles.cellPadding = 0.8;
        } else {
          d.cell.styles.fillColor = [41, 128, 185];
          d.cell.styles.textColor = 255;
          d.cell.styles.minCellHeight = 8;
          d.cell.styles.lineWidth = 0;
        }
      }

      if (d.section === "body") {
        d.cell.styles.valign = "middle";

        if (d.column.index === 0) {
          d.cell.styles.halign = "center";
        } else if (d.column.index >= 3) {
          d.cell.styles.halign = "right";
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
  let y = doc.lastAutoTable.finalY + 12;

  if (y > pageHeight - 38) {
    doc.addPage();
    addFooter(doc, pageWidth, pageHeight);
    y = 20;
  }

  doc.setFontSize(11);

  doc.text("Padangsidimpuan,", pageWidth - 70, y);
  doc.text(`${tahun}`, pageWidth - 8, y, {
    align: "right",
  });

  doc.text(
    capitalizeWords(penandatangan?.nama || "-"),
    pageWidth - 70,
    y + 24
  );

  doc.text(
    `NIP: ${penandatangan?.nip || "-"}`,
    pageWidth - 70,
    y + 30
  );

  /* =====================================================
     OUTPUT
  ===================================================== */
  doc.output("dataurlnewwindow");
};