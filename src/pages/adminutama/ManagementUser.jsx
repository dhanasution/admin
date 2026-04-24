import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import {
  getUsers,
  updateUserRole,
  getOpdList
} from "../../../services/adminService";

export default function ManagementUser() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [opdList, setOpdList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterOpd, setFilterOpd] = useState("ALL");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [userRes, opdRes] = await Promise.all([
        getUsers(token),
        getOpdList(token)
      ]);

      setUsers(userRes.data.data || []);
      setOpdList(opdRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, role, opdId) => {
    try {
      await updateUserRole(token, {
        user_id: userId,
        role,
        opd_id: role === "admin_opd" ? opdId : null
      });

      fetchData();
    } catch (err) {
      alert("Gagal update role");
    }
  };

  // 🔍 FILTER
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nama?.toLowerCase().includes(search.toLowerCase()) ||
      u.nip?.includes(search);

    const matchOpd =
      filterOpd === "ALL" || u.opd_id === filterOpd;

    return matchSearch && matchOpd;
  });

  return (
    <Box>

      {/* HEADER */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Management User (Admin Utama)
      </Typography>

      {/* FILTER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari Nama / NIP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Select
              fullWidth
              size="small"
              value={filterOpd}
              onChange={(e) => setFilterOpd(e.target.value)}
            >
              <MenuItem value="ALL">Semua OPD</MenuItem>
              {opdList.map((opd) => (
                <MenuItem key={opd.id} value={opd.id}>
                  {opd.nama_opd}
                </MenuItem>
              ))}
            </Select>
          </Grid>

        </Grid>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 2, position: "relative" }}>

        {loading && (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell textAlign="center">Nama</TableCell>
              <TableCell>NIP</TableCell>
              <TableCell>OPD</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nama}</TableCell>
                <TableCell>{u.nip}</TableCell>
                <TableCell>{u.nama_opd || "-"}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u.id, e.target.value, u.opd_id)
                    }
                  >
                    <MenuItem value="pegawai">Pegawai</MenuItem>
                    <MenuItem value="admin_opd">Admin OPD</MenuItem>
                    <MenuItem value="admin_utama">Admin Utama</MenuItem>
                  </Select>

                  {u.role === "admin_opd" && (
                    <Select
                      size="small"
                      value={u.opd_id || ""}
                      sx={{ mt: 1 }}
                      onChange={(e) =>
                        handleRoleChange(u.id, "admin_opd", e.target.value)
                      }
                    >
                      {opdList.map((opd) => (
                        <MenuItem key={opd.id} value={opd.id}>
                          {opd.nama_opd}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Paper>
    </Box>
  );
}