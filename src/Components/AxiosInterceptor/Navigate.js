import { useNavigate } from 'react-router-dom';

export const useNavigationInterceptor = () => {
    const navigate = useNavigate();

    const handleNavigation = (path, data) => {
        navigate(path, data);
    };

    return handleNavigation;
};
