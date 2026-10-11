import type { ReactElement } from "react";
import { PageContent, PageTitle } from "@wso2/oxygen-ui";

// Foundation shell: the screen's content is built by a later item.
export function AccountPage(): ReactElement {
  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>Account</PageTitle.Header>
      </PageTitle>
    </PageContent>
  );
}
