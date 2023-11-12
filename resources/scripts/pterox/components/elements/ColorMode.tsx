import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { HiOutlineColorSwatch } from 'react-icons/hi';
const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      backgroundColor: "var(--ptx-secondary)",
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
        color: 'var(--ptx-text)',
      },
      '& .MuiMenuItem-root': {
        '&:hover': {
          backgroundColor: 'var(--ptx-button)',
        },
      },
    },
}));


const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--wp-background)',
    color: 'var(--wp-textcolor)',
    boxShadow: theme.shadows[1],
    fontSize: 15,
    fontWeight: 100,
  },
}));

export default () => {
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    if (Cookies.get("colormode") == 'colormode1'){
        document.body.classList.add('colormode1');
        document.body.classList.remove('colormode2');
        document.body.classList.remove('colormode3');
        document.body.classList.remove('colormode4');
        document.body.classList.remove('colormode5');

    } 
    else if (Cookies.get("colormode") == 'colormode3'){
        document.body.classList.add('colormode3');
        document.body.classList.remove('colormode1');
        document.body.classList.remove('colormode2');
        document.body.classList.remove('colormode4');
        document.body.classList.remove('colormode5');
    }
    else if (Cookies.get("colormode") == 'colormode4'){
        document.body.classList.add('colormode4');
        document.body.classList.remove('colormode1');
        document.body.classList.remove('colormode2');
        document.body.classList.remove('colormode3');
        document.body.classList.remove('colormode5');
    }
    else if (Cookies.get("colormode") == 'colormode5'){
      document.body.classList.add('colormode5');
      document.body.classList.remove('colormode1');
      document.body.classList.remove('colormode2');
      document.body.classList.remove('colormode3');
      document.body.classList.remove('colormode4');
    }
    else {
        document.body.classList.add('colormode2');
        document.body.classList.remove('colormode3');
        document.body.classList.remove('colormode1');
        document.body.classList.remove('colormode4');
        document.body.classList.remove('colormode5');
    }

    const colormode1 = () => {
      Cookies.set("colormode", "colormode1", {
        expires: 365,
        secure: true,
        sameSite: 'strict',
      });
      document.body.classList.add('colormode1');
      document.body.classList.remove('colormode2');
      document.body.classList.remove('colormode3');
      document.body.classList.remove('colormode4');
      document.body.classList.remove('colormode5');
    }
    const colormode2 = () => {
      Cookies.set("colormode", "colormode2", {
        expires: 365,
        secure: true,
        sameSite: 'strict',
      });
      document.body.classList.add('colormode2');
      document.body.classList.remove('colormode1');
      document.body.classList.remove('colormode3');
      document.body.classList.remove('colormode4');
      document.body.classList.remove('colormode5');
    }
    const colormode3 = () => {
      Cookies.set("colormode", "colormode3", {
        expires: 365,
        secure: true,
        sameSite: 'strict',
      });
      document.body.classList.add('colormode3');
      document.body.classList.remove('colormode2');
      document.body.classList.remove('colormode1');
      document.body.classList.remove('colormode4');
      document.body.classList.remove('colormode5');
    }
    const colormode4 = () => {
      Cookies.set("colormode", "colormode4", {
        expires: 365,
        secure: true,
        sameSite: 'strict',
      });
      document.body.classList.add('colormode4');
      document.body.classList.remove('colormode2');
      document.body.classList.remove('colormode1');
      document.body.classList.remove('colormode3');
      document.body.classList.remove('colormode5');
    }
    return (
        <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        style={{
          backgroundColor: "var(--ptx-button)",
      }}
      startIcon={<HiOutlineColorSwatch />}
      sx={{ width: 50}}
      >
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }} 
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={colormode1} disableRipple>
          1
        </MenuItem>
        <Divider sx={{ my: 0.5 , bgcolor: 'var(--ptx-text)'}} />
        <MenuItem onClick={colormode2} disableRipple>
          2
        </MenuItem>
        <Divider sx={{ my: 0.5 , bgcolor: 'var(--ptx-text)' }} />
        <MenuItem onClick={colormode3} disableRipple>
          3
        </MenuItem>
        <Divider sx={{ my: 0.5 , bgcolor: 'var(--ptx-text)'}} />
        <MenuItem onClick={colormode4} disableRipple>
          4
        </MenuItem>
      </StyledMenu>
    </div>
    );
};
