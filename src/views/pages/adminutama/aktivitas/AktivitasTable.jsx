import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton
} from "@coreui/react";


export default function AktivitasTable({
  data = [],
  onEdit,
  onDelete,
  selectedRows = [],
  setSelectedRows
}) {

  // toggle 1 item
  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // select all
  const toggleAll = (checked) => {
    if (checked) {
      setSelectedRows(data.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <CTable bordered hover responsive>
      <CTableHead>
        <CTableRow>
          {/* CHECKBOX HEADER */}
          <CTableHeaderCell style={{ width: 40 }}>
            <input
              type="checkbox"
              checked={selectedRows.length === data.length && data.length > 0}
              onChange={(e) => toggleAll(e.target.checked)}
            />
          </CTableHeaderCell>

          <CTableHeaderCell>Nama</CTableHeaderCell>
          <CTableHeaderCell>Tanggal</CTableHeaderCell>
          <CTableHeaderCell>Kegiatan</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Aksi</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        {data.map((item) => (
          <CTableRow key={item.id}>
            {/* CHECKBOX ROW */}
            <CTableDataCell>
              <input
                type="checkbox"
                checked={selectedRows.includes(item.id)}
                onChange={() => toggleRow(item.id)}
              />
            </CTableDataCell>

            <CTableDataCell>{item.nama}</CTableDataCell>
            <CTableDataCell>{item.tanggal}</CTableDataCell>
            <CTableDataCell>{item.nama_kegiatan}</CTableDataCell>
            <CTableDataCell>{item.status}</CTableDataCell>

            <CTableDataCell>
              <CButton size="sm" onClick={() => onEdit(item)}>
                Edit
              </CButton>

              <CButton
                size="sm"
                color="danger"
                className="ms-2"
                onClick={() => onDelete(item.id)}
              >
                Hapus
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
}