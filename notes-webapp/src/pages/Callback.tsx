import { useEffect, useRef, type ReactElement } from "react";
import { Box, CircularProgress, Typography } from "@wso2/oxygen-ui";
import { handleCallback } from "../authz/session";

// The registered redirect URI. Finishes the redirect (or silent-renew) leg once,
// then returns to the app root.
export function CallbackPage(): ReactElement {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void handleCallback().then(() => window.location.replace("/"));
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <CircularProgress size={20} />
      <Typography variant="body1">Signing you in…</Typography>
    </Box>
  );
}
