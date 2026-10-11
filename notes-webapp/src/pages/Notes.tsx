import type { ReactElement } from "react";
import { PageContent, PageTitle } from "@wso2/oxygen-ui";

// Foundation shell: the screen's content is built by a later item.
export function NotesPage(): ReactElement {
  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>Team notes</PageTitle.Header>
      </PageTitle>
    </PageContent>
  );
}
