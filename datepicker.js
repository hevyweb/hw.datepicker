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
        
        onSelect: 'onSelect',
        
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
            
            this.renderMonthNavigation(currentDate.getMonth(), currentDate.getFullYear())
                .appendTo(this.currentPicker);
            this.renderBody().appendTo(this.currentPicker);
            return this.currentPicker;
        },
        
        renderMonthNavigation: function(month, year){
            var self = this;
            return $('<div class="hw_monthContainer" />')
            .append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthLeft hw_mongthButton',
                    'aria-label': DatePickerI18.Prev_month,
                }).click(function(e){
                    console.log('left button clicked');
                })
            )
            .append(
                $('<div class="hw_currentMonth" />')
                .html(DatePickerI18.month_name[month] + ' ' + year)
                .click(function(e){
                    self.redrawMonth();
                })
            )
            .append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthRight hw_mongthButton',
                    'aria-label': DatePickerI18.Next_month
                }).click(function(e){
                    self.redrawMonth();
                })
            );
        },
        
        renderBody: function(){
            return $('<div class="hw_pickerBody" />')
                .append(this.renderBodyHeader())
                .append(this.renderWeeks());
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
        
        renderWeeks: function(){
            var dateTiker = new Date(currentDate),
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
            var className = outOfMonth ? 'hw_inactive' : '';
            className = className + (buttonDate.getTime() == currentDate.getTime() ? ' hw_currentDate': '');
            
            var button = $('<button />')
                    .attr({
                        'aria-label': this.getFullDate(buttonDate),
                        'data-dayindex': buttonDate.getDay(),
                        'data-date':  buttonDate.getTime(),
                        'aria-hidden': (outOfMonth ? 'true' : 'false'),
                        'class': className
                    })
                    .text(this.addFrontZeros(buttonDate.getDate()));
            if (!outOfMonth){
                button.click(function(e){
                    self['onSelect'].call(self, e);
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
        
        onSelect: function(e){
            var currentButton = $(e.currentTarget);
            var date = new Date();
            date.setTime(currentButton.attr('data-date'));
            this.input.val(this.getFormatedDate(date))
                .attr('aria-label', currentButton.attr('aria-label'));
            this.currentDate = date;
            this.currentPicker.find('.hw_currentDate').removeClass('hw_currentDate');
            currentButton.addClass('hw_currentDate');
        },
        
        onMonthChange: function(){
            
        },
        
        getFormatedDate: function(date){
            return this.addFrontZeros(date.getDate()) + '.' + this.addFrontZeros(date.getMonth()+1) + '.' + date.getFullYear();
        }
    };
};