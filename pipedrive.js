(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {
        // Schema for users
        var user_cols = [
          { id: "id", dataType: tableau.dataTypeEnum.int }, 
          { id: "name", dataType: tableau.dataTypeEnum.string },
          { id: "default_currency", dataType: tableau.dataTypeEnum.string },
          { id: "locale", dataType: tableau.dataTypeEnum.string },
          { id: "lang", dataType: tableau.dataTypeEnum.int },
          { id: "email", dataType: tableau.dataTypeEnum.string },
          { id: "phone", dataType: tableau.dataTypeEnum.string },
          { id: "activated", dataType: tableau.dataTypeEnum.bool }, 
          { id: "last_login", dataType: tableau.dataTypeEnum.date },
          { id: "created", dataType: tableau.dataTypeEnum.date },
          { id: "modified", dataType: tableau.dataTypeEnum.date },
          { id: "signup_flow_variation", dataType: tableau.dataTypeEnum.string },
          { id: "has_created_company", dataType: tableau.dataTypeEnum.bool },
          { id: "is_admin", dataType: tableau.dataTypeEnum.int },
          { id: "timezone_name", dataType: tableau.dataTypeEnum.string },
          { id: "timezone_offset", dataType: tableau.dataTypeEnum.string },
          { id: "active_flag", dataType: tableau.dataTypeEnum.bool },
          { id: "role_id", dataType: tableau.dataTypeEnum.string },
          { id: "icon_url", dataType: tableau.dataTypeEnum.string },
          { id: "is_you", dataType: tableau.dataTypeEnum.bool }         
        ];

        var userTable = {
            id: "users",
            alias: "Users",
            columns: user_cols
        };

        schemaCallback([userTable]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        var apiObj = JSON.parse(tableau.connectionData),
            apiCall = "https://api.pipedrive.com/v1/" + table + "?api_token=" + apiObj.apiToken;

        tableau.log("apiCall=" + apiCall);

        var tableData = [];
        var i = 0;

        $.getJSON(apiCall, function (resp) {
            var data = resp.data;

            for (i = 0, len = data.length; i < len; i++) {
                if (table.tableInfo.id == "users") {
                    data[i].last_login = new Date(data[i].last_login);
                    data[i].created = new Date(data[i].created);
                    data[i].modified = new Date(data[i].modified);
                }

                tableData.push(data[i]);
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            var apiObj = {
                apiToken: $('#api-token').val().trim()
            };

            // Simple date validation: Call the getDate function on the date object created
            function isValidApiToken(apiToken) {
                // Try to connect to the Pipedrive API
                return true;
            }

            // Need validation?
            if (true) {
                tableau.connectionData = JSON.stringify(apiObj); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "Pipedrive"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid API token for Pipedrive");
            }
        });
    });
})();
