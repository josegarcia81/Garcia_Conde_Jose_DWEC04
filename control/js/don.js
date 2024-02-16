'use strict'

$(document).ready(function(){

    // VARIABLES PETICIONES //
    var url = "https://api.euskadi.eus/";
    var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJKb3NlIE1hcmlhIEdhcmNpYSBDb25kZSBCSVJUTEgiLCJleHAiOjE4OTUxNDkyMDAsInZlcnNpb24iOiIxLjAuMCIsImlhdCI6MTcwNTc2MDQwMCwiZW1haWwiOiJtaWtpcGlraTgxQGdtYWlsLmNvbSJ9.KPgd8J-5ranETbnve1yBROoNjo03Q2HxlaiyGhLsnLV3sPky5M2gG7eiOK0eP2zsqETBO7ZFYGb5WbxyGOhRJwUoiLgHN2Ms6_eUl89JJegnZC3w3EPR36OLGXen6TE1Kuzg1tnUuR5bDKh-edwf_4zwg7XsDBFsc4sFcmzMyVcV6sDnZfThfT--_6pJTa4PdRCOIzHjreQv5k6wWGTRt_YCM2Pa3aEMYkFviZZ_977wyv4GeTPnsM9zxZzr-3qLdXAAP1yMQ_Z2s6oo1PGqiDCRZYemXB9QQHrEVnRPlv1Yz7_OIWleWChWA8BrMtLE01KkklZLbHRh7ivsKoDHYA";
        // REGION ZONA LOCALIZACION //
    var regionId = "basque_country";
    var zoneId = "donostialdea";
    var locId = "donostia";

    // VARIABLE PARA ARRAY TEMP. GRAFICA //
    var data_trend = [];
    var grafica = $("#tendencia_locId").get(0).getContext('2d');

    // VARIABLES BOTONES IDIOMA //
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

    fecha_dia_sig = anio + "" + mes + "" + dia_sig;
    
    // Peticion ajax para el tiempo local //
    $.ajax({
        type: "GET",
        url : url+"euskalmet/weather/regions/"+regionId+"/zones/"+zoneId+"/locations/"+locId+"/forecast/at/"+anio+"/"+mes+"/"+dia+"/for/"+(fecha_dia_sig-1)+"",
        headers: {'Authorization':'Bearer '+token+''},
        dataType: "json",
        success: function(response){
            console.log(response)
            // escribir datos en los contenedores //
            $('#ciudad').html('<li>Temperatura actual: ' + response.temperature.value + '</li><br>'
                            +'<li>Max: ' + response.temperatureRange.max + '</li>'
                            +'<li>Min: ' + response.temperatureRange.min+'</li>')
            $('#prediccion_locId').html("<p>"+response.forecastText.SPANISH+"</p>")
            
            // PREVISIÓN IDIOMAS //
            boton_esp.click(function(){
                $("#titulo").html("El Tiempo en San Sebastian")
                $("#don").html("SAN SEBASTIAN")
                $('#prediccion_locId').html("<p>"+response.forecastText.SPANISH+"</p>")
            })

            boton_eus.click(function(){
                $("#titulo").html("Eguraldia Donostian")
                $("#don").html("DONOSTIA")
                $('#prediccion_locId').html("<p>"+response.forecastText.BASQUE+"</p>")
            })

        },
        error: function(error){
            console.log(error)
            alert("Error en la carga de datos")
        }
    })

    // PETICION PARA GRAFICA //
    $.ajax({
        type: "GET",
        url : url+"euskalmet/weather/regions/"+regionId+"/zones/"+zoneId+"/locations/"+locId+"/forecast/trends/measures/at/"+anio+"/"+mes+"/"+dia+"/for/"+(fecha_dia_sig-1)+"",
        headers: {'Authorization':'Bearer '+token+''},
        dataType: "json",
        success: function(response){
            // VISUALIZAR DATOS //
            console.log(response)
            // RECOGER DATOS UTILES EN VARIABLE //
            data_trend = response.trends.set;
            console.log(data_trend);

            // ORDENAR DATOS POR HORAS PARA CREAR LA GRAFICA //
            var mapped_data = data_trend.map(function(element,i){
                return {index : i, value : element.range}
            })

            mapped_data.sort(function (a,b){
                if (a.value > b.value) {
                    return 1;
                }
                if (a.value < b.value) {
                    return -1;
                }
                return 0;
            })

            var ordered_data = mapped_data.map(function(element){
                return data_trend[element.index]
            })
            console.log(ordered_data)
            //console.log(ordered_data[0].temperature.value)

            var listado_temp = ordered_data.map(function(element){
                return element.temperature.value
            })
            console.log(listado_temp)

            var listado = JSON.stringify(listado_temp)
            console.log(listado)
            // obtener calculo del max valos del array //
            var max = Math.max(...listado_temp)
            console.log(max)

            var chart = new Chart(grafica,{
                type:"line",
                data:{
                    labels:["00.00",
                            "01:00",
                            "02:00",
                            "03:00",
                            "04:00",
                            "05:00",
                            "06:00",
                            "07:00",
                            "08:00",
                            "09:00",
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                            "17:00",
                            "18:00",
                            "19:00",
                            "20:00",
                            "21:00",
                            "22:00",
                            "23:00"],
                    datasets:[
                        {
                            label:"Temperaturas para hoy",
                            backgroundColor:"rgba(0,0,0,0.7)",
                            margin:"1em",
                            padding:"1em",
                            // aqui van los datos de las temperaturas por horas //
                            data:listado_temp
                        }
                    ]
                },
                options: {
                    scales: {
                      y: {
                        beginAtZero: true,
                        suggestedMax: (max+3)

                      }
                    }
                }
            })
        },
        error: function(error){
            console.log(error)
            alert("Error en la carga de datos")
        }
    })
})