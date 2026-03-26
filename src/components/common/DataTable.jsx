import { useState } from 'react';
import { Box, Paper, InputAdornment, TextField, IconButton } from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { arSD } from '@mui/x-data-grid/locales';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function QuickSearchToolbar(props) {
  const { t } = useTranslation();
  return (
    <GridToolbarContainer
      sx={{ p: 2, justifyContent: 'space-between' }}
    >
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder={t('dataTable.searchPlaceholder')}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          endAdornment: (
            <IconButton
              title={t('dataTable.clearSearch')}
              aria-label={t('dataTable.clearSearch')}
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </GridToolbarContainer>
  );
}

const DataTable = ({
  loading,
  rows,
  columns,
  rowCount,
  paginationModel,
  onPaginationModelChange,
  onSearch,
}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    if (onSearch) {
      onSearch(newSearchText);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <Paper sx={{ height: 600, width: '100%', overflow: 'hidden' }}>
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
        slots={{
          toolbar: QuickSearchToolbar,
        }}
        slotProps={{
          toolbar: {
            value: searchText,
            onChange: handleSearch,
            clearSearch: handleClearSearch,
          },
        }}
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'action.hover',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      />
    </Paper>
  );
};

export default DataTable;
