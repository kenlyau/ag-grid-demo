import React, {useState, useEffect, useRef, useImperativeHandle} from "react"
import {v4 as uuidv4, v5 as uuidv5} from "uuid"
import {AgGridReact} from "ag-grid-react"
import "ag-grid-community/dist/styles/ag-grid.css"
import "ag-grid-community/dist/styles/ag-theme-balham.css"
import AgChkbox from "./ag-chkbox"
import AgFilter from "./ag-filter"

const genRowData = () => {
    const cols = Array(25).fill(1).map((_, i) => String.fromCharCode(65 +i))
    const rows = Array(500).fill(1).map(i => {
         const obj = {
            uid: uuidv4()
         }
         cols.map(j => obj[j] = uuidv4())
         return obj
    })
    return rows
}


const AgTable = () => {
    const [rowData, setRowData] = useState([])
    const [columnDefs, setColumnDefs] = useState([])
    
    const gridApiRef = useRef()
    const gridColumnApiRef = useRef()
    const eleRef = useRef()
    const onCellClicked = (e) => {
        if (window.getSelection().toString()){
            //如果有内容，说明是在选择文本，不触发切换当前行事件
            console.log(window.getSelection().toString())
        } else {
            setCurrentRowNode(e.rowIndex)
        }

    }
    const onCellContextMenu  = (e) => {
        alert("cell contextmenu")
    }

    const onGridReady = (params) => {
         window.agApi = params.api
         window.agColumnApi = params.columnApi
         gridApiRef.current = params.api
         gridColumnApiRef.current = params.columnApi
         params.api.gridCore.eRootWrapperBody.querySelector(".ag-center-cols-container").addEventListener("mousedown", e => {
            
            e.stopPropagation()
         })
    }
    const getAllRowNode = () => {
        let arr = []
        gridApiRef.current.forEachNode(i => arr.push(i))
        return arr
    }
    const getCurrentRowNode = () => {
        const rows = getAllRowNode()
        return rows.find(row => row.data.current)
    }

    const setCurrentRowNode = (rowIndex) => {
        const rows = getAllRowNode()
        const updateRows = []
        const current = rows.find(item => item.data.current)
        if (rowIndex < 0 || rowIndex >= rows.length){
            //超出数据范围，不切换
            return
        }
        if (current) {
            updateRows.push(Object.assign({}, current.data, {current: false}))
        }
        const next = rows.find(item => item.rowIndex === rowIndex)
        if (next){
            updateRows.push(Object.assign({}, next.data, {current: true}))
        }
        
        gridApiRef.current.applyTransaction({
            update: updateRows
        })
        gridApiRef.current.ensureIndexVisible(next.rowIndex)
        console.log("切换当前行", next)
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

        const handleKeyup = (e) => {
            if (e.key == "ArrowUp"){
                console.log("arrow up")
                const currentRow = getCurrentRowNode()
                if (!currentRow){
                    setCurrentRowNode(0)
                } else {
                    setCurrentRowNode(currentRow.rowIndex - 1)
                }

            } else if (e.key == "ArrowDown"){
                console.log("arrow down")
                const currentRow = getCurrentRowNode()
                if (!currentRow){
                    setCurrentRowNode(0)
                } else {
                    setCurrentRowNode(currentRow.rowIndex + 1)
                }
            }
        }

        document.addEventListener("keyup", handleKeyup)
        return () => {
            document.removeEventListener("keyup", handleKeyup)
        }

    }, [])
    return (
      <>
          <h2>ag-table</h2>
          <div ref={eleRef} className="ag-theme-balham" style={{height: 500}}>
          <AgGridReact
             rowData={rowData}
             getRowNodeId={(data) => data.uid}
             rowClassRules={{"ag-row-current": (row) => row.data.current}}
             enableCellTextSelection={true}
             rowSelection={"multiple"}
             onCellClicked={onCellClicked}
             onCellContextMenu={onCellContextMenu}
             onGridReady={onGridReady}
             suppressCellSelection={true}
             suppressRowClickSelection={true}
             columnDefs={columnDefs}
             suppressKeyboardEvent={(e) => {e.event.preventDefault(); return true}}
             preventDefaultOnContextMenu={true}
             suppressMenuHide={true}
             suppressRowClickSelection={true}
          />
          </div>
      </>
    )
}

export default AgTable

