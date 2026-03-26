import { Box } from '@mui/material';
import { DataGrid, arSD } from '@mui/x-data-grid';

/**
 * A reusable data table component with RTL and Arabic localization.
 *
 * @param {object} props
 * @param {boolean} props.loading - Whether the table is in a loading state.
 * @param {array} props.rows - The rows to display.
 * @param {array} props.columns - The column definitions.
 * @param {number} props.rowCount - The total number of rows (for server-side pagination).
 * @param {object} props.paginationModel - The current pagination model.
 * @param {function} props.onPaginationModelChange - Callback for when the pagination model changes.
 */
const DataTable = ({
  loading,
  rows,
  columns,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}) => {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 20]}
        paginationMode="server"
        localeText={arSD.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'right',
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
