import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef} from "react"


const genData = () => {
    return Array(25).fill(1).map((_, i) => {
        return {
            id: String.fromCharCode(65 + i),
            name: String.fromCharCode(65 + i)
        }
    })
}
const AgFilter = forwardRef(({column, onChange, params, filterChangedCallback}, ref) => {
    const [data, setData] = useState([])
    const [checkeds, setCheckeds] = useState([])
    const hidePopRef = useRef()
    const updateChecked = (e) => {
        if (e.target.checked){
            const _checkeds = Array.from(new Set([...checkeds, e.target.value]))
            setCheckeds(_checkeds)
        } else {
            const _checkeds = checkeds.filter(i => i != e.target.value)
            setCheckeds(_checkeds)
        }
    }
    const handler = () => {
        filterChangedCallback()
        hidePopRef.current && hidePopRef.current()
        onChange(checkeds, column.colId)
    }
    useEffect(() => {
        console.log("agFilter init")
        //setData(genData())
        return () => {
            hidePopRef.current = null
            console.log("agFilter destroy")
        }
    }, [])
    console.log("filter params change:", column.colId, params)
    useImperativeHandle(ref, () => {
        return {
            isFilterActive: () => {
                return !!checkeds.length
            },
            doesFilterPass: () => {
                return true
            },
            afterGuiAttached: (params) => {
                //setCheckeds([])
                hidePopRef.current = params.hidePopup
                console.log("agFilter afterGuiAttached", params)

                setData(genData())
            },
            reset: () => {
                console.log("reset", column.colId)
                setCheckeds([])
                filterChangedCallback()
            }
        }
    })
    const styles = {
        wrap: {padding: 10},
        container: {margin: 0, padding: 0, maxHeight: 100, overflow: "auto"},
        item: {listStyle: "none", margin:0, padding: 0}
    }
    return (
        <div style={styles.wrap}>
            <ul style={styles.container}>
                {data.map(item => (
                    <li key={item.id} style={styles.item}>
                        <input
                            type="checkbox"
                            value={item.name} checked={checkeds.includes(item.name)}
                            onChange={updateChecked}
                            />
                        {item.name}
                    </li>
                ))}

            </ul>
            <button onClick={handler}>确定</button>
        </div>
    )
})

export default AgFilter