import { CButton } from "@coreui/react";

const CetakButton = ({ color, onClick }) => (
  <CButton size="sm" color={color} onClick={onClick}>
    CETAK
  </CButton>
);

export default CetakButton;