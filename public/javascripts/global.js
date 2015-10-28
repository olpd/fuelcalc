/**
 * Created by domi on 15.10.15.
 */

var fuelTableData = [];

var viewMode = false;

// DOM Ready ==========================================================================================================
$(document).ready(function() {

    include('fuellist.js');

    // Populate the user table on initial page load
    populateTable();

    // Connect submit button
    $('#inputSubmitButton').on('click', submitEntry);

    // Connect toggle button
    $('#headerToggle').on('click', toggleEditMode);

    // driving style dropdown
    $('.ui.dropdown').dropdown();
    $('#inputDrivingStyle').on('click', dropdownClicked);

    // Delete User link click
    $('#fuelTable table tbody').on('click', 'td a.linkdeleteentry', deleteEntry);

    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade');
        })
    ;

    viewMode = document.getElementById('headerToggle').checked;
    if (viewMode) {
        $('#wrapper').transition('hide');
        $('#fuelGraphWrapper').transition('show');
    } else {
        $('#wrapper').transition('show');
        $('#fuelGraphWrapper').transition('hide');
    }



});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/fuelcalc/entries', function(data){

        var index = 1;

        for (j = 1; j < data.length; j++) {
            var avg = (data[j].fuel / (data[j].km - data[j - 1].km)) * 100;
            data[j].avg = avg;
        }

        for (i = 1; i < data.length; i++) {
            tableContent += '<tr>';
            tableContent += '<td>' + (i) + '</td>';
            tableContent += '<td>' + data[i].km + '</td>';
            tableContent += '<td>' + data[i].fuel + '</td>';
            tableContent += '<td>' + data[i].avg.toFixed(1) + '</td>';
            tableContent += '<td>' + '<a href="#" class="linkdeleteentry" rel=' + data[i]._id + ':' + data[i]._rev + '><i class="red remove icon link icon"> </i> </a>' + '</td>';
            tableContent += '</tr>';
        }

        // Inject into existing html
        $('#fuelTable table tbody').html(tableContent);

        fuelTableData = data;
    });
};

function submitEntry(event){
    event.preventDefault();

    var drivingStyle = $('#addField fieldset input#inputDrivingStyle').val();
    if (drivingStyle === '') {
        drivingStyle = 'normal';
    }
    var newEntry = {
        'km': $('#addField fieldset input#inputKM').val(),
        'fuel' : $('#addField fieldset input#inputFuel').val(),
        'date' : new Date().getTime(),
        'drivingStyle' : drivingStyle
    }
    $.ajax({
        type: 'POST',
        data: newEntry,
        url: '/fuelcalc/entries',
        dataType: 'JSON'
    }).done(function(response){
        if (response.msg === '') {
            // Clear input
            $('#addField fieldset input').val('');

            // update table
            populateTable();
            // show success message
            //$('#successMessage').transition('show');


            var lastEntry = fuelTableData[fuelTableData.length - 1];
            var distance = newEntry.km - lastEntry.km;
            var avg = (newEntry.fuel / distance) * 100;

            var successMessage = "New data was added successfully! New average: " + avg;

            $('#successMessage').transition('show');
            $('#successMessage').html('<p>' + successMessage + '</p>');
            $('#errorMessage').transition('hide');

        }
        else {
            $('#successMessage').transition('hide');
            $('#errorText').html('<p>Error: ' + response.msg + '</p>');
            $('#errorMessage').transition('show');
        }
    });
}

function include(filename)
{
    var head = document.getElementsByTagName('head')[0];

    script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

function deleteEntry(event) {

    event.preventDefault();

    // Send delete request to server via ajax
    console.log("sending delete");

    var idAndRev = $(this).attr('rel').split(":");
    var _id = idAndRev[0];
    var _rev = idAndRev[1];

    $.ajax({
        type: 'DELETE',
        url: '/fuelcalc/deleteentry/' + _id + '/' +_rev
    }).done(function(response) {
        // check whether request was successful
        if (response.msg === '') {
            // do nothing
        } else {
            alert('Error: ' + response.msg);
        }

        // update table
        populateTable();
    });
}

function toggleEditMode(event) {
    viewMode = !viewMode;

    if (viewMode) {
        $('#wrapper').transition('hide');
        $('#fuelGraphWrapper').transition('show');
        // CHART START

        var labels = new Array(fuelTableData.length);
        var seriesData = new Array(fuelTableData.length);
        for (var i = 1; i < fuelTableData.length; i++) {
            labels[i] = i;
            seriesData[i] = fuelTableData[i].avg;
        }

        var data = {
            // A labels array that can contain any sort of values
            labels:labels,
            // Our series array that contains series objects or in this case series data arrays
            series: [
                seriesData
            ]
        };

        var options = {
            // Disable line smoothing
            lineSmooth: false,
            axisY: {
                low: 0,
                high: 13,
                //ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                onlyInteger: true
            }
        };

        // Create a new line chart object where as first parameter we pass in a selector
        // that is resolving to our chart container element. The Second parameter
        // is the actual data object.
        new Chartist.Line('.ct-chart', data, options);

        // CHART END
    } else {
        $('#wrapper').transition('show');
        $('#fuelGraphWrapper').transition('hide');
    }

}

function dropdownClicked(event) {

    //this.dropdown();
}