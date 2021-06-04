$.getJSON("https://api.covid19india.org/data.json", function(data) {
    var tableString =
        "<tr><th>State</th><th>Confirmed</th><th>Active</th><th>Deaths</th><th>Recovered</th><th>Recovery Rate</th><th>Death Rate</th></tr>";
    // console.log(data["statewise"].length);
    $("#lastupdate").text(data["statewise"][0]["lastupdatedtime"]);
    $("#confirmed").text(
        data["statewise"][0]["confirmed"] +
        " [+" +
        data["statewise"][0]["deltaconfirmed"] +
        "]"
    );
    $("#active").text(data["statewise"][0]["active"]);
    $("#recovered").text(
        data["statewise"][0]["recovered"] +
        " [+" +
        data["statewise"][0]["deltarecovered"] +
        "]"
    );
    $("#deaths").text(
        data["statewise"][0]["deaths"] +
        " [+" +
        data["statewise"][0]["deltadeaths"] +
        "]"
    );
    $("#recovrate").text(
        (
            (data["statewise"][0]["recovered"] / data["statewise"][0]["confirmed"]) *
            100
        ).toFixed(2) + " %"
    );
    $("#drate").text(
        (
            (data["statewise"][0]["deaths"] / data["statewise"][0]["confirmed"]) *
            100
        ).toFixed(2) + " %"
    );
    for (var i = 1; i < data["statewise"].length; i++) {
        if (data["statewise"][i]["state"] == "State Unassigned") {
            continue;
        } else {
            tableString +=
                "<tr class='state' name='" +
                data["statewise"][i]["statecode"] +
                "'><td>" +
                data["statewise"][i]["state"] +
                "</td><td>" +
                data["statewise"][i]["confirmed"] +
                "</td><td>" +
                data["statewise"][i]["active"] +
                "</td><td>" +
                data["statewise"][i]["deaths"] +
                "</td><td>" +
                data["statewise"][i]["recovered"] +
                "</td><td>" +
                (
                    (data["statewise"][i]["recovered"] /
                        data["statewise"][i]["confirmed"]) *
                    100
                ).toFixed(2) +
                "%" +
                "</td><td>" +
                (
                    (data["statewise"][i]["deaths"] / data["statewise"][i]["confirmed"]) *
                    100
                ).toFixed(2) +
                "%" +
                "</td></tr>";
        }
    }
    $("#dataentry").html(tableString);
    $(".state").click(function() {
        var scode = $(this).attr("name");
        $("#citydata").text("");
        // console.log(scode);
        for (var i = 1; i < data["statewise"].length; i++) {
            if (data["statewise"][i]["statecode"] == scode) {
                var sname = data["statewise"][i]["state"];
                var sconf = data["statewise"][i]["confirmed"];
                var sactive = data["statewise"][i]["active"];
                var sdeaths = data["statewise"][i]["deaths"];
                var srecover = data["statewise"][i]["recovered"];
                var srrate = (
                    (data["statewise"][i]["recovered"] /
                        data["statewise"][i]["confirmed"]) *
                    100
                ).toFixed(2);
                var sdrate = (
                    (data["statewise"][i]["deaths"] / data["statewise"][i]["confirmed"]) *
                    100
                ).toFixed(2);
                // console.log(sname, sconf, sactive, sdeaths, srecover, srrate, sdrate);
                $("#pstate").text(sname);
                $("#pconfirm").text(
                    sconf + "[+" + data["statewise"][i]["deltaconfirmed"] + "]"
                );
                $("#pactive").text(sactive);
                $("#precovered").text(
                    srecover + "[+" + data["statewise"][i]["deltarecovered"] + "]"
                );
                $("#prrate").text(srrate);
                $("#pdeaths").text(
                    sdeaths + "[+" + data["statewise"][i]["deltadeaths"] + "]"
                );
                $("#pdrate").text(sdrate);
            }
        }
        $.getJSON(
            "https://api.covid19india.org/state_district_wise.json",
            function(data) {
                // console.log(data["GJ"]["districts"]);
                // console.log(scode);
                // console.log(data);
                for (var state in data) {
                    // console.log(state);
                    if (data[state]["statecode"] == scode) {
                        // console.log(data[state]["districtData"]);
                        for (var city in data[state]["districtData"]) {
                            // console.log(city);
                            var cityactive = data[state]["districtData"][city]["active"];
                            // console.log(cityactive);
                            var cityconfirmed =
                                data[state]["districtData"][city]["confirmed"];
                            // console.log(cityconfirmed);
                            var citydeaths = data[state]["districtData"][city]["deceased"];
                            // console.log(citydeaths);
                            var cityrecovered =
                                data[state]["districtData"][city]["recovered"];
                            // console.log(cityrecovered);
                            $("#citydata").append(
                                "<div class='citycontainer'> <h4>" +
                                city +
                                "</h4> <div class='blue'> <strong>Confirmed : </strong><span>" +
                                cityconfirmed +
                                "[+" +
                                data[state]["districtData"][city]["delta"]["confirmed"] +
                                "]" +
                                "</span></div><div class='blue'><strong>Active : </strong><span>" +
                                cityactive +
                                "</span></div><div class='green'><strong>Recovered : </strong><span>" +
                                cityrecovered +
                                "[+" +
                                data[state]["districtData"][city]["delta"]["recovered"] +
                                "]" +
                                "</span></div><div class='red'><strong>Deaths : </strong><span>" +
                                citydeaths +
                                "[+" +
                                data[state]["districtData"][city]["delta"]["deceased"] +
                                "]" +
                                "</span></div> </div>"
                            );
                        }
                    }
                }
            }
        );
        $("#popup").fadeIn(200);
    });
    $("#closebtn").click(function() {
        $("#popup").fadeOut(200);
    });
});