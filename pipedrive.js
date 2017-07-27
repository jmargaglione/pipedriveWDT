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

        var userTable = { id: "users", alias: "Users", columns: user_cols };

        var inputForm = JSON.parse(tableau.connectionData),
            callbackTables = [];
        
        if(inputForm.tables.indexOf("users") >= 0) callbackTables.push(userTable);
        /*
        if(inputForm.tables.indexOf("clients") >= 0) callbackTables.push(clientTable);
        if(inputForm.tables.indexOf("projects") >= 0) callbackTables.push(projectTable);
        if(inputForm.tables.indexOf("timeEntries") >= 0) callbackTables.push(timeEntriesTable);
        if(inputForm.tables.indexOf("expenses") >= 0) callbackTables.push(expenseTable);
        if(inputForm.tables.indexOf("invoices") >= 0) callbackTables.push(invoiceTable);
        if(inputForm.tables.indexOf("payments") >= 0) callbackTables.push(paymentTable);
        */

        schemaCallback(callbackTables);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        var inputForm = JSON.parse(tableau.connectionData),
            apiCall = "https://api.pipedrive.com/v1/" + table.tableInfo.id + "?api_token=" + apiObj.apiKey;

        var tableData = [];
        var i = 0;

        tableau.log(inputForm);

        if (inputForm.tables.indexOf(table.tableInfo.id) >= 0) {

            $.getJSON(apiCall, function (resp) {
                var data = resp.data;

                for (i = 0, len = data.length; i < len; i++) {
                    if (table.tableInfo.id == "users") {
                        data[i].dateOfBirth = new Date(data[i].dateOfBirth);
                    }

                    tableData.push(data[i]);
                }

                table.appendRows(tableData);
            });
        }

        doneCallback();
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            var inputForm = {
                 apiKey: $('#api-key').val().trim(),
                 tables: []
            };

            if($('#users').is(':checked')) inputForm.tables.push("users");
            /*
            if($('#clients').is(':checked')) inputForm.tables.push("clients");
            if($('#projects').is(':checked')) inputForm.tables.push("projects");
            if($('#timeEntries').is(':checked')) inputForm.tables.push("timeEntries");
            if($('#expenses').is(':checked')) inputForm.tables.push("expenses");
            if($('#invoices').is(':checked')) inputForm.tables.push("invoices");
            if($('#payments').is(':checked')) inputForm.tables.push("payments");
            */

            // No validation yet. Might add date range validation...
            function isValidApiKey(apiKey) {
                // Try to connect to the Pipedrive API
                return true;
            }

            // Need validation?
            if (isValidApiKey(inputForm.apiKey)) {
                tableau.connectionData = JSON.stringify(inputForm); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "Pipedrive"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid API key for Bill4Time");
            }
        });
    });
})();
