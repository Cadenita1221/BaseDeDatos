let express = require ("express");
let sha1 = require ("sha1");
let session = require ("express-session");
let cookie = require ("cookie-parser");


class server {
    constructor (){
        this.app = express();
        this.port = process.env.PORT;

        this.middlewares();
        this.routers();
    }

    middlewares(){
        ////paginas estaticas///
        this.app.use(express.static('public'));
        ////View engine////
        this.app.set('view engine', 'ejs');
        //sesiones//////////////////
        this.app.use(cookie());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
        ////////////////////////////
    }

    routers(){
      /////Ruta Hola/////
        this.app.get("/hola",(req, res) =>  {
          //session
          if (req.session.user){
            if(req.session.user.rol == 'admi'){
              res.send("<h1 style='color: blue;'>INICIASTE COMO ADMINISTRADOR</h1>");
            }
            else if(req.session.user.rol='cliente'){
              res.send("<h1 style='color: blue;'>INICIASTE COMO CLIENTE </h1>");
            }

          }
          else{
            res.send("<h1 style='color: blue;'>ERROR NO HAS INICIADO SESSION!!!</h1>");
          }
        });

////ruta login/////
this.app.get("/login", (req, res)=> {
  let id_usuario = req.query.id_usuario;
  let password = req.query.password;

////cifrado hash sha1////
 let passSha1 = sha1(password);

////Conexion A mySQL/////
  let mysql = require('mysql');
  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CADENITA1221",
    database: "escuela"
  
  
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "select * from usuario where id_usuario = '"+ id_usuario + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length > 0 ){

        if(result[0].password == passSha1){
          
          /////sesion////
          let user ={
            nam: id_usuario,
            psw: password,
            rol:result[0].roll
          };
          req.session.user=user;
          req.session.save();
          //////////////////
          res.render("inicio",{nombre: result[0].id_usuario,rol:result[0].rol
          });
        }
        else{
          res.render("login", {error: "Contraseña incorrecta!!"});
        }
      }
      else{
        res.render("login", {error: "usuario no existe!!"});
      }
    });
});
})
        ////Ruta dar de baja a alumnos
        



        ///Ruta registrar///
        this.app.get("/registrar", (req, res) => {

            let mat = req. query. matricula;
            let nombre = req.query. nombre;
            let cuatri = req. query. cuatrimestre;   
            let mysql = require('mysql');



let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CADENITA1221",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO alumno VALUES ("+ mat +",'" + nombre+"','"+ cuatri+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("registrado", {mat: mat ,nombre:nombre,cuatri:cuatri});
    console.log("1 record inserted");
  });
});     
                
        });
        this.app.get("/registrarcurso", (req, res) => {

            let id_curso = req. query. id_curso;
            let nombre = req.query. nombre  
            let mysql = require('mysql');



let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CADENITA1221",
  database: "escuela"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "INSERT INTO curso VALUES ('" + id_curso+"','"+ nombre+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render("cursoregistrado", {id_curso: id_curso ,nombre:nombre});
    console.log("1 record inserted");
  });
});     
                
        });
  
        this.app.get("/inscribir", (req, res) => {

          let matricula = req. query. matricula;
          let id_curso = req.query. id_curso 
          let mysql = require('mysql');



let con = mysql.createConnection({
host: "localhost",
user: "root",
password: "CADENITA1221",
database: "escuela"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
let sql = "INSERT INTO inscrito VALUES ("+ matricula+","+ id_curso+")";
con.query(sql, function (err, result) {
  if (err) throw err;
  res.render("inscrito", {matricula: matricula ,id_curso:id_curso});
  console.log("1 record inserted");
});
});     
              
      });

        
    }

    listen(){
        this.app.listen (this.port, () => {
            console.log("http://127.0.0.1:" + this.port);
        });
    
    }
}
module.exports = server;
