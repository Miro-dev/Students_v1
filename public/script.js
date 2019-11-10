$(function () { })

let currentButton = '';
let $input_fields_list = $('#input-fields-list');
let $tableBody = $('#TBody_ID');
let rowCount = 0;
let parameters;


const hideFields = () => {
    $("#li1").hide();
    $("#li2").hide();
    $("#li3").hide();

}

const clearFields = () => {
    document.getElementById('Bash').value = '';
    document.getElementById('GPA').value = '';
    document.getElementById('School').value = '';
    document.getElementById('Bash').placeholder = '';
    document.getElementById('GPA').placeholder = '';
    document.getElementById('School').placeholder = '';
}

function drawTableBody(data) {
    rowCount += 1;

    $tableBody.append(`<tr id="tr_${rowCount}"></tr>`);
    $tr_0 = $(`#tr_${rowCount}`)
    $tr_0.append(`<td id="tr_C_ID">${data.id}</td>`);
    $tr_0.append(`<td id="tr_C_name">${data.Name}</td>`);
    $tr_0.append(`<td id="tr_C_gpa">${data.GPA}</td>`);
    $tr_0.append(`<td id="tr_C_school">${data.School}</td>`);
};


function drawTableHead() {
    $('#tableID tbody').empty();
    $("#tableID thead").empty();

    $("#theadID").append(`<tr id="headerID"></tr>`);
    $("#headerID").append(`<th id="th-ID">ID</th>`);
    $("#headerID").append(`<th id="th-Name">Name</th>`);
    $("#headerID").append(`<th id="th-GPA">GPA</th>`);
    $("#headerID").append(`<th id="th-School">School</th>`);
};


function doesNotExist(state) {
    if (state) {
        let temp = document.getElementById('Bash').value;
        clearFields();
        document.getElementById('Bash').placeholder = temp + ' does not exist in DB';
    } else {
        let temp = document.getElementById('Bash').value;
        clearFields();
        document.getElementById('Bash').placeholder = temp + ' exists in DB';
    }

}

function submitForms() {
    let sName = document.getElementById('Bash');
    let sGPA = document.getElementById('GPA');
    let sSchool = document.getElementById('School');
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
    drawTableHead();

    switch (currentButton) {

        case 'create':
            console.log("Current Button is: " + currentButton + "Name is :" + sName.value)

            if (sName.value !== '' && sGPA.value !== '' && sSchool.value !== '') {
                parameters = {
                    Name: sName.value,
                    GPA: sGPA.value,
                    School: sSchool.value
                };
                $.ajax({
                    type: 'POST',
                    url: '/',
                    dataType: 'json',
                    data: JSON.stringify(parameters),
                    success: function (data) {
                        if (data.err === 'err') {
                            doesNotExist(false)
                        } else {
                            drawTableBody(data)
                        }
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                });
            } else {
                if (sName.value === '') {
                    document.getElementById('Bash').placeholder = 'Required field!';
                }

                if (sGPA.value === '') {
                    document.getElementById('GPA').placeholder = 'Required field!';
                }

                if (sSchool.value === '') {
                    document.getElementById('School').placeholder = 'Required field!';
                }
            }
            break;

        case 'view':
            console.log("Current Button is: " + currentButton + "Name is: " + sName.value)

            parameters = {
                Name: sName.value
            };
            $.ajax({
                type: 'GET',
                url: '/view',
                dataType: 'json',
                data: parameters,
                success: function (data) {
                    if (data.err === "err") {
                        doesNotExist(true);
                    } else {
                        drawTableBody(data)
                    }
                },
                dataType: 'json',
                contentType: 'application/json',
            });
            break;

        case 'update':

            console.log("Current Button is: " + currentButton)

            parameters = {
                Name: sName.value,
                GPA: sGPA.value,
                School: sSchool.value
            };
            $.ajax({
                type: 'PUT',
                url: '/',
                dataType: 'json',
                data: JSON.stringify(parameters),
                success: function (data) {
                    if (data.err === "err") {
                        doesNotExist(true);
                    } else {
                        clearFields();
                        document.getElementById('Bash').placeholder = "Student Updated!"
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            drawTableBody(element)
                        }
                    }
                },
                dataType: 'json',
                contentType: 'application/json',
            });

            break;

        case 'delete':
            parameters = {
                Name: sName.value
            };
            $.ajax({
                type: 'DELETE',
                url: '/delete',
                dataType: 'json',
                data: JSON.stringify(parameters),
                success: function (data) {
                    if (data.err === "err") {
                        doesNotExist(true);
                    } else {
                        clearFields();
                        document.getElementById('Bash').placeholder = "Student Deleted!"
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            drawTableBody(element)
                        }
                    }
                },
                dataType: 'json',
                contentType: 'application/json',
            });
            break;

        default:
            break;
    }
}

hideFields();

$('#view').on('click', function () {
    hideFields();
    clearFields();
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
    currentButton = 'view';
    $("#li1").show();
})

$('#create').on('click', function () {
    hideFields();
    clearFields();
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
    currentButton = 'create';
    $("#li1").show();
    $("#li2").show();
    $("#li3").show();
});

$('#update').on('click', function () {
    hideFields();
    clearFields();
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
    currentButton = 'update';

    $("#li1").show();
    $("#li2").show();
    $("#li3").show();
});

$('#delete').on('click', function () {
    $(":button").css('color')
    hideFields();
    clearFields();
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
    currentButton = 'delete';
    $("#li1").show();
    $(this).css('color', 'blue')
});

$('#clear').on('click', function () {
    hideFields();
    clearFields();

    currentButton = '';
    $('#tableID tbody').empty();
    $("#tableID thead").empty();
})

$('#viewAll').on('click', function () {
    hideFields();
    clearFields();
    drawTableHead();
    $.ajax({
        type: 'GET',
        url: '/students',
        success: function (data) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                drawTableBody(element)
            }
        }
    });
});

$(document).keypress(function (e) {
    if (e.which == 13) {
        submitForms();
    }
});
