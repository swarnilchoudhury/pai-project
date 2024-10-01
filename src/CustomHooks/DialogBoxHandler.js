import { useDialogBox } from '../Context/DialogBoxContext';

const useDialogBoxHandler = () => {

    const { setShowDialogBoxContent } = useDialogBox();

    const showDialogBox = (showDialogBoxDetails) => {

        setShowDialogBoxContent({
            dialogTextContent: showDialogBoxDetails.dialogTextContent,
            dialogTextTitle: showDialogBoxDetails.dialogTextTitle,
            dialogTextButton: showDialogBoxDetails.dialogTextButton,
            showCancelBtn: showDialogBoxDetails.showCancelBtn,
            showDefaultButton: showDialogBoxDetails.showDefaultButton,
            showButtons: showDialogBoxDetails.showButtons,
            dialogTextButtonOnConfirmId: showDialogBoxDetails.dialogTextButtonOnConfirmId,
            dialogTextButtonOnConfirm: showDialogBoxDetails.dialogTextButtonOnConfirm,
            clickFunctionsOnConfirmFunction: showDialogBoxDetails.clickFunctionsOnConfirmFunction
        });
    };

    return { showDialogBox };
};

export default useDialogBoxHandler;
