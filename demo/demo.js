$(document).ready(function(){
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=205768632814988";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    var datePicker1 = new DatePicker({
        input: $('#hw_example_input1'),
        trigger: $('#hw_example_button1')
    });
    datePicker1.init();

    var minDate = new Date();
    minDate.setDate(minDate.getDate() - 60);

    var maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 1);

    var selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() - 90);

    var date = datePicker1.i18n.monthName[minDate.getMonth()].substring(0,3) + ' ' + minDate.getDate() + ', ' + minDate.getFullYear() + ' - ' +
            datePicker1.i18n.monthName[maxDate.getMonth()].substring(0,3) + ' ' + maxDate.getDate() + ', ' + maxDate.getFullYear();

    $('#daterange').append($('<span />').html(date));

    var inputDate = 
        datePicker1.addFrontZeros(selectedDate.getDate()) + '.' + 
        datePicker1.addFrontZeros(selectedDate.getMonth()+1) + '.' + 
        selectedDate.getFullYear();

    $('#hw_example_input2').val(inputDate);

    var datePicker2 = new DatePicker({
        input: $('#hw_example_input2'),
        trigger: $('#hw_example_button2'),
        minDate: minDate,
        maxDate: maxDate
        });
    datePicker2.init();

    var datePicker3 = new DatePicker({
        input: $('#hw_example_input3'),
        trigger: $('#hw_example_button3'),
        startWithMonday: true
        });
    datePicker3.init();

    var datePicker4 = new DatePicker({
        input: $('#hw_example_input4'),
        trigger: $('#hw_example_button4'),
        dateFormat: 'mm/dd/yyyy'
        });
    datePicker4.init();

    var datePicker5 = new DatePicker({
        input: $('#hw_example_input5.1'),
        trigger: $('#hw_example_button5.1'),
        events: {
            onSelect: function(e){
                console.log(this);
                console.log(e);
                alert('Date selected');
            }
        }
        });
    datePicker5.init();

    var datePicker5_2 = new DatePicker({
        input: $('#hw_example_input5.2'),
        trigger: $('#hw_example_button5.2'),
        events: {
            onSelect: function(e){
                console.log(this);
                console.log(e);
                alert('Date selected');
            }
        }
        });
    datePicker5_2.init();

    var datePicker6 = new DatePicker({
        input: $('#hw_example_input6'),
        trigger: $('#hw_example_button6'),
        startWithMonday: true,
        i18n: DatePickerI18n
    });
    datePicker6.init();

    $('.button').click(function(e){
        e.preventDefault();
        var codeBlock = $(this).prev('.code');
        if (codeBlock.hasClass('visible')){
            codeBlock.stop().animate({
                'height': 0
            }, 500, function(){
                $(this).removeClass('visible');
            });
        } else {
            var height = codeBlock.find('pre').outerHeight();
            codeBlock.stop().addClass('visible').animate({
                'height': height
            }, 500);
        }
    });
});