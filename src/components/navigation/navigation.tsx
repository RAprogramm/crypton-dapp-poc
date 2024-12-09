import React, { useState } from "react";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Link, Menu, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useMetamask } from "../../hooks";

type NavigationData = {
  path: string;
  label: string;
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { account, connectWallet, setAccount, setProvider, setNetwork, setErrorMessage } =
    useMetamask();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
    }
    handleMenuClose();
  };

  const handleDisconnect = () => {
    setAccount(null);
    setProvider(null);
    setNetwork(null);
    setErrorMessage(null);

    handleMenuClose();
  };

  const handleReconnect = () => {
    handleMenuClose();
    connectWallet();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" },
      }}
    >
      {navigations.map(({ path: destination, label }: NavigationData) => (
        <Box
          key={label}
          component={Link}
          href={destination}
          sx={{
            display: "inline-flex",
            position: "relative",
            color: currentPath === destination ? "primary.main" : "white",
            lineHeight: "30px",
            letterSpacing: "3px",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "20px",
            "&:hover": { color: "text.disabled" },
          }}
        >
          {label}
        </Box>
      ))}
      <Box
        sx={{
          position: "relative",
          color: "white",
          cursor: "pointer",
          textTransform: "uppercase",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 0, lg: 3 },
          mb: { xs: 3, lg: 0 },
          fontSize: "24px",
          lineHeight: "6px",
          width: "324px",
          height: "45px",
          borderRadius: "6px",
          backgroundColor: account ? "#A5CC82" : "#00dbe3",
        }}
        onClick={account ? handleMenuOpen : connectWallet}
      >
        {account ? `${account.substring(0, 6)}...` : "Connect Wallet"}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCopyAddress}>Copy Address</MenuItem>
        <MenuItem onClick={handleReconnect}>Reconnect</MenuItem>
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </Box>
  );
};

export default Navigation;
