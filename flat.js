(function () {
  "use strict";
  var $area, $error, $under, $strsum, $strplat, $resp, $resp_plat, $plat, $res, $resp_fr, $base, $resp_base, $k1, $k2, $k3, $k4, $base_plat, $res2;


  var calc = {
    strsum_per_square: { "Kiev": 24000, "Dnepr": 15000, "Other": 9000 },
    strplt_per_square: { "Kiev": 44, "Dnepr": 23, "Other": 16 },
    k1_commissions: { "0": 0.68, "15": 0.82, "30": 1 },
    k3_prolongation: { "0": 1, "1": 0.95, "2": 0.90, "3": 0.85 },
    k4_periodicity: { "1": 1, "2": 1, "12": 1.1 },
    responsibility_limits: { "0": 0, "100000": 0.2, "200000": 0.17, "300000": 0.15, "500000": 0.13, "1000000": 0.125 }
  };


  var sheduled_recalculate = 0;
  var shedule_recalculate = function () {
    if (sheduled_recalculate === 0) {
      sheduled_recalculate = setTimeout(recalculate, 100);
    }
  };




  var recalculate = function () {
    sheduled_recalculate = 0;
    $res.hide();
    $error.text("");
    $under.text("");
    calc.city = $("input[name='city']:checked").val();
    calc.area = Number($area.val().replace(',', '.'));

    if (calc.area == "NaN" || calc.area <= 0) {
      $error.text("Введіть площу квартири.");
      return;
    } else if (calc.area < 19) {
      $error.text("Розрахунок для зазначеної площі не може бути наданий.");
      return;
    }

    calc.strsum = calc.area * calc.strsum_per_square[calc.city];
    if (calc.strsum > 5000000) {
      $under.text("Договір із страховою сумою більше, ніж 5 000 000, 00 грн.потребує погодження з андеррайтером");
    }



    calc.commission = $("input[name='commission']:checked").val();
    calc.k1 = calc.k1_commissions[calc.commission];
    calc.losses = $("input[name='losses']:checked").val();
    if (calc.losses == 1) {
      $error.text("Наявні збитки. Зверніться до андерайтера.");
      return;
    }
    calc.k2 = 1;
    calc.prolongation = $("input[name='prolongation']:checked").val();
    calc.k3 = calc.k3_prolongation[calc.prolongation];
    calc.periodicity = $("input[name='periodicity']:checked").val();
    calc.k4 = calc.k4_periodicity[calc.periodicity];


    calc.strplt = calc.area * calc.strplt_per_square[calc.city];
    calc.tarbase = calc.strplt / calc.strsum * 100;
    calc.tar = calc.tarbase * calc.k1 * calc.k2 * calc.k3 * calc.k4 * 100;
    calc.plat = Math.round(calc.strsum * calc.tar / 100) / 100;

    calc.resp = $("input[name='responsibility']:checked").val();
    calc.resp_tar_base = calc.responsibility_limits[calc.resp];
    calc.resp_tar = calc.resp_tar_base * calc.k1 * calc.k2 * calc.k3 * calc.k4 * 100;
    calc.resp = Number(calc.resp);
    calc.resp_plat = Math.round(calc.resp * calc.resp_tar / 100) / 100;


    $strsum.text(calc.strsum.toLocaleString("uk-UA", { maximumFractionDigits: 0 }));
    $strplat.text(calc.plat.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));

    if (calc.resp > 0) {
      $resp.text(calc.resp.toLocaleString("uk-UA", { maximumFractionDigits: 0 }));
      $resp_fr.text("1 000 грн");
      $resp_plat.text(calc.resp_plat.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    } else {
      $resp.text("-");
      $resp_fr.text('-');
      $resp_plat.text('-');
    }


    $plat.text((calc.plat + calc.resp_plat).toLocaleString("uk-UA", { minimumFractionDigits: 2 }));

    calc.base = calc.strsum * calc.tarbase / 100;
    calc.resp_base = calc.resp_tar_base * calc.resp / 100;

    $base.text(calc.base.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $resp_base.text(calc.resp_base.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $k1.text(calc.k1.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $k2.text(calc.k2.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $k3.text(calc.k3.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $k4.text(calc.k4.toLocaleString("uk-UA", { minimumFractionDigits: 2 }));
    $base_plat.text((calc.plat + calc.resp_plat).toLocaleString("uk-UA", { minimumFractionDigits: 2 }));


    localStorage.removeItem("flat_forprint");
    localStorage.setItem("flat_forprint", JSON.stringify(calc));


    $res.show();
  };




  var radio_buttons_skin = function (name) {
    var $buttons = $("input[name='" + name + "']");
    $buttons.parent("label").addClass("skin");
    $buttons.change(function () {
      $buttons.parent("label").removeClass("checked");
      $buttons.filter(":checked").parent("label:not(.disabled)").addClass("checked");
      shedule_recalculate();
    });
    $buttons.change();
  };

  $(document).ready(function () {
    radio_buttons_skin("city");
    radio_buttons_skin("commission");
    radio_buttons_skin("periodicity");
    radio_buttons_skin("responsibility");
    radio_buttons_skin("losses");
    radio_buttons_skin("prolongation");

    $area = $("#area");
    /*$area.number(true, 2, ',', '');*/
    $area.keyup(shedule_recalculate);

    $error = $("#error");
    $under = $("#under");
    $strsum = $("#strsum");
    $strplat = $("#strplat");
    $resp = $("#resp");
    $resp_plat = $("#resp_plat");
    $plat = $("#plat");
    $res = $("#res");
    $res2 = $("#res2");
    $resp_fr = $("#resp_fr");

    $base = $("#base");
    $resp_base = $("#resp_base");
    $k1 = $("#k1");
    $k2 = $("#k2");
    $k3 = $("#k3");
    $k4 = $("#k4");
    $base_plat = $("#base_plat");

    $res2.hide();
    $("#info").click(function () {
      $res2.toggle();
    });


    /*var link;
    if (/mobile|android/i.test(navigator.userAgent) && (window.screen.availWidth < 910)) {
      link = document.createElement("link");
      link.href = "pda.css";
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }*/


  });

}());