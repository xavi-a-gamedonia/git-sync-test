// CONFIGURATION
// -------------

var print_test_results = true;
var collection_name = "testsapi";

var testmark = gamedonia.data.newEntity();

var d = new Date();
testmark.date = d;
testmark.api = "data";

// TEST START
// ----------

testDataApi();

function testDataApi() {

    var e = gamedonia.data.newEntity();

    e.name = "my_entity";
    e.mydate = new Date();

    gamedonia.data.create(collection_name, e, {

        success: function(res_create) {

                printTest("CREATE", true);

                res_create.name = "modificado";

                var cr_d = res_create.mydate;
                log.info("Year: "+cr_d.getFullYear());
                log.info("Date is: "+cr_d.getHours()+":"+cr_d.getMinutes()+":"+cr_d.getSeconds()+" "+cr_d.getDate()+"."+(cr_d.getMonth()+1)+"."+cr_d.getFullYear());
                cr_d.setHours(8);
                cr_d.setMinutes(36);
                cr_d.setSeconds(44);
                cr_d.setMilliseconds(388);
                cr_d.setDate(21);
                cr_d.setMonth(4);
                cr_d.setFullYear(2012);

                res_create.put("mydate", cr_d);

                gamedonia.data.update(collection_name, res_create, {

                        success: function(res_update) {

                            if (res_update.name == "modificado") printTest("UPDATE", true);
                            else printTest("UPDATE", false);

                            var upd_d = res_update.mydate;
                            log.info("Date was updated to: "+upd_d.getHours()+":"+upd_d.getMinutes()+":"+upd_d.getSeconds()+" "+upd_d.getDate()+"."+(upd_d.getMonth()+1)+"."+upd_d.getFullYear());

                            search();

                            response.success();
                        },
                        error: function(error) {

                            printTest("UPDATE", false);
                            log.error(error.message);
                            response.error(error.message);
                        }
                });

                response.success();
        },
        error: function(error) {

                printTest("CREATE", false);
                log.error(error.message);
                response.error(error.message);
        }
    });

    function search() {

        //{access:{$gte:ISODate("2016-01-14T00:00:00.000Z")}}
        var query = "{'name':'modificado','mydate':{'$gte':ISODate(\"2001-10-01T00:00:00.000Z\")}}";
        //var query = "{'mydate':{'$gte':ISODate(\"2001-10-01T00:00:00.000Z\")}}";

        gamedonia.data.search(collection_name, query, {

            success: function(res_search){

                log.info(res_search.size());

                if(res_search.length == 0 ) {

                    printTest("SEARCH", false);

                } else {

                    //var ressy = res_search.get(0);
                    var ressy = res_search[0];

                    log.info(res_search[0].name);
                    log.info(ressy.name);
                    log.info(ressy.mydate.getFullYear());

                    var dd = ressy.mydate;
                    log.info("Date found is: "+dd.getHours()+":"+dd.getMinutes()+":"+dd.getSeconds()+" "+dd.getDate()+"."+(dd.getMonth()+1)+"."+dd.getFullYear());

                    if (ressy.name == "modificado") printTest("SEARCH", true);
                    else printTest("SEARCH", false);

                    get(ressy);

                    response.success();
                }

            },
            error:function(error){

                printTest("SEARCH", false);
                log.error(error.message);
                response.error(error.message);
            }
        });   
    }

    function get(entity) {

        gamedonia.data.get(collection_name, entity._id, {

            success: function (res_get) {

                log.info(res_get.mydate.getFullYear());
                
                if (res_get.name == "modificado" && (res_get.mydate.getFullYear() == 2012)) printTest("GET", true);
                else printTest("GET", false);

                getNonExistent();
                
                response.success();
            },
            error: function (error) {

                printTest("GET", false);
                log.error(error.message);
                response.error(error.message);
            }

        });
    }

    function getNonExistent() {

        gamedonia.data.get(collection_name, "555555555555555555555555", {

            success: function (res_get) {

                printTest("GET non_existent", false);

                response.success();
            },
            error: function (error) {

                printTest("GET non_existent", true);

                log.error(error.message);
                response.error(error.message);
                
                count();
            }

        });
    }


    function count() {

        gamedonia.data.count(collection_name, "{}", {

                success: function(res_count) {

                        printTest("COUNT", true);

                        log.info(res_count);
                        createAndRemove();
                        
                        response.success();
                },
                error: function(error) {

                        printTest("COUNT", false);
                        log.error(error.message);
                        response.error(error.message);
                }
        });
    }

    function createAndRemove() {

        var e = gamedonia.data.newEntity();

        e.name = "entity_to_remove";

        gamedonia.data.create(collection_name, e, {

            success: function(res_cr) {

                    gamedonia.data.remove(collection_name, res_cr._id, {

                        success: function () {

                            printTest("REMOVE", true);

                            removeNonExistent();

                            response.success();
                        },
                        error: function (error) {

                            printTest("REMOVE", false);
                            log.error(error.message);
                            response.error(error.message);
                        }

                    });

                    response.success();
            },
            error: function(error) {
                    log.error(error.message);
                    response.error(error.message);
            }
        });
    }

    function removeNonExistent() {

        gamedonia.data.remove(collection_name, "111111111111111111111111", {

            success: function () {

                printTest("REMOVE non_existent", false);
                response.success();
            },
            error: function (error) {

                printTest("REMOVE non_existent", true);

                log.error(error.message);
                response.error(error.message);

                testBulkOps();
            }

        });
    }
}

function testBulkOps () {

    var operations = [];

    for (var i=0;i<5;i++) {
        
        var name = "John" + i;
        var score = 100 + i;
            
        var op = gamedonia.data.createInsert("{\"name\":\"" + name + "\", \"score\":" + score + "}");
        operations.push(op);
    }   

    operations.push(gamedonia.data.createUpdate("{\"score\":{$gt:100}}","{\"score\":5}"));

    var query_remove = "{ name: {$regex:\"John[0-9]\"} }";

    var opp = gamedonia.data.createRemove(query_remove);
    operations.push(opp);

    gamedonia.data.runBulkOperations(collection_name, operations, {
        success: function(result) {      
            if( (result.insertedCount) == 5 && (result.matchedCount == 4) && (result.modifiedCount == 4) && (result.removedCount == 5 ) ) {

                printTest("BULK_OPS", true);
                testHttpRequest();
            }

            else printTest("BULK_OPS", false); 

            
        },
        error: function(error) {
            printTest("BULK_OPS", false);
          }
    });
}

function testHttpRequest() {

    var http = gamedonia.http;

    httpGet();

    function httpGet() {

        http.get({url:'http://jsonplaceholder.typicode.com/posts'},{
                success: function(httpResponse) {
                    
                    //Print the response content in the Logs

                    /*
                    log.info(httpResponse.status);
                    log.info(httpResponse.body);

                    for(var headerName in httpResponse.headers) {

                        log.info(headerName + ": " + httpResponse.headers[headerName]);
                    }
                    */
                    
                    
                    if (httpResponse.status == 200) {

                        printTest("HTTP_GET", true);
                        httpPost();
                        response.success();
                                                
                    } else {

                        printTest("HTTP_GET", false);  
                        response.error();
                    }
                                    
                },
                error: function(err){
                    response.error(err);
                }
        });

    }

    function httpPost() {

        http.post({url:'http://jsonplaceholder.typicode.com/posts',json:{
            title: 'foo',
            body: 'bar',
            userId: 1
          }},{
            success: function(httpResponse) {
                
                /*
                log.info(httpResponse.status);
                log.info(httpResponse.body);

                for(var headerName in httpResponse.headers) {

                    log.info(headerName + ": " + httpResponse.headers[headerName]);
                }
                */
                
                
                if (httpResponse.status == 201) {

                    printTest("HTTP_POST", true);
                    // log.info("title: " + httpResponse.body.title);
                    httpPut();
                    response.success();

                } else {

                    printTest("HTTP_POST", false);
                    response.error();
                }
                                
            },
            error: function(err){
                response.error(err);
            }
        });
    }


    function httpPut() {

        http.put({url:'http://jsonplaceholder.typicode.com/posts/1',json:{
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
          }},{
            success: function(httpResponse) {
                
                /*
                log.info(httpResponse.status);
                log.info(httpResponse.body);

                for(var headerName in httpResponse.headers) {

                    log.info(headerName + ": " + httpResponse.headers[headerName]);
                }
                */
                
                if (httpResponse.status == 200) {

                    printTest("HTTP_PUT", true);
                    httpDel();
                    response.success();

                } else {

                    printTest("HTTP_PUT", false);
                    response.error();
                }
                        
                response.success();
                
            },
            error: function(err){
                response.error(err);
            }
        });

    }

    function httpDel() {

        http.del({url:'http://jsonplaceholder.typicode.com/posts/1'},{
            success: function(httpResponse) {
                
                /*
                log.info(httpResponse.status);
                log.info(httpResponse.body);
                for(var headerName in httpResponse.headers) {
                    log.info(headerName + ": " + httpResponse.headers[headerName]);
                }
                */
                
                if (httpResponse.status == 200) {

                    printTest("HTTP_DELETE", true);
                    createMark(true);
                    response.success();

                } else {

                    printTest("HTTP_DELETE", false);
                    response.error();
                }
                                
            },
            error: function(err){
                response.error(err);
            }
        });
    }
}

function createMark(status) {

    if (status) testmark.status = "PASSED";
    else testmark.status = "ERROR";

    gamedonia.data.create(collection_name, testmark, {

        success: function(res_create) {
                response.success();
        },
        error: function(error) {
                log.error(error.message);
                response.error(error.message);
        }
    });
}

function printTest(method, success) {

    if (print_test_results) {

        if( success ) {

            log.info( method+" OK" );
            testmark.put(method, "OK");

        } else {

            log.info( method+" FAILED" );
            testmark.put(method, "FAILED");
            createMark(false);
        }
    }
}