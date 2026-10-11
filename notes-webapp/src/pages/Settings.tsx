import type { ReactElement } from "react";
import { PageContent, PageTitle } from "@wso2/oxygen-ui";

// Foundation shell: the screen's content is built by a later item.
export function SettingsPage(): ReactElement {
  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>Settings</PageTitle.Header>
      </PageTitle>
    </PageContent>
  );
}
