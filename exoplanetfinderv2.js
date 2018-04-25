(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "pl_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "pl_masse",
            alias: "Mass_Earth",
            dataType: tableau.dataTypeEnum.float
        }, {
			id: "pl_rade",
            alias: "Radius_Earth",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rowupdate",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "exoplanets",
            alias: "Confirmed ExoPlanets",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_name,pl_masse,pl_rade,rowupdate&order=dec&format=json", function(resp) {
                
			var resp2=JSON.parse(JSON.stringify(resp)),
				tableData = [];
			for (var i = 0, len = resp2.length; i < len; i++) {
                tableData.push({
                    "pl_name": resp2[i].pl_name,
                    "pl_masse": resp2[i].pl_masse,
                    "pl_rade": resp2[i].pl_rade,
                    "rowupdate": resp2[i].rowupdate
                });
			}
			tableData.push({
				"pl_name": "Earth",
				"pl_masse": 1,
				"pl_rade": 1,
			"rowupdate": '1/1/1900'});
		
	
            table.appendRows(tableData);
			
			
            doneCallback();
        });
    };
	
	const url = "https://zoogorilla.github.io/mass_radius_planet.xlsx";

	/* set up async GET request */
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url,true);
	oReq.responseType="arraybuffer";
	oReq.onload = function(e) {
	var arraybuffer = oReq.response; // not responseText
	var data = new Uint8Array(arraybuffer);
    var arr = new Array();
	for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
	var bstr = arr.join("");
	/* Call XLSX */
	var workbook = XLSX.read(bstr, {type: "binary"});
	/* DO SOMETHING WITH workbook HERE */
	var firstSheet = workbook.SheetNames[0];
	console.log(workbook);
				}
	oReq.send();

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ExoPlanet Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();