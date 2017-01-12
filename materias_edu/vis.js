$.fn.dataTable.ext.search.push(
    function (settings,data,dataIndex) {
	dias = ['seg','ter','qua','qui','sex','sab'];
	periodos = [];
	for (i in dias) {
	    buff = $("#grade tr td:nth-child("+String(Number(i)+2)+").grade_chk").toArray();
	    for (b in buff) {
		buff[b] = buff[b].innerHTML;
	    }
	    periodos.push(buff)

	    if (data[6]==dias[i]) {
		if ($.inArray(data[5],periodos[i])>-1) {
		    return true;
		};
	    };
	};
	return false;
    });

$.fn.dataTable.ext.search.push(
    function (settings,data,dataIndex) {
	var term = new RegExp($('#buscatps')[0].value,'i');
	if ((term.test(data[2])) || (term.test(data[1])) || (term.test(data[7]))) {
	    return true;
	}
	return false;
    });

function format ( d ) {
    return '<table cellpadding="5" cellspacing="0" border="0" class="sub" style="padding-right:7.5%;padding-left:7.5%;font-size:80%">'+
	'<tr>'+
	    '<td colspan="3" style="text-align:center"><b>Departamento de '+d.departamento+'</b></td>'+
	'</tr>'+
	'<tr class="sub">'+
	    '<td>Horário: '+d.aula1_dia+', das '+d.aula1_inicio+' às '+d.aula1_fim+'</td>'+
	    '<td></td>'+
	    '<td style="text-align:right">Prof(a).: '+d.aula1_professor+'</td>'+
	'</tr>'+
	'<tr>'+
	    '<td colspan="3"><p style="text-align:center"><b>Sinopse da matéria</b></p>'+
	    '<p style="padding-left:15%;padding-right:15%;text-align:justify">'+d.desc+'<br><br><span style="font-size:70%"><a href="'+d.link+'">Ver mais no Júpiter</a></span></p></td>'+
	'</tr>'+
    '</table>';
}

$(document).ready(function() {
    var table = $('#example').DataTable( {
	paging: false,
	data: lista,
	"dom" : 'lrtip',
	"columns": [
	    { data: "departamento", "visible": false },
	    { data: "sigla" },
	    { data: "titulo" },
	    { data: "turma", "searchable": false },
	    { data: "desc", "visible": false, "searchable": false },
	    { data: "aula1_periodo", "visible": false, "searchable": true },
	    { data: "aula1_dia", "visible": false },
	    { data: "aula1_professor", "visible": false } 
	],
	"columnDefs": [
	    { className: "dt-body-center", "targets": [1,2,3] }
	]
    } );

    $('#example tbody').on('click', 'tr.odd td, tr.even td', function () {
	var tr = $(this).closest('tr');
	var row = table.row( tr );
 
	if ( row.child.isShown() ) {
	    // This row is already open - close it
	    row.child.hide();
	    tr.removeClass('shown');
	}
	else {
	    // Open this row
	    row.child( format(row.data()) ).show();
	    tr.addClass('shown');
	}
    } );
    
    $('#ctrl_dep').on('change', 'input', function () {
	var arr = new Array;
	var inps = $('#ctrl_dep input');
	for (n in inps) {
	    if (inps[n].checked==true) {
		arr.push("("+inps[n].value+")");
	    };
	};
	if (arr.length==0) {
	    arr = ["^$"];
	}
	table.column(0).search(arr.join("|"),true);
	table.draw();
	});

    $('#grade td.grade_chk').on('click', function () {
	$(this).toggleClass('grade_chk');
	$(this).toggleClass('grade_unchk');
	table.draw();
    });

    $('span.grade_col').on('click', function () {
	var num = 7 - $(this).closest('th').nextAll().size();
	if ($('#grade td:nth-child('+String(num)+').grade_chk').size()>1) {
	    $('#grade td:nth-child('+String(num)+').grade_chk').addClass('grade_unchk');
	    $('#grade td:nth-child('+String(num)+').grade_chk').removeClass('grade_chk');
	} else {
	    $('#grade td:nth-child('+String(num)+').grade_unchk').addClass('grade_chk');
	    $('#grade td:nth-child('+String(num)+').grade_unchk').removeClass('grade_unchk');
	}
	table.draw();
    });

    $('td.grade_lin').on('click', function () {
	var that = this;
	if ($(that).nextAll('.grade_chk').size()>3) {
	    $(that).nextAll('.grade_chk').addClass('grade_unchk');
	    $(that).nextAll('.grade_chk').removeClass('grade_chk');
	} else {
	    $(that).nextAll('.grade_unchk').addClass('grade_chk');
	    $(that).nextAll('.grade_unchk').removeClass('grade_unchk');
	};
	table.draw();
    });

    $('#buscatps').on('keyup change', function () {
	table.draw();
    });
    
    $('#togg_hr').on('click', function () {
	if ($('#ctrl_hr').css('display')=='none' && $('#ctrl_dep').css('display')=='none') {
	    $('#ctrl_hr').slideDown(200);
	    $('#but_hr').addClass('shdw');
	} else if ($('#ctrl_hr').css('display')!='none') {
	    $('#ctrl_hr').slideUp(200);
	    $('#but_hr').removeClass('shdw');
	} else {
	    $('#ctrl_dep').hide();
	    $('#but_hr').addClass('shdw');
	    $('#but_dep').removeClass('shdw');
	    $('#ctrl_hr').show();
	};
    });
    
    $('#togg_dep').on('click', function () {
	if ($('#ctrl_hr').css('display')=='none' && $('#ctrl_dep').css('display')=='none') {
	    $('#ctrl_dep').slideDown(200);
	    $('#but_dep').addClass('shdw');
	} else if ($('#ctrl_dep').css('display')!='none') {
	    $('#ctrl_dep').slideUp(200);
	    $('#but_dep').removeClass('shdw');
	} else {
	    $('#ctrl_hr').hide();
	    $('#but_dep').addClass('shdw');
	    $('#but_hr').removeClass('shdw');
	    $('#ctrl_dep').show();
	};
    });
} );
