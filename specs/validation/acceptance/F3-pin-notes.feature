Feature: F3 Pin notes

  @story-F3.1 @story-F3.3
  Rule: A pinned note is listed above notes that are not pinned

    Scenario: Pinning an older note moves it to the top
      Given Dana created a note titled "Old but important" and then a note titled "Fresh chatter", neither pinned
      When Mark pins "Old but important"
      Then "Old but important" is listed above "Fresh chatter" and is marked as pinned

  @story-F3.1
  Rule: Any member may pin any note

    Scenario: A member pins a note written by someone else
      Given Dana has created a note titled "Sprint goals"
      When Mark the member pins "Sprint goals"
      Then "Sprint goals" is pinned

  @story-F3.2
  Rule: A pinned note can be unpinned

    Scenario: Unpinning returns the note to its place by date
      Given Dana created "Old note" and then "New note", and "Old note" is pinned
      When Mark unpins "Old note"
      Then "New note" is listed above "Old note" and "Old note" is not marked as pinned

  @story-F3.3
  Rule: Pinned notes are ordered newest first among themselves

    Scenario: Two pinned notes
      Given Dana created "First pinned" and then "Second pinned", and both are pinned
      When Mark opens the notes list
      Then "Second pinned" is listed above "First pinned"

  @story-F3.1 @story-F3.3
  Rule: A pin is shared by the whole team

    Scenario: Another member sees the pin
      Given Mark has pinned the note "Sprint goals"
      When Priya the member opens the notes list
      Then "Sprint goals" is listed first and marked as pinned for Priya

  @story-F3.4
  Rule: A note shows whether it is pinned when read

    Scenario: Reading a pinned note
      Given Mark has pinned the note "Sprint goals"
      When Priya opens "Sprint goals"
      Then the note is shown as pinned

  @story-F3.1
  @negative
  Rule: Only signed-in members can pin notes

    Scenario: A visitor who is not signed in tries to pin
      Given Dana has created a note titled "Sprint goals" that is not pinned
      When a visitor who is not signed in tries to pin "Sprint goals"
      Then "Sprint goals" is still not pinned
