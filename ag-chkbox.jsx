import React, {useState, useImperativeHandle, forwardRef} from "react"

const AgChkbox = forwardRef((props, ref) => {
    
    console.log("re", props) 
    const handler = (evt) => {        
        props.node.setSelected(!props.node.selected)
    }
    useImperativeHandle(ref, () => {
        return {
            refresh: (params) => {} 
        }
    })
    return (
         <div onClick={handler} onMouseDown={e => e.stopPropagation()} style={{position: "relative", zIndex: 10, height: 40, width: 40, marginLeft: -40}}>
         </div>
     )
})

export default AgChkbox
