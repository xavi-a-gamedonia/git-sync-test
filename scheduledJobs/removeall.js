var operations_players = [];

var query_remove="{}";
var opp = gamedonia.data.createRemove(query_remove);

operations_players.push(opp);

gamedonia.data.runBulkOperations("movies",operations_players,{ 

    success: function (result) { 
        
        log.info("inserted: "+result.insertedCount);
        log.info("matched: "+result.matchedCount);
        log.info("modified: "+result.modifiedCount);
        log.info("removed: "+result.removedCount);
        response.success(result);
    
    },error: function (error) {

         log.error(error.message);
         response.error(error.message);
    } 
});