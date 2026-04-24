import { useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// Enterprise features removed as not present in package.json
ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTable = ({
  rowData,
  columnDefs,
  onGridReady,
  onSelectionChanged,
  onColumnChanged,
  paginationPageSize = 10,
  gridId = "defaultGrid",
  enableCheckboxes = true,
  ...props
}) => {
  const gridRef = useRef();

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: false,
    filter: false,
    suppressMenu: true,
    minWidth: 100,
    ...props.defaultColDef,
  }), [props.defaultColDef]);

  const internalOnGridReady = useCallback((params) => {
    gridRef.current = params;
    // Set autoHeight by default
    params.api.setGridOption("domLayout", "autoHeight");

    // Auto-size all columns based on content
    params.api.autoSizeAllColumns();

    if (onGridReady) onGridReady(params);
  }, [onGridReady]);

  const themeClass = props.theme || "ag-theme-custom"; // Using our custom theme by default

  const rowSelectionConfig = enableCheckboxes ? {
    mode: "multiRow",
    headerCheckbox: true,
    checkboxes: true,
    enableClickSelection: false,
  } : undefined;

  return (
    <div id={gridId} className={themeClass} style={{ width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={internalOnGridReady}
        onColumnVisible={onColumnChanged}
        onColumnResized={onColumnChanged}
        onColumnMoved={onColumnChanged}
        domLayout="autoHeight"
        rowSelection={rowSelectionConfig}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[5, 10, 20, 50]}
        onSelectionChanged={(event) => {
          const selectedRows = event.api.getSelectedRows();
          if (onSelectionChanged) onSelectionChanged(selectedRows);
        }}
        autoSizeStrategy={{
          type: 'fitCellContents'
        }}
        defaultColDef={defaultColDef}
        rowHeight={60} // Adjusted to match our previous premium design
        headerHeight={50}
        {...props}
      />
    </div>
  );
};

export default AgGridTable;
