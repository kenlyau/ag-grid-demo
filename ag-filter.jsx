import React, { forwardRef, useImperativeHandle, useState, useEffect} from "react"
import {v4 as uuidv4} from "uuid"

const genData = () => {
    const len = Math.ceil(Math.random() * 30)
    return Array(len).fill(1).map(() => ({id: uuidv4(), name: uuidv4()}))
}
const AgFilter = forwardRef((props, ref) => {
    const [data, setData] = useState([])
    const [checkeds, setCheckeds] = useState([])

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
        props.onChange(checkeds)
    }
    useEffect(() => {
        console.log("agFilter init")
        //setData(genData())
    }, [])

    useImperativeHandle(ref, () => {
        return {
            afterGuiAttached: (params) => {
                setCheckeds([])
                console.log("agFilter afterGuiAttached")
                setData(genData())
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