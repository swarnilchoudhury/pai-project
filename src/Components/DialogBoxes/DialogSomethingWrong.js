import React from 'react'
import DialogBoxes from './DialogBoxes'

const DialogSomethingWrong = () => {

    return (
        <DialogBoxes
            TextDialogContent="Something Went Wrong."
            TextDialogTitle=""
            TextDialogButton="OK"
            showCancelBtn={false} />
    )
}

export default DialogSomethingWrong
