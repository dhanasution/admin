import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";

import CetakButton from "./CetakButton";

const CetakTable = ({ onCetak }) => {
  return (
    <CTable bordered responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell rowSpan={2}>
            Keterangan
          </CTableHeaderCell>

          <CTableHeaderCell colSpan={2} className="text-center">
            Cetak
          </CTableHeaderCell>
        </CTableRow>

        <CTableRow>
          <CTableHeaderCell className="text-center">
            PNS
          </CTableHeaderCell>

          <CTableHeaderCell className="text-center">
            PPPK / PPPK PW
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>

        {/* HARIAN */}
        <CTableRow>
          <CTableDataCell>
            Rekap Aktivitas Pegawai Harian
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="primary"
              onClick={() =>
                onCetak(
                  null,
                  "LAPORAN AKTIVITAS PNS HARIAN",
                  "harian",
                  "PNS"
                )
              }
            />
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="secondary"
              onClick={() =>
                onCetak(
                  null,
                  "LAPORAN AKTIVITAS PPPK HARIAN",
                  "harian",
                  "PPPK"
                )
              }
            />
          </CTableDataCell>
        </CTableRow>

        {/* BULANAN */}
        <CTableRow>
          <CTableDataCell>
            Rekap Aktivitas Pegawai Bulanan
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="primary"
              onClick={() =>
                onCetak(
                  null,
                  "LAPORAN AKTIVITAS PNS BULANAN",
                  "bulanan",
                  "PNS"
                )
              }
            />
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="secondary"
              onClick={() =>
                onCetak(
                  null,
                  "LAPORAN AKTIVITAS PPPK BULANAN",
                  "bulanan",
                  "PPPK"
                )
              }
            />
          </CTableDataCell>
        </CTableRow>

        {/* REKAP POTONGAN */}
        <CTableRow>
          <CTableDataCell>
            Rekap Pengurangan Tambahan Penghasilan Pegawai
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="primary"
              onClick={() =>
                onCetak(
                  null,
                  "REKAP PENGURANGAN TAMBAHAN PENGHASILAN PEGAWAI ASN",
                  "rekappersen",
                  "PNS"
                )
              }
            />
          </CTableDataCell>

          <CTableDataCell></CTableDataCell>
        </CTableRow>

        {/* TPP */}
        <CTableRow>
          <CTableDataCell>
            Daftar Tambahan Penghasilan Pegawai
          </CTableDataCell>

          <CTableDataCell className="text-center">
            <CetakButton
              color="primary"
              onClick={() =>
                onCetak(
                  null,
                  "DAFTAR TAMBAHAN PENGHASILAN PEGAWAI ASN",
                  "tpptotap",
                  "PNS"
                )
              }
            />
          </CTableDataCell>

          <CTableDataCell></CTableDataCell>
        </CTableRow>

      </CTableBody>
    </CTable>
  );
};

export default CetakTable;