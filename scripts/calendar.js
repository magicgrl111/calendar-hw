(function calendar() {

	'use strict';

	var HOURS_PER_DAY = 12, //number of hours in a calendar day
		START_TIME = 9, //start of the calendar day
		START_OF_DAY = new Date().setHours(START_TIME, 0, 0, 0);

	/**
	 * Returns a negative Number if CalendarEvent 'a' should be rendered before CalendarEvent 'b' in the DOM
	 * Note: This function is called as part of a sort on the main array of CalendarEvents
	 *
	 * @param CalendarEvent a
	 * @param CalendarEvent b
	 */
	function sortByEarliestEvent(a, b) {
		var delta = a.starts_at - b.starts_at;
		if (delta === 0) {
			//if two events begin at the same time, show the shorter event first
			return a.duration - b.duration;
		}

		return delta;
	}

	/**
	 * Returns a boolean of whether CalendarEvent 'a' overlaps in time with CalendarEvent 'b'
	 *
	 * @param CalendarEvent a
	 * @param CalendarEvent b
	 */
	function eventsOverlap(a, b) {

	}

	/**
	 * Returns all CalendarEvents that are concurrent to a given CalendarEvent 'e'
	 * Concurrent is defined as any CalendarEvent that overlaps in time with 'e' OR...
	 * any event that overlaps in time with an event that overlaps in time with 'e'
	 *
	 * NOTE: This method returns the events (including the given event) in the order they
	 *       are to be rendered into the DOM
	 *
	 * @param CalendarEvent e
	 * @param Array<CalendarEvent> allEvents
	 */
	function getConcurrentEvents(e, allEvents) {
		var concurrent = [],
			notConcurrent = [],
			adjacentConcurrent, j;

		//get the concurrent events to e
		allEvents.forEach(function(thisE) {
			if (eventsOverlap(e, thisE)) {
				concurrent.push(thisE);
			} else {
				notConcurrent.push(thisE);
			}
		});

		//now check all concurrent nodes for THEIR concurrent nodes until there are no matches
		adjacentConcurrent = concurrent;
		while (adjacentConcurrent.length) {
			adjacentConcurrent.forEach(function(conncurrentE, i) {
				if (i === 0) {
					adjacentConcurrent = [];
				}
				j = notConcurrent.length;
				while (j--) {
					if (eventsOverlap(conncurrentE, notConcurrent[j])) {
						adjacentConcurrent.push(notConcurrent.splice(j, 1)[0]);
					}
				}
			});
			concurrent = concurrent.concat(adjacentConcurrent);
		}

		//return the nodes sorted
		return concurrent.sort(sortByEarliestEvent);
	}

	/**
	 * Returns whether a given CalendarEvent 'e' is renderable
	 * Note: The function is called as part of a filter on the main array of CalendarEvents
	 *
	 * @param CalendarEvent e
	 */
	function removeBadData(e) {
		e.duration = Math.max(0, e.duration);

		//only show events that occur during the calendar hours
		return e.starts_at + e.duration > 0 && e.starts_at <= (HOURS_PER_DAY * 60);
	}

	/**
	 * Adds the concurrentEvents param to an existing CalenderEvent 'e' and returns that CalendarEvent
	 * Note: This function is called as part of a map on the main array of CalendarEvents
	 *
	 * @param CalendarEvent e
	 * @param Integer i
	 * @param Array<CalendarEvent> allEvents
	 */
	function addConcurrentEvents(e, i, allEvents) {
		e.concurrentEvents = getConcurrentEvents(e, allEvents);
		return e;
	}

	/**
	 * Adds the width param to an existing CalenderEvent 'e' and returns that CalendarEvent
	 * Note: This function is called as part of a map on the main array of CalendarEvents
	 *
	 * @param CalendarEvent e
	 */
	function addWidth(e) {
		e.width = 100 / e.concurrentEvents.length;
		return e;
	}

	/**
	 * Adds layout params to an existing CalenderEvent 'e' and returns that CalendarEvent
	 * All params are returned as percentages
	 * Note: This function is called as part of a map on the main array of CalendarEvents
	 *
	 * @param CalendarEvent e
	 */
	function addLayout(e) {
		//the left offset is the sum of all widths of the nodes to the left of 'e'
		e.left = e.concurrentEvents.splice(0, e.concurrentEvents.indexOf(e)).reduce(function(offset, ev) {
			return offset + ev.width;
		}, 0);

		e.top = e.starts_at * 100 / (HOURS_PER_DAY * 60);
		//ensure the event's height and top doesn't overflow the container
		e.height = Math.min(100 - Math.max(0, e.top), (e.duration * 100 / (HOURS_PER_DAY * 60)) + (e.top > 0 ? 0 : e.top));
		e.top = Math.max(0, e.top);

		return e;
	}

	/**
	 * Convenience method that returns 'AM' or 'PM' depending on the 'hour' passed in
	 *
	 * @param Integer hour
	 */
	function getAMPM(hour) {
		return hour >= 12 ? 'PM' : 'AM';
	}

	/**
	 * Returns a string in the form of "3:25 PM" or "3 PM" or "11:08 AM"
	 * 'time' is the number of minutes from the START_OF_DAY
	 *
	 * @param Integer time
	 */
	function getTimeStr(time) {
		
	}

	/**
	 * Convenience method that returns a DOM Element based on parameters
	 *
	 * @param String tagName
	 * @param String klass - optional
	 * @param String html - optional
	 * @param DomElement parent - optional
	 */
	function addDomEl(tagName, klass, html, parent) {
		var el = document.createElement(tagName);

		el.className = klass || '';
		el.innerHTML = html || '';

		if (parent) {
			parent.appendChild(el);
		}

		return el;
	}

	/**
	 * Returns a DOM Element that represents CalendarEvent 'e'
	 *
	 * @param CalendarEvent e
	 */
	function getDomElFromEvent(e) {
		var el = addDomEl('div', 'event'),
			content, agenda, time;

		el.style.top = e.top + '%';
		el.style.left = e.left + '%';
		el.style.height = e.height + '%';
		el.style.width = e.width + '%';

		content = addDomEl('div', 'content', '', el);

		if (e.title || e.location) {
			agenda = addDomEl('div', 'agenda', '', content);
			if (e.title) {
				addDomEl('span', 'title', e.title, agenda);
			}
			if (e.location) {
				addDomEl('span', 'location', e.location, agenda);
			}
		}

		time = addDomEl('span', 'time', '', content);
		addDomEl('span', 'start', getTimeStr(e.starts_at), time);
		addDomEl('span', 'end', getTimeStr(e.starts_at + e.duration), time);

		return el;
	}

	/**
	 * Adds hour "legend lines" to the container based on constants defined at the top
	 *
	 * @param DomElement container
	 */
	function addHourMarkers(container) {
		var time, i;
		for (i = 0; i <= HOURS_PER_DAY; i++) {
			time = addDomEl('span', 'hour', '', container);
			time.setAttribute('data-time', (START_TIME + i > 12 ? (START_TIME + i - 12) : (START_TIME + i)) + ' ' + getAMPM(START_TIME + i));
			time.style.top = (i * 100 / HOURS_PER_DAY) + '%';
		}
	}

	/**
	 * Returns a container to render a calendar in to
	 * Note: This function removes all existing html (including existing calendars) from the 'parentContainer'
	 *
	 * @param DomElement parentContainer
	 */
	function getEventContainer(parentContainer) {
		var innerContainer;

		parentContainer.innerHTML = '';

		innerContainer = addDomEl('div', 'inner-container', '', parentContainer);
		addHourMarkers(innerContainer);

		return addDomEl('div', 'event-container', '', innerContainer);
	}

	/**
	 * Renders an array of calendar events into a given DomElement 'container'
	 *
	 * @param DomElement container
	 * @param Array<CalendarEvent> events
	 */
	function render(container, events) {
		var eventContainer = getEventContainer(container);
		events.filter(removeBadData).map(addConcurrentEvents).map(addWidth).map(addLayout).forEach(function(e) {
			eventContainer.appendChild(getDomElFromEvent(e));
		});
	}

	//expose render to the global scope
	window.renderEvents = render.bind(null, document.getElementById('calendar-container'));

}());