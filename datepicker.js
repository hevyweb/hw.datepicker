var DatePickerI18 = {
    'Prev_month': 'Previous month',
    'Next_month': 'Next month',
    'month_name': [
        'January', 
        'February', 
        'March', 
        'April', 
        'May', 
        'June',
        'July', 
        'August', 
        'September', 
        'October', 
        'November', 
        'December'
    ],
    'week_name_full': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ],
    'week_name_short': [
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
        'Su'
    ]
}

var DatePicker = function(configs){
    if (configs.input === undefined){
        throw new Exception('Input field is not specified');
    }
    
    var input = $(configs.input);
    if (!input.length) {
        throw new Exception('Specified input field does not exists.');
    }
    
    var container;
    if (configs.container === undefined){
        container = input.parent();
    } else if (!$(configs.container).length) {
        throw new Exception('Specified container does not exist.');
    } else {
        container = $(configs.container);
    }
    
    var trigger;
    if (configs.trigger === undefined){
        trigger = input;
    } else if (!$(configs.trigger).length) {
        throw new Exception('Specified trigger does not exist.');
    } else {
        trigger = $(configs.trigger);
    }
    
    var currentDate = configs.currentDate || new Date();
    
    if (configs.minDate !== undefined){
        var minDate = new Date(configs.minDate);
        if (isNaN(minDate.getTime())){
            throw new Exception('Min date is not valid');
        }
    }
    
    if (configs.maxDate !== undefined){
        var maxDate = new Date(configs.maxDate);
        if (isNaN(maxDate.getTime())){
            throw new Exception('Max date is not valid');
        }
    }
    
    if (maxDate !=undefined && minDate != undefined){
        if (minDate>maxDate){
            throw new Exception('Min date is greater then max date.')
        }
    }
    
    return {
        /**
         * Contains an instance of the current datepicker for those cases, when
         * you need to initialize several datepickers per page
         */
        currentPicker: null,
        
        input: input,
        
        trigger: trigger,
        
        currentDate: currentDate,
        
        dateFormat: 'dd.mm.yyyy',
        
        maxDate: maxDate,
        
        minDate: minDate,
        
        events: {
            onSelect: null,
            onMonthChange: null
        },
        
        init: function(){
            var self = this;
            $(trigger).click(function(){
                if (!$('.hw_datepicker').length) {
                    $(container).append(self.render());
                } else {
                    $('.hw_datepicker').show();
                }
            });
        },
        
        render: function(){
            this.currentPicker = $('<div class="hw_datepicker" />');
            
            this.renderMonthNavigation(currentDate)
                .appendTo(this.currentPicker);
            this.renderBody().appendTo(this.currentPicker);
            return this.currentPicker;
        },
        
        renderMonthNavigation: function(date){
            var self = this;
            var date = new Date(date);
            date.setDate(1);
            var prevDate = new Date(date);
            prevDate.setDate(0);
            var next = new Date(date);
            var onClick = function(e){
                if ($(this).hasClass('hw_unavailable')){
                    return;
                }
                self.monthChange(new Date(parseInt($(this).attr('data-date'))));
                if (self.events.onMonthChange){
                    self.events.onMonthChange(e);
                }
            };
            
            if (this.minDate && prevDate<=this.minDate){
                //@TODO continue.
            }
            
            return $('<div class="hw_monthContainer" />')
            .append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthLeft hw_monthButton',
                    'aria-label': DatePickerI18.Prev_month,
                    'data-date': prevDate.getTime()
                }).click(onClick)
            )
            .append(
                $('<div class="hw_currentMonth" />')
                .html(DatePickerI18.month_name[date.getMonth()] + ' ' + date.getFullYear())
            )
            .append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthRight hw_monthButton',
                    'aria-label': DatePickerI18.Next_month,
                    'data-date': next.setMonth(next.getMonth() + 1 )
                }).click(onClick)
            );
        },
        
        renderBody: function(){
            return $('<div class="hw_pickerBody" />')
                .append(this.renderBodyHeader())
                .append(this.renderWeeks(currentDate));
        },
        
        renderBodyHeader: function(){
            var bodyHeader = $('<div class="hw_pickerBodyHeader" />');
            if (!configs.startWithMonday){
                DatePickerI18.week_name_full.unshift(DatePickerI18.week_name_full.pop());
                DatePickerI18.week_name_short.unshift(DatePickerI18.week_name_short.pop());
            }
            $.each(DatePickerI18.week_name_short, function(key, day){
                $('<div title="' + DatePickerI18.week_name_full[key] + '">' + day + '</div>').appendTo(bodyHeader);
            });
            
            return bodyHeader;
        },
        
        renderWeeks: function(date){
            var dateTiker = new Date(date),
            row,
            rows = [],
            week = 0,
            lastDay = this.getLastDate(dateTiker),
            currentMonth = dateTiker.getMonth();
            dateTiker.setDate(1 - dateTiker.getDay());
            while(dateTiker <= lastDay){
                row = this.renderRow(week);
                for (var day = 0; day<7; day++){
                    row.append(this.renderCell(dateTiker, currentMonth));
                    dateTiker.setDate(dateTiker.getDate() + 1);                    
                }
                week++;
                rows.push(row);
            }
            
            return rows;
        },
        
        renderRow: function(index){
           return $('<div class="hw_week" data-week="' + index + '" />');
        },
        
        renderCell: function(buttonDate, currentMonth){
            var self = this;
            var outOfMonth = (currentMonth != buttonDate.getMonth());
            var className = [];
            if (outOfMonth) {
                className.push('hw_inactive');
            }
            if (buttonDate.getTime() == currentDate.getTime()){
                className.push('hw_currentDate');
            }
            if ((this.maxDate && this.maxDate<=buttonDate) || (this.minDate && this.minDate>=buttonDate)){
                className.push('hw_unavailable');
            }
            
            var button = $('<button />')
                    .attr({
                        'aria-label': this.getFullDate(buttonDate),
                        'data-dayindex': buttonDate.getDay(),
                        'data-date':  buttonDate.getTime(),
                        'aria-hidden': (outOfMonth ? 'true' : 'false'),
                        'class': className.join(' ')
                    })
                    .text(this.addFrontZeros(buttonDate.getDate()));
            if (!outOfMonth){
                button.click(function(e){
                    self.selectDate(e);
                    if (self.events.onSelect){
                        self.events['onSelect'].call(self, e);
                    }
                })
                .hover(
                    function(){
                        self.currentPicker.find('.hw_activeDay').removeClass('hw_activeDay');
                        $(this).addClass('hw_activeDay');
                    },
                    function(){
                        $(this).removeClass('hw_activeDay');
                    }
                );
            }
            return $('<div class="hw_day" />').append(button);
        },
        
        addFrontZeros: function(number){
            return (number < 10 ? '0' : '') + number;
        },
        
        getLastDate: function(dateTiker)
        {
            var lastDate;
            if (dateTiker.getMonth() == 11){
                lastDate = new Date(dateTiker.getFullYear(), 11, 31);
            } else {
                lastDate = new Date(dateTiker.getFullYear(), dateTiker.getMonth()+1, 1);
                lastDate.setDate(0);
            }
            return lastDate;
        },
        
        getFullDate: function(date){
            return DatePickerI18.month_name[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        },
        
        selectDate: function(e){
            var currentButton = $(e.currentTarget);
            var date = new Date();
            date.setTime(currentButton.attr('data-date'));
            this.input.val(this.getFormatedDate(date))
                .attr('aria-label', currentButton.attr('aria-label'));
            this.currentDate = date;
            this.currentPicker.find('.hw_currentDate').removeClass('hw_currentDate');
            currentButton.addClass('hw_currentDate');
        },
        
        monthChange: function(date){
            this.currentPicker.find('.hw_week').remove();
            this.currentPicker.find('.hw_pickerBody').append(this.renderWeeks(date));
            this.currentPicker.find('.hw_currentMonth')
                .html(DatePickerI18.month_name[date.getMonth()] + ' ' + date.getFullYear());
            this.currentPicker.find('.hw_monthLeft').attr('data-date', date.setMonth(date.getMonth() - 1));
            this.currentPicker.find('.hw_monthRight').attr('data-date', date.setMonth(date.getMonth() + 2));
        },
        
        getFormatedDate: function(date){
            return this.addFrontZeros(date.getDate()) + '.' + this.addFrontZeros(date.getMonth()+1) + '.' + date.getFullYear();
        }
    };
};