# hw.datepicker
---

> A jQuery datepicker library

## Usage

* Include datepicker StyleSheet

```html
<link rel="stylesheet" href="/libs/hw.datepicker/hw.datepicker.min.css">
```
     
* Include dependency: jQuery

```html
<script src="https://code.jquery.com/jquery-1.11.3.js"></script>
```

* Include library's code

```html
<script src="/libs/hw.datepicker/hw.datepicker.min.js"></script>
```

* Initialize the datepicker for concrete input field and its trigger

```html
<input type="text" id="hw_datepicker" />
<button id="hw_datepicker_trigger">pick</button>
```
  
* And the initialization itself:
```javascript
var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger')
});

datePicker.init();
```

---

## Required options

#### input
Type: `object|jQuery|string`

Input tag, which is related to the datepicker

#### trigger
Type: `object|jQuery|string`

Any HTML element by clicking on which datepicker appears

---

## Other options

#### container
Type: `object|jQuery|string`

Default `jQuery('body')`

It is an HTML element, jQuery object or selector (e.g. class or id). Datepicker appears in this HTML element. I recommend to use parent element as a container, to make "tab" navigation work properly. However in most cases it is impossible, because parent might have styles which impact the datepicker, for example `overflow: hidden`

```javascript
var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger'),
    container: $('#hw_datepicker').parent()
});

datePicker.init();
```

#### minDate, maxDate
Type: `Date`

Default: `null`

Minimum and maximum date between which dates can be picked.

```javascript
var minDate = new Date();
minDate.setDate(minDate.getDate() - 60);

var maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 1);

var selectedDate = new Date();
selectedDate.setDate(selectedDate.getDate() - 90);

var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger'),
    minDate: minDate,
    maxDate: maxDate
});
datePicker.init();
```

#### startWithMonday
Type: `Boolean`

Default: `false`

The week start with Sunday by default. To make it start from Monday, set this parameter to true.

```javascript
var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger'),
   startWithMonday: true
});
datePicker.init();
```

#### dateFormat
Type: `String`

Default: `dd.mm.yyyy`

By default date format is "dd.mm.yyyy". However datepicker support different date formats: mm/dd/yyyy, yyyy-m-d etc.
**yyyy** - is a 4 digit year, 
**mm** - 2 digits month, single 
single **m** - 1 or 2 digits month, 
**dd** - 2 digits day, 
single **d** - 1 or 2 digits day.

```javascript
var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger'),
    formatDate: 'mm/dd/yyyy'
});

datePicker.init();
```

#### events
Type: `Array`

Default: `[]`

|**Event Type**|**Description**|
|--------------|---------------|
|onOpen        |This event fires when datepicker appears, no matter is it the appearance or has been already closed.|
|onSelect      |This event fires when user picks the date. It accepts 1 parameter - initial jQuery click event.|
|onMonthChange |This event fires when user changes month. It accepts 2 parameters: Date object and initial jQuery click event. |
|onClose       |This event fires when datepicker disappears. It accepts 1 parameter - initial jQuery click event.|

```javascript
var datePicker = new DatePicker({
    input: $('#hw_datepicker'),
    trigger: $('#hw_datepicker_trigger'),
    events: {
        onMonthChange: function(){
            alert('Month changed');
        },
        onSelect: function(){
            alert('Date selected.');
        },
        onOpen: function(){
            alert('Opened.');
        },
        onClose: function(){
            alert('Closed.');
        }
    }
});

datePicker.init();
```

#### i18n
Type: `object`

Default: 
```javascript
{
    'prevMonth': 'Previous month',
    'nextMonth': 'Next month',
    'monthName': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'weekNameFull': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    'weekNameShort': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
}
```

---
## Keyboard navigation
Datepicker supports keyboard navigation

|**Key**     |**Action**|
|------------|----------|
|Arrow left  |next date|
|Arrow right |previous date|
|Arrow up    |1 week back|
|Arrow down  |1 week ahead|
|Home        |first day of the month|
|End         |last day of the month|
|Page up     |1 month back|
|Page down   |1 month ahead|
|Enter       |select current date|
|Space       |select current date|
|Esc         |close the datepicker|
|Tab         |next date until the end of the current month|
|Shift+Tab   |previous date until the very first day of the month and to the buttons, which change month|

## Demo page
[https://hevyweb.github.io/hw.datepicker](https://hevyweb.github.io/hw.datepicker/index.html)

### Author
**Dmytro Dzyuba**

+ [github/hevyweb](https://github.com/hevyweb)
+ [linkedin](https://www.linkedin.com/in/dmytro-dzyuba-b1988221/)

### License
Copyright &copy; 2017 [Dmytro Dzyuba](https://github.com/hevyweb).
Software released under [MIT License](LICENSE).

***