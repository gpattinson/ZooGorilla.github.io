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
			id: "pl_discmethod",
            alias: "Discovery_Method",
            dataType: tableau.dataTypeEnum.string
        },{
			id: "pl_dens",
            alias: "Density",
            dataType: tableau.dataTypeEnum.float
        },{
			id: "pl_imgflag",
            alias: "Has_Image",
            dataType: tableau.dataTypeEnum.string
        },{
			id: "pl_eqt",
            alias: "Equilibrium_Temp",
            dataType: tableau.dataTypeEnum.float
        },{
			id: "pl_disc",
            alias: "Year_Discovered",
            dataType: tableau.dataTypeEnum.float
        },{
			id: "pl_pelink",
            alias: "Link_pe",
            dataType: tableau.dataTypeEnum.string
        },{
			id: "pl_edelink",
            alias: "Link_ede",
            dataType: tableau.dataTypeEnum.string
        },{
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
        $.getJSON("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_name,pl_masse,pl_rade,pl_discmethod,pl_dens,pl_imgflag,pl_eqt,pl_disc,pl_pelink,pl_edelink,rowupdate&order=dec&format=json", function(resp) {
                
			var resp2=JSON.parse(JSON.stringify(resp)),
				tableData = [];
			for (var i = 0, len = resp2.length; i < len; i++) {
                tableData.push({
                    "pl_name": resp2[i].pl_name,
                    "pl_masse": resp2[i].pl_masse,
                    "pl_rade": resp2[i].pl_rade,
					"pl_discmethod":resp2[i].pl_discmethod,
					"pl_dens":resp2[i].pl_dens,
					"pl_imgflag":resp2[i].pl_imgflag,
					"pl_disc":resp2[i].pl_disc,
					"pl_pelink":resp2[i].pl_pelink,
					"pl_edelink":resp2[i].pl_edelink,
                    "rowupdate": resp2[i].rowupdate
                });
			}
			
			tableData.push({
				"pl_name": "Earth",
				"pl_masse": 1,
				"pl_rade": 1,
				"pl_discmethod": "NA",
				"pl_dens": 5.51,
				"pl_imgflag": "NA",
				"pl_eqt": 255,
				"pl_disc": 1900,
				"pl_pelink": "NA",
				"pl_edelink": "NA",
			"rowupdate": '1/1/1900'});
			
			tableData.push({
				"pl_name": "M8_Model",
				"pl_masse": 8,
				"pl_rade": 1.7,
				"pl_discmethod": "NA",
				"pl_dens": 5.51,
				"pl_imgflag": "NA",
				"pl_eqt": 255,
				"pl_disc": 1900,
				"pl_pelink": "NA",
				"pl_edelink": "NA",
			"rowupdate": '1/1/1900'});
			
			tableData.push({
				"pl_name": "M15_Model",
				"pl_masse": 15,
				"pl_rade": 2.0,
				"pl_discmethod": "NA",
				"pl_dens": 5.51,
				"pl_imgflag": "NA",
				"pl_eqt": 255,
				"pl_disc": 1900,
				"pl_pelink": "NA",
				"pl_edelink": "NA",
			"rowupdate": '1/1/1900'});
			
			tableData.push({
				"pl_name": "Mass-Radius-Curve",
				"pl_masse": 1,
				"pl_rade": 1,
				"pl_discmethod": "NA",
				"pl_dens": 5.51,
				"pl_imgflag": "NA",
				"pl_eqt": 255,
				"pl_disc": 1900,
				"pl_pelink": "NA",
				"pl_edelink": "NA",
			"rowupdate": '1/1/1900'});
				
				
			

		
	
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