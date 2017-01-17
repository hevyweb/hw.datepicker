var DatePickerI18 = {
    'Prev_month': 'Previous month',
    'month_name': [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June",
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
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
    
    var currentDate = new Date();
    
    return {
        render: function(){
            var picker = $('<div class="hw_datepicker" />');
            if (configs.renderYear === true){
                this.renderYear().appendTo(picker);
            }
            
            this.renderMonth().appendTo(picker);
        },
        
        renderMonth: function(){
            $('<div class="hw_monthContainer" />').append(
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
                }));
        },
        
        renderBody: function(){
            
        },
        
        renderRow: function(){
            
        },
        
        renderCell: function(){
            
        }
    };
};