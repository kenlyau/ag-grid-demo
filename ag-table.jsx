import React, {useState, useEffect, useRef, useImperativeHandle} from "react"
import {v4 as uuidv4, v5 as uuidv5} from "uuid"
import {AgGridReact} from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import AgChkbox from "./ag-chkbox"
import AgFilter from "./ag-filter"

const genRowData = () => {
    const cols = Array(55).fill(1).map(i => uuidv4())
    const rows = Array(500).fill(1).map(i => {
         const obj = {}
         cols.map(j => obj[j] = uuidv4())
         return obj
    })
    return rows
}


const AgTable = () => {
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([])
    const [gridApi, setGridApi] = useState()
    const [gridColumnApi, setGridColumnApi] = useState()
    const eleRef = useRef()
    const onCellClicked = (e) => {
	e.event.preventDefault()
        e.event.stopPropagation()
    }
    const onCellMouseDown = (e) => {
        console.log(e)
    }
    const onGridReady = (params) => {
         window.agApi = params.api
         window.agColumnApi = params.columnApi
         setGridApi(params.api)
         setGridColumnApi(params.columnApi)
    }
    const handleFilter = (data) => {
        console.log("handleFilter", data)
    }
    useEffect(() => {
 	setTimeout(() => {
	    const _rowData = genRowData()
            setRowData(_rowData)
            const _columns = Object.keys(_rowData[0]).map((item, index) => {
                const _column = {
                  field: item,
                  resizable: true,
                  sortable: true,
                }
                if (index % 2){
                    _column.filterFramework = AgFilter
                    _column.filterParams = {onChange: handleFilter}
                }
                if (index % 3) {
                    _column.unSortIcon = true
                }
                console.log(_column)
                return _column
            })
            const chkCol = {
                field: "checkbox",
                headerName: "",
                cellClass: "mykk",
                headerCheckboxSelection: true,
                checkboxSelection: true,
                cellRendererFramework: AgChkbox, 
           }
           setColumnDefs([chkCol,..._columns])
           console.log("rowdata", _rowData)
           console.log("columns", _columns)
        }, 1000)

    }, [])
    return (
      <>
          <h2>ag-table</h2>
          <div ref={eleRef} className="ag-theme-balham" style={{height: 500}}>
          <AgGridReact
             rowData={rowData}
             enableCellTextSelection={true}
             rowSelection={"multiple"}
             onCellClicked={onCellClicked}
             onCellMouseDown={onCellMouseDown}
             onGridReady={onGridReady}
             columnDefs={columnDefs}
             suppressMenuHide={true}
             suppressRowClickSelection={true}
          />
          </div>
      </>
    )
}

export default AgTable

