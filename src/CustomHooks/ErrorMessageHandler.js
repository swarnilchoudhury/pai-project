import { useSnackBar } from '../Context/SnackBarContext';

const useErrorMessageHandler = () => {
    const { setSomethingWentWrong } = useSnackBar();

    const handleErrorMessage = () => {
        setSomethingWentWrong(true);
    };

    return { handleErrorMessage };
};
    
export default useErrorMessageHandler;
