'use strict'

$(document).ready(function(){
    // VARIABLES PETICIONES //
    var url = "https://api.euskadi.eus/";
    //var datos;
    var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJKb3NlIE1hcmlhIEdhcmNpYSBDb25kZSBCSVJUTEgiLCJleHAiOjE4OTUxNDkyMDAsInZlcnNpb24iOiIxLjAuMCIsImlhdCI6MTcwNTc2MDQwMCwiZW1haWwiOiJtaWtpcGlraTgxQGdtYWlsLmNvbSJ9.KPgd8J-5ranETbnve1yBROoNjo03Q2HxlaiyGhLsnLV3sPky5M2gG7eiOK0eP2zsqETBO7ZFYGb5WbxyGOhRJwUoiLgHN2Ms6_eUl89JJegnZC3w3EPR36OLGXen6TE1Kuzg1tnUuR5bDKh-edwf_4zwg7XsDBFsc4sFcmzMyVcV6sDnZfThfT--_6pJTa4PdRCOIzHjreQv5k6wWGTRt_YCM2Pa3aEMYkFviZZ_977wyv4GeTPnsM9zxZzr-3qLdXAAP1yMQ_Z2s6oo1PGqiDCRZYemXB9QQHrEVnRPlv1Yz7_OIWleWChWA8BrMtLE01KkklZLbHRh7ivsKoDHYA";
    var regionId = "basque_country";
    
    // VARIABLES BOTONES //
    var boton_vit = $("#pre_gasteiz");
    var boton_bil = $("#pre_bilbo");
    var boton_don = $("#pre_donosti");
    var boton_esp = $("#esp")
    var boton_eus = $("#eus")

    // VARIABLES PARA OBTENER LA FECHA ACTUAL //
    var fecha = new Date();
    var anio = (fecha.getFullYear()).toString();
    var mes = (fecha.getMonth()+1).toString();
    var dia = (fecha.getDate()).toString();
    var dia_sig = (fecha.getDate()+1).toString();
    var fecha_dia_sig;

    fechaDosDigitos(mes,dia,dia_sig);

    function fechaDosDigitos(este_mes,este_dia,este_dia_sig){
        if(mes < 10){
            mes = '0' + este_mes;
            console.log(mes);
        }else if(dia < 10){
            dia = '0' + este_dia;
            console.log(dia);
        }else if(dia_sig < 10){
            dia_sig = '0' + este_dia_sig;
        }
    }
    // console.log(mes);
    // console.log(anio + " " + mes + " " + dia);
    // console.log(anio + "" + mes + "" + dia);

    fecha_dia_sig = anio + "" + mes + "" + dia_sig;

    
    
    // Petion ajax a el servidor API Rest de Euskalmet prediccion general //
    $.ajax({
        type: "GET",
        url : url+"euskalmet/weather/regions/"+regionId+"/forecast/at/"+anio+"/"+mes+"/"+dia+"/for/"+fecha_dia_sig+"",
        headers: {'Authorization':'Bearer '+token+''},
        dataType: "json",
        success: function(response){
            console.log(response)
            // console.log(response.citiesTemperatureRange[4].temperature.max)
            // console.log(response.citiesTemperatureRange[4].temperature.min)
            $('#gasteiz').html('<li>Max: ' + response.citiesTemperatureRange[4].temperature.max+'</li>'
                                +'<li>Min: ' + response.citiesTemperatureRange[4].temperature.min+'</li>')
            $('#donosti').html('<li>Max: ' + response.citiesTemperatureRange[5].temperature.max+'</li>'
                                +'<li>Min: ' + response.citiesTemperatureRange[5].temperature.min+'</li>')
            $('#bilbo').html('<li>Max: ' + response.citiesTemperatureRange[0].temperature.max+'</li>'
                                +'<li>Min: ' + response.citiesTemperatureRange[0].temperature.min+'</li>')
            $('#prediccion_hoy').html("<p>"+response.forecastTextByLang.SPANISH+"</p>")
            // console.log(typeof(response.forecastTextByLang.SPANISH))

            // PREVISIÓN IDIOMAS //
            boton_esp.click(function(){
                $("#titulo").html("El Tiempo en Euskal Herria")
                $("#vit").html("VITORIA")
                $("#bil").html("BILBAO")
                $("#don").html("SAN SEBASTIAN")
                $("#prediccion_euskadi").html("Predicción para el día de hoy en Euskadi:")
                $('#prediccion_hoy').html("<p>"+response.forecastTextByLang.SPANISH+"</p>")
            })

            boton_eus.click(function(){
                $("#titulo").html("Euskal Herriko eguraldia")
                $("#vit").html("GASTEIZ")
                $("#bil").html("BILBO")
                $("#don").html("DONOSTI")
                $("#prediccion_euskadi").html("Gaurko eguraldia Euskadin:")
                $('#prediccion_hoy').html("<p>"+response.forecastTextByLang.BASQUE+"</p>")
            })
        },
        error: function(error){
            console.log(error)
        }
        
    })

    boton_vit.click(function(){
        window.open("../../view/gasteiz.html", "_self")
    })  
    boton_bil.click(function(){
        window.open("../../view/bilbo.html", "_self")
    })
    boton_don.click(function(){
        window.open("../../view/donosti.html", "_self")
    })

})