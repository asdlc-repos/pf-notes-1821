import type { ReactElement } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AppShell as OxygenAppShell,
  ColorSchemeToggle,
  Divider,
  Footer,
  Header,
  Sidebar,
  UserMenu,
} from "@wso2/oxygen-ui";
import { NotebookText, Settings, User } from "@wso2/oxygen-ui-icons-react";
import { Can, useAuthz, useHeldRoles } from "../authz/gates";
import { signOut } from "../authz/session";
import { APP_NAME } from "../appName";
import { useNavigate } from "react-router-dom";

export function AppShell(): ReactElement {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { username } = useAuthz();
  const roles = useHeldRoles();
  const name = username || "Signed in";
  const active = pathname.startsWith("/notes") ? "notes" : "";

  return (
    <OxygenAppShell>
      <OxygenAppShell.Navbar>
        <Header>
          <Header.Toggle />
          <Header.Brand>
            <Header.BrandTitle>{APP_NAME}</Header.BrandTitle>
          </Header.Brand>
          <Header.Spacer />
          <Header.Actions>
            <ColorSchemeToggle />
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <UserMenu>
              <UserMenu.Trigger name={name} />
              <UserMenu.Header name={name} email="" role={roles.join(", ") || undefined} />
              <UserMenu.Item icon={<User />} label="Account" onClick={() => navigate("/account")} />
              <UserMenu.Item icon={<Settings />} label="Settings" onClick={() => navigate("/settings")} />
              <UserMenu.Divider />
              <UserMenu.Logout onClick={() => void signOut()} label="Sign out" />
            </UserMenu>
          </Header.Actions>
        </Header>
      </OxygenAppShell.Navbar>

      <OxygenAppShell.Sidebar>
        <Sidebar activeItem={active}>
          <Sidebar.Nav>
            <Sidebar.Category>
              <Can op="GET /notes">
                <Sidebar.Item id="notes" link={<Link to="/notes" />}>
                  <Sidebar.ItemIcon>
                    <NotebookText />
                  </Sidebar.ItemIcon>
                  <Sidebar.ItemLabel>Notes</Sidebar.ItemLabel>
                </Sidebar.Item>
              </Can>
            </Sidebar.Category>
          </Sidebar.Nav>
        </Sidebar>
      </OxygenAppShell.Sidebar>

      <OxygenAppShell.Main>
        <Outlet />
      </OxygenAppShell.Main>

      <OxygenAppShell.Footer>
        <Footer>
          <Footer.Copyright>© WSO2 LLC</Footer.Copyright>
        </Footer>
      </OxygenAppShell.Footer>
    </OxygenAppShell>
  );
}
