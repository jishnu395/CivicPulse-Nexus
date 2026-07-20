import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CitizenTable = ({
  citizens,
  loading,
  onView,
  onEdit,
  onDelete,
  role,
}) => {
  const columns = [
    {
      field: "citizenId",
      headerName: "Citizen ID",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.4,
      minWidth: 180,
      valueGetter: (_, row) =>
        `${row.firstName} ${row.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.6,
      minWidth: 220,
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "wardNumber",
      headerName: "Ward",
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "ACTIVE" ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 170,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => onView(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              color="warning"
              onClick={() => onEdit(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          {role === "ADMIN" && (
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() => onDelete(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={citizens}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
};

export default CitizenTable;