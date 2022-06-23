var mysql= require('mysql');
const dotenv=require('dotenv')
dotenv.config()


// create connection
var db_config={
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
}

var connection = mysql.createPool(db_config);


connection.getConnection((err)=>{
    if(err){
        console.log("\n\t *** Cannot establish a connection with the database. ***")
        connection=reconnect(connection)
    }else{
        console.log('\n\t***Mysql connected...***')
    }
});


function reconnect(connection){
    console.log("\n New connection tentative...");

    //- Destroy the current connection variable
    // if(connection) connection.destroy();



    //- Create a new one
    var connection = mysql.createPool(db_config);

    //- Try to reconnect
    connection.getConnection(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t *** New connection established with the database. ***")
            return connection;
        }
    });
}

connection.on('error', function(err) {

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

});


module.exports=connection