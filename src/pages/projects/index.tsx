import React from "react";
import PrivateRoute from "../../components/PrivateRoute";
import { Box, Typography } from "@mui/material";

export default function Projects() {
  return (
    <PrivateRoute>
      {" "}
      <Box className="main-padding">
        <Box className="title-main">
          <Typography>Projects</Typography>
        </Box>
      </Box>
    </PrivateRoute>
  );
}
