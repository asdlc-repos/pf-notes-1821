Feature: F1 List and read notes

  @story-F1.1
  Rule: A member sees every team note with its title, author and created date

    Scenario: Notes written by two teammates appear in the list
      Given Dana has created a note titled "Sprint goals" and Priya has created a note titled "Retro ideas"
      When Mark the member opens the notes list
      Then the list shows "Sprint goals" with Dana as author and its created date
      And the list shows "Retro ideas" with Priya as author and its created date

  @story-F1.1
  Rule: Notes that are not pinned are listed newest first

    Scenario: The more recent note is listed above the older one
      Given Dana created a note titled "Older note" and then a note titled "Newer note", neither pinned
      When Mark the member opens the notes list
      Then "Newer note" is listed above "Older note"

  @story-F1.2
  Rule: A member opens a note to read its full body

    Scenario: Opening a note shows title and body
      Given Dana has created a note titled "Sprint goals" with the body "Ship the pin feature by Friday"
      When Mark opens "Sprint goals" from the list
      Then he reads the title "Sprint goals" and the body "Ship the pin feature by Friday"

  @story-F1.3
  Rule: A team with no notes sees an empty-list message

    Scenario: No notes yet
      Given the team has no notes
      When Mark the member opens the notes list
      Then the list shows a message that there are no notes yet

  @story-F1.1
  @negative
  Rule: Only signed-in members can see the notes

    Scenario: A visitor who is not signed in
      Given Dana has created a note titled "Sprint goals"
      When a visitor who is not signed in opens the notes list
      Then no notes are shown to the visitor
