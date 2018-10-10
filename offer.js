(function (window, $, undefined) {
  "use strict";



  $(document).ready(function () {
    var data = JSON.parse(localStorage.getItem("flat_forprint"));


    $("#area").text(data.area.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));

    switch (data.periodicity) {
      case "1": $("#period").text("одноразово"); break;
      case "2": $("#period").text("дві рівні частини"); break;
      case "12": $("#period").text("щомісячно рівними частинами"); break;
    }

    $("#strsum").text(data.strsum.toLocaleString("uk-UA", { maximumFractionDigits: 0 }));
    $("#strplat").text(data.plat.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));

    if (data.resp > 0) {
      $("#resp").text(data.resp.toLocaleString("uk-UA", { maximumFractionDigits: 0 }));
      $("#resp_fr").text("1 000 грн");
      $("#resp_plat").text(data.resp_plat.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    } else {
      $("#resp").text("-");
      $("#resp_fr").text('-');
      $("#resp_plat").text('-');
    }


    $("#plat").text((data.plat + data.resp_plat).toLocaleString("uk-UA", { minimumFractionDigits: 2 }));



    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    today = dd + '.' + mm + '.' + yyyy;

    $("#dt1").text(today.substring(0, 1));
    $("#dt2").text(today.substring(1, 2));
    $("#dt3").text(today.substring(3, 4));
    $("#dt4").text(today.substring(4, 5));
    $("#dt5").text(today.substring(6, 7));
    $("#dt6").text(today.substring(7, 8));
    $("#dt7").text(today.substring(8, 9));
    $("#dt8").text(today.substring(9, 10));

    autosizeInput(document.querySelector('#name'));

    var mngr = "";
    if (localStorage.getItem("mh_mngr")) {
      mngr = JSON.parse(localStorage.getItem("mh_mngr"));
      if (mngr.length > 5) {
        $("#mngr").val(mngr);
      }
    }

    $("#mngr").change(function () {
      if ($(this).val().length > 5) {
        localStorage.setItem("mh_mngr", JSON.stringify($(this).val()));
      }
    });

    autosizeInput(document.querySelector('#mngr'));

  });


}(window, jQuery));