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
            var picker = $('<div class="hw_datepicker" />');
            if (configs.renderYear === true){
                this.renderYear().appendTo(picker);
            }
            
            this.renderMonth().appendTo(picker);
            this.renderBody().appendTo(picker);
            return picker;
        },
        
        renderMonth: function(){
            return $('<div class="hw_monthContainer" />').append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthLeft hw_mongthButton',
                    'area-labelled': DatePickerI18.Prev_month
                }).click(function(e){
                    console.log('left button clicked');
                })).append(
                $('<div class="hw_currentMonth" />')
                .html(DatePickerI18.month_name[currentDate.getMonth()])
                .click(function(e){
                    console.log('month clicked');
                })).append(
                $('<button />').attr({
                    'type': 'button',
                    'class': 'hw_monthRight hw_mongthButton',
                    'area-labelled': DatePickerI18.Next_month
                }).click(function(e){
                    console.log('right button clicked');
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
            console.log(dateTiker); console.log(lastDay);
            while(dateTiker <= lastDay){
                row = this.renderRow(week);
                for (var day = 0; day<7; day++){
                    dateTiker.setDate(dateTiker.getDate() + 1);
                    row.append(this.renderCell(dateTiker, currentMonth));
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
            return $('<button />')
                    .attr({
                        'area-lablled': this.getFullDate(buttonDate),
                        'data-dayindex': buttonDate.getDay(),
                        'class': (currentMonth != buttonDate.getMonth() ? 'hw_notCurrentMonth' : '')
                    })
                    .text(this.addFrontZeros(buttonDate.getDate()))
                    .click(function(e){
                        console.log('button has been clicked');
                    });
        },
        
        addFrontZeros: function(number){
            return (number < 10 ? '0' + number : number);
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
            return DatePickerI18.month_name[date.getMonth()] + date.getDate() + date.getFullYear();
        }
    };
};