import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import "../../ComponetsStyles/NavBar.css"
import DialogBoxes from '../DialogBoxes/DialogBoxes';
import PropTypes from 'prop-types';
import { usePermissions } from '../Context/PermissionContext';


const NavBar = ({ UserName }) => {

    //Props validations
    NavBar.propTypes = {
        UserName: PropTypes.string.isRequired
    };

    const [openDialog, setOpenDialog] = useState(false);
    const { editPermissions } = usePermissions();
    let pages = ['Home'];

    if(editPermissions){
        pages = ['Home','Payments'];
    }
    
    let settings = ['Logout'];

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [showMessage, setshowMessage] = useState({
        TextDialogContent: "",
        TextDialogTitle: "",
        TextDialogButton: ""
    });
    const [count, setCount] = useState(0);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setOpenDialog(false);
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    //For Logout
    const handleClickOpen = (e, setting) => {
        if (setting === "Logout") {
            setOpenDialog(true);
            setCount(count => count + 1)
            setshowMessage({
                TextDialogContent: "Are you sure you want to logout?",
                TextDialogTitle: "Logout",
                TextDialogButton: "Logout",
                showCancelBtn: true
            });
        }

    };

    return (
        <div>
            <AppBar position="static">
                <Container maxWidth="xl" className="container-NavBar">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Welcome,{UserName}
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center"
                                            key={page}
                                            component={Link}
                                            to={"/".concat(page)}
                                            sx={{ textDecoration: "none", color: "black" }}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                color: "inherit",
                                fontSize: 16,
                                marginRight: 4,
                                textDecoration: "none"
                            }}
                        >
                            Welcome,{UserName}
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (

                                <Button
                                    key={page}
                                    component={Link}
                                    to={"/".concat(page)}
                                    sx={{ my: 2, color: 'white', display: 'block' }}>
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Profile Image" src="" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center" onClick={e => handleClickOpen(e, setting)}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        {openDialog && <DialogBoxes key={count} {...showMessage} />}
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    )
}

export default NavBar
