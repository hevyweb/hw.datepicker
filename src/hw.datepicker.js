/**
 * Hevyweb datepicker
 * 
 * Denerates a popup calendar, which allows to pick the date
 * @link https://github.com/hevyweb/datepicker
 * @author Dmytro Dzyuba <1932@bk.ru>
 * @licence MIT
 * @version 1.0.0
 */

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
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    
    if (configs.minDate !== undefined){
        var minDate = new Date(configs.minDate);
        if (isNaN(minDate.getTime())){
            throw new Exception('Min date is not valid');
        }
        minDate.setHours(0);
        minDate.setMinutes(0);
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);
    }
    
    if (configs.maxDate !== undefined){
        var maxDate = new Date(configs.maxDate);
        if (isNaN(maxDate.getTime())){
            throw new Exception('Max date is not valid');
        }
        maxDate.setHours(0);
        maxDate.setMinutes(0);
        maxDate.setSeconds(0);
        maxDate.setMilliseconds(0);
    }
    
    if (maxDate !== undefined && minDate !== undefined){
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
        
        selectedDate: null,
        
        activeDate: new Date(currentDate),
        
        maxDate: maxDate || null,
        
        minDate: minDate || null,
        
        startWithMonday: configs.startWithMonday || false,
        
        dateFormat: configs.dateFormat || 'dd.mm.yyyy',
        
        events: $.extend({
            onSelect: null,
            onMonthChange: null,
            onOpen: null,
            onClose: null
        }, configs.events || {}),
        
        i18n: $.extend({
            'prevMonth': 'Previous month',
            'nextMonth': 'Next month',
            'monthName': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            'weekNameFull': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'weekNameShort': ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        }, configs.i18n || {}),
        
        init: function(){
            var self = this;

            this.trigger.click(function(e){
                if (self.currentPicker == null || self.currentPicker.hasClass('hw_closed')){
                    e.stopPropagation();
                    self.open();
                }
            });
            
            var selectedDate = this.strToDate(this.input.val());
                
            if (selectedDate != null && !isNaN(selectedDate.getTime()) && selectedDate != this.selectedDate){
                this.changeDate(selectedDate);
            }
            
            this.input.keyup(function(){
                var date = self.strToDate($(this).val());
                if (date != null && !isNaN(date.getTime())){
                    if ((self.minDate == null || self.minDate <= date) && (self.maxDate == null || self.maxDate >= date)){
                        self.changeDate(date);
                    }
                }
            });
            
            $(window).resize(function(e){
                if (self.currentPicker != null){
                    self.adjustPosition();
                }
            });
        },
        
        changeDate: function(newDate){
            this.selectedDate = newDate;
            this.activeDate = new Date(newDate);
            if (this.currentPicker){
                this.monthChange(this.activeDate);
            }
        },
        
        render: function(){
            this.currentPicker = $('<div class="hw_datepicker hw_closed" aria-hidden="true" tabindex="0" role="application" />').click(function(e){
                e.stopPropagation();
            });
            
            this.adjustPosition();
            this.renderMonthNavigation(this.activeDate)
                .appendTo(this.currentPicker);
            
            this.renderBody()
                .appendTo(this.currentPicker);
        
            return this.currentPicker;
        },
        
        adjustPosition: function(){
            var offset = this.input.offset();
            this.currentPicker
                .css({
                    'left': offset.left,
                    'top': offset.top + this.input.outerHeight()
                });
        },
        
        renderMonthNavigation: function(date){
            var date = new Date(date),
            prevMonthDate = this.getPrevMonthDate(date),
            nextMonthDate = this.getNextMonthDate(date);

            var prevButton = this.renderMonthNavBtn(
                this.i18n.prevMonth, 
                prevMonthDate.getTime(),
                'hw_monthLeft'
            ).trigger('redraw', this.minDate && prevMonthDate<=this.minDate && prevMonthDate <= this.selectedDate);
    
            var nextButton = this.renderMonthNavBtn(
                this.i18n.nextMonth, 
                nextMonthDate.getTime(),
                'hw_monthRight'
            ).trigger('redraw', this.maxDate && nextMonthDate>=this.maxDate && nextMonthDate >= this.selectedDate);
            
            return $('<div class="hw_monthContainer" />')
            .append(prevButton)
            .append(
                $('<div class="hw_currentMonth" />')
                .html(this.i18n.monthName[date.getMonth()] + ' ' + date.getFullYear())
            )
            .append(nextButton);
        },
        
        monthBtnClick: function(e){
            var date = new Date(parseInt($(e.currentTarget).attr('data-date')));
            if (this.events.onMonthChange){
                this.events.onMonthChange.call(this, date, e);
            }
            this.monthChange(date);
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
                        $(this).addClass('hw_unavailable').attr({
                            'aria-disabled': 'true',
                            'tabindex': '-1'
                        }).off('click');
                    } else {
                        $(this).removeClass('hw_unavailable').attr({
                            'aria-disabled': 'false',
                            'tabindex': '0'
                        }).off('click').on('click', $.proxy(self.monthBtnClick, self));
                    }
                });
        },
        
        renderBody: function(){
            return $('<div class="hw_pickerBody" />')
                .append(this.renderBodyHeader())
                .append(this.renderWeeks(this.activeDate));
        },
        
        renderBodyHeader: function(){
            var bodyHeader = $('<div class="hw_pickerBodyHeader" />');
            var self = this;
            if (!this.startWithMonday){
                this.i18n.weekNameFull.unshift(this.i18n.weekNameFull.pop());
                this.i18n.weekNameShort.unshift(this.i18n.weekNameShort.pop());
            }
            $.each(self.i18n.weekNameShort, function(key, day){
                $('<div title="' + self.i18n.weekNameFull[key] + '">' + day + '</div>').appendTo(bodyHeader);
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
            dateTiker.setDate(dateTiker.getDate() + (this.startWithMonday ? -6 : 0) - dateTiker.getDay());
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
            var unavailable = false;
            if (outOfMonth) {
                className.push('hw_inactive');
            }

            if (buttonDate.getTime() === this.currentDate.getTime()){
                className.push('hw_currentDate');
            }

            if ((this.maxDate && this.maxDate<buttonDate) || (this.minDate && this.minDate>buttonDate)){
                className.push('hw_unavailable');
                unavailable = true;
            }

            if (this.selectedDate != null && buttonDate.getTime() === this.selectedDate.getTime()){
                className.push('hw_selectedDate');
            }
            
            var button = $('<button />')
                    .attr({
                        'aria-label': this.getFullDate(buttonDate),
                        'data-dayindex': buttonDate.getDay(),
                        'data-date':  buttonDate.getTime(),
                        'aria-hidden': (outOfMonth || unavailable ? 'true' : 'false'),
                        'class': className.join(' '),
                        'tabindex': ((outOfMonth || unavailable) ? '-1' : '0')
                    })
                    .text(this.addFrontZeros(buttonDate.getDate()));
            if (!outOfMonth && !unavailable){
                button.click(function(e){
                    self.selectDate(e);
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
            return this.i18n.monthName[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear();
        },
        
        selectDate: function(e){
            if (this.events.onSelect){
                this.events.onSelect.call(this, e);
            }
            var currentButton = $(e.currentTarget);
            var date = new Date();
            date.setTime(currentButton.attr('data-date'));
            this.input.val(this.getFormatedDate(date))
                .attr('aria-label', currentButton.attr('aria-label'));
            this.selectedDate = date;
            this.currentPicker.find('.hw_selectedDate').removeClass('hw_selectedDate');
            currentButton.addClass('hw_selectedDate');
            this.close(e);
        },
        
        monthChange: function(date){
            this.currentPicker.find('.hw_week').remove();
            this.currentPicker.find('.hw_pickerBody').append(this.renderWeeks(date));
            this.currentPicker.find('.hw_currentMonth')
                .html(this.i18n.monthName[date.getMonth()] + ' ' + date.getFullYear());
            var prevMonthDate = this.getPrevMonthDate(date),
            nextMonthDate = this.getNextMonthDate(date);

            this.currentPicker.find('.hw_monthLeft')
                .trigger('redraw', this.minDate && (prevMonthDate <= this.minDate && prevMonthDate <=this.selectedDate))
                .attr('data-date', prevMonthDate.getTime());
            this.currentPicker.find('.hw_monthRight')
                .trigger('redraw', this.maxDate && (nextMonthDate >=this.maxDate && nextMonthDate >= this.selectedDate))
                .attr('data-date', nextMonthDate.getTime());
        },
        
        open: function(){

            if (!this.currentPicker) {
                $(container).append(this.render());                
            }
            $('body').click($.proxy(this.close, this));
            this.currentPicker.removeClass('hw_closed').removeAttr('aria-hidden');
            
            if (this.events.onOpen){
                this.events.onOpen.call(this);
            }
        },
        
        close: function(e){
            if (this.events.onClose){
                this.events.onClose.call(this, e);
            }
            this.currentPicker.addClass('hw_closed').attr('aria-hidden', 'true');
            $('body').off('click', this.close);
        },
        
        getFormatedDate: function(date){
            var day = date.getDate();
            var month = date.getMonth() + 1;
            
            return this.dateFormat
                .replace('dd', this.addFrontZeros(day))
                .replace('d', day)
                .replace('mm', this.addFrontZeros(month))
                .replace('m', month)
                .replace('yyyy', date.getFullYear());
        },
        
        strToDate: function(string){
            var regExp = new RegExp('^' + this.dateFormat
                .replace(/\\/g, '\\\\')
                .replace(/\./g, '\\.')
                .replace('yyyy', '([0-9]{4})')
                .replace('mm', '([0-1]{1}[0-9]{1})')
                .replace('m', '([0-9]{1,2})')
                .replace('dd', '([0-3]{1}[0-9]{1})')
                .replace('d', '([0-9]{1,2})')+
                '$', i);
            var data = regExp.exec(string);
            if (data != null) {
                var positioning = [];
                positioning[this.dateFormat.indexOf('y')] = 'setFullYear';
                positioning[this.dateFormat.indexOf('m')] = 'setMonth';
                positioning[this.dateFormat.indexOf('d')] = 'setDate';
                var date = new Date(2000, 0, 1, 0, 0, 0, 0);
                var i = 1;
                for (var n = 0; n<positioning.length; n++){
                    var method = positioning[n];
                    if (method){
                        var value = parseInt(data[i]);
                        if (method == 'setMonth') {
                            value--;
                        }
                        date[method](value);
                        i++;
                    }
                }
                return date;
            }
            return null;
        }
    };
};