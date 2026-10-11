Feature: F2 Create notes

  @story-F2.1 @story-F2.3
  Rule: A member creates a note with a title and a body and lands on it

    Scenario: Creating a complete note
      When Dana creates a note with the title "Sprint goals" and the body "Ship the pin feature by Friday"
      Then Dana is looking at the note "Sprint goals" with the body "Ship the pin feature by Friday"

  @story-F2.1
  Rule: The body of a note is optional

    Scenario: A note with a title only
      When Dana creates a note with the title "Reminder" and no body
      Then Dana is looking at the note "Reminder" with an empty body

  @story-F2.2
  @negative
  Rule: A note cannot be saved without a title

    Scenario: Saving without a title
      Given Dana has opened a new team with no notes
      When Dana tries to create a note with no title and the body "Orphan text"
      Then the team still has no notes

  @story-F2.1
  @negative
  Rule: A title is limited to 200 characters and a body to 10,000

    Scenario: A title of 201 characters
      Given Dana has opened a new team with no notes
      When Dana tries to create a note whose title is 201 characters long
      Then the team still has no notes

  @story-F2.4
  Rule: A new note appears in the team's list with its creator as author

    Scenario: Another member sees the new note
      Given Dana has created a note titled "Sprint goals"
      When Mark the member opens the notes list
      Then the list shows "Sprint goals" with Dana as author

  @story-F2.1
  @negative
  Rule: Only signed-in members can create notes

    Scenario: A visitor who is not signed in tries to create a note
      Given the team has a known number of notes
      When a visitor who is not signed in tries to create a note titled "Sneaky"
      Then the number of notes is unchanged
