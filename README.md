# DigitalOcean Front-end Coding Challenge

##The Problem:
You have a collection of events represented as Javascript Objects, each with at least the following properties: `starts_at` INT, `duration` INT, and optionally `title` STRING, or `location` STRING.

`starts_at` is represented in minutes from 9am today, and duration is represented in minutes from `starts_at`.

You can assume the collection of events is unsorted.

##Sample events:
```
var events = [
  {starts_at: 120, duration: 45, title: "Meeting with Ben", location: "Coffee Shop"},
  {starts_at: 240, duration: 60, title: "Lunch with Karl", location: "TBA"},
  {starts_at: 75, duration: 60, title: "Sync with John"},
  {starts_at: 360, duration: 25},
  {starts_at: 420, duration: 120}
];
```

##Challenge:
Render these events to the page in a similar way to a typical calendar application, like 'Google Calendar', Calendar.app, or 'Outlook'. Your solution MUST abide by the following design constraints:

No events may visually overlap. If multiple events collide they MUST have the same width. This is an invariant. Call this width `w`.

`w` should be the maximum value possible without breaking the previous invariant.


The day finishes at 9 PM.

You can structure your code however you like, but you must implement a function in the global namespace called renderEvents which takes an array of events as described above, and renders them to the container according to the above description.

```
window.renderEvents = function(events) {
  ...
}
```
This function will be invoked from the console for purposes of grading this submission. If it cannot be invoked, the submission will be rejected. This function should be idempotent.

**Your solution cannot depend on any third-party libraries.**

##Submission Guidelines

In your submission, please implement a calendar which renders the events listed above, and closely matches this screenshot:<br>
<img src="https://raw.githubusercontent.com/neilbaylor/calendar-hw/master/output.png" width=765px>

Your submission should include an `index.html` which loads all dependent scripts and stylesheets.

You can assume only modern browsers will be used for grading your submission.

Additionally, your submission should be general enough to handle any amount of events, but for the purposes of grading no more than 100 will be used.


##FAQ
**Can I use jQuery?**
Generally speaking, No. If however you can convince us that using jQuery is better than native DOM manipulation, you won’t be marked down.

**Do I need to write Unit Tests?**
No. Your homework will be assessed by running our own collection of events against the renderEvents function.
