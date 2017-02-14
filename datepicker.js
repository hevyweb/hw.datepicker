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
};


var DatePicker = function(configs){
    if (configs.input === undefined){
        throw new Exception('Input field is not specified.');
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
    
    if (configs.trigger === undefined){
        throw new Exception('Trigger is not defined.');
    }
    var trigger = $(configs.trigger);
    if (!trigger.length) {
        throw new Exception('Specified trigger does not exist.');
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
        
        maxDate: maxDate || null,
        
        minDate: minDate || null,
        
        startWithMonday: configs.startWithMonday || false,
        
        events: {
            onSelect: null,
            onMonthChange: null,
            onClose: null
        },
        
        init: function(){
            var self = this;
            
            $(trigger).click(function(){
                self.open();
            });
        },
        
        render: function(){
            this.currentPicker = $('<div class="hw_datepicker hw_closed" aria-hidden="true" tabindex="0" role="application" />');
            this.renderMonthNavigation(currentDate)
                .appendTo(this.currentPicker);
            this.renderBody().appendTo(this.currentPicker);
            return this.currentPicker;
        },
        
        renderMonthNavigation: function(date){
            var date = new Date(date),
            prevMonthDate = this.getPrevMonthDate(date),
            nextMonthDate = this.getNextMonthDate(date);

            var prevButton = this.renderMonthNavBtn(
                DatePickerI18.Prev_month, 
                prevMonthDate.getTime(),
                'hw_monthLeft'
            ).trigger('redraw', this.minDate && prevMonthDate<=this.minDate);
    
            var nextButton = this.renderMonthNavBtn(
                DatePickerI18.Next_month, 
                nextMonthDate.getTime(),
                'hw_monthRight'
            ).trigger('redraw', this.maxDate && nextMonthDate>=this.maxDate);
            
            return $('<div class="hw_monthContainer" />')
            .append(prevButton)
            .append(
                $('<div class="hw_currentMonth" />')
                .html(DatePickerI18.month_name[date.getMonth()] + ' ' + date.getFullYear())
            )
            .append(nextButton);
        },
        
        monthBtnClick: function(e){
            var self = e.data.self;
            self.monthChange(new Date(parseInt($(this).attr('data-date'))));
            if (self.events.onMonthChange){
                self.events.onMonthChange.call(self);
            }
        },
        
        renderMonthNavBtn: function(label, date, className){
            var self = this;
            return $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthButton ' + className,
                    'aria-label': label,
                    'data-date': date
                }).on('redraw', function(e, inactive){
                    if(inactive){
                        $(this).addClass('hw_unavailable').attr('aria-disabled', 'true').off('click');
                    } else {
                        $(this).removeClass('hw_unavailable').removeAttr('aria-disabled').off('click').on('click', {'self': self}, self.monthBtnClick);
                    }
                });
        },
        
        renderBody: function(){
            return $('<div class="hw_pickerBody" />')
                .append(this.renderBodyHeader())
                .append(this.renderWeeks(currentDate));
        },
        
        renderBodyHeader: function(){
            var bodyHeader = $('<div class="hw_pickerBodyHeader" />');
            if (!this.startWithMonday){
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
            dateTiker.setDate(1);
            dateTiker.setDate((this.startWithMonday ? 2 : 1) - dateTiker.getDay());
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
                        self.events.onSelect.call(self, e);
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
        
        getLastDate: function(date)
        {
            var lastDate = new Date(date);
            lastDate.setMonth(lastDate.getMonth() + 1);
            lastDate.setDate(0);
            lastDate.setHours(0);
            lastDate.setMinutes(0);
            lastDate.setSeconds(0);
            return lastDate;
        },
        
        getNextMonthDate: function(date){
            var nextMonthDate = new Date(date);
            nextMonthDate.setDate(1);
            nextMonthDate.setHours(0);
            nextMonthDate.setMinutes(0);
            nextMonthDate.setSeconds(0);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            return nextMonthDate;
        },
        
        getPrevMonthDate: function(date){
            var prevMonthDate = new Date(date);
            prevMonthDate.setDate(0);
            prevMonthDate.setHours(0);
            prevMonthDate.setMinutes(0);
            prevMonthDate.setSeconds(0);
            return prevMonthDate;
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
            var prevMonthDate = this.getPrevMonthDate(date),
            nextMonthDate = this.getNextMonthDate(date);

            this.currentPicker.find('.hw_monthLeft')
                .trigger('redraw', this.minDate && prevMonthDate <= this.minDate)
                .attr('data-date', prevMonthDate.getTime());
            this.currentPicker.find('.hw_monthRight')
                .trigger('redraw', this.maxDate && nextMonthDate >=this.maxDate)
                .attr('data-date', nextMonthDate.getTime());
        },
        
        onBodyClickCloseEvent: function(e){console.log(this.currentPicker.is(e.target));
            if (!this.currentPicker.find(e.target).length && !this.currentPicker.is(e.target) && !this.trigger.is(e.target)){
                this.close();
            }
        },
        
        open: function(){
            if (!this.currentPicker) {
                $(container).append(this.render());                
                $('body').click($.proxy(this.onBodyClickCloseEvent, this));
            }

            this.currentPicker.removeClass('hw_closed').removeAttr('aria-hidden');
            
            if (this.events.onOpen){
                this.events.onOpen.call(this);
            }
        },
        
        close: function(){
            if (this.events.onSelect){
                this.events.onSelect.call(this, e);
            }
            this.currentPicker.addClass('hw_closed').attr('aria-hidden', 'true');
            $('body').off('click', this.onBodyClickCloseEvent);
        },
        
        getFormatedDate: function(date){
            return this.addFrontZeros(date.getDate()) + '.' + this.addFrontZeros(date.getMonth()+1) + '.' + date.getFullYear();
        }
    };
};