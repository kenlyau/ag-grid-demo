import React, {useImperativeHandle, forwardRef} from "react"

const AgChkbox = forwardRef((props, ref) => {

    const handler = (evt) => {        
        props.node.setSelected(!props.node.selected)
    }
    useImperativeHandle(ref, () => {
        return {
            refresh: (params) => {
                return true
            } 
        }
    })
    return (
         <div onClick={handler} onMouseDown={e => e.stopPropagation()} style={{position: "relative", zIndex: 10, height: 40, width: 40, marginLeft: -40}}>
         </div>
     )
})

export default AgChkbox
