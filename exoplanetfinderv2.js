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
			
			var url = "mass_radius_planet.xlsx";

			/* set up async GET request */
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			req.responseType = "arraybuffer";

			req.onload = function(e) {
				var data = new Uint8Array(req.response);
				var workbook = XLSX.read(data, {type:"array"});

  
}


            table.appendRows(tableData);
			
			
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "ExoPlanet Data"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();