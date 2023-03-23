const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const bodyParser = require('body-parser')

app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '', //password when access sqlworkbench
	database : '', //database ทีใช้
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//app.get('/',(req,res) => res.send('hello world'));
app.get('/',(req,res) => {
	if(req.query.id != null){
	 connection.query("SELECT * FROM Takes WHERE student_id LIKE '%"+req.query.id+"%'",(err,result) => {
	  res.render('index',{
	   student:result
	  });
	  console.log(JSON.stringify(result))
	 })
	 console.log("Search!");
	}else{
	 connection.query('SELECT * FROM Takes',(err,result) => {
	  res.render('index',{
	   student:result
	  });
	  console.log(JSON.stringify(result))
	 })
	 console.log("Query!");
	}
	
	
   });

app.get('/add',(req,res) => {
	res.render('add');
});

app.post('/add',(req,res) => {
	// const student_id = req.body.student_id;
	// const name = req.body.name;
	// const year = req.body.year;
	// const email = req.body.email
	// const post = {
	// 	student_id:student_id,
	// 	name:name,
	// 	year:year,
	// 	email:email,
	// }
	const student_id = req.body.student_id
	const cid = req.body.cid
	const sect_id = req.body.section_id
	const semester = req.body.semester
	const year = req.body.year
	const grade = req.body.grade
	const post = [student_id,cid,sect_id,semester,year,grade]
	console.log(JSON.stringify(post))
	connection.query('INSERT INTO Takes (student_id,cid,sect_id,semester,year,grade) VALUES (?,?,?,?,?,?)',post,(err) => {
		if (err != null) {
			console.log(JSON.stringify(err))
		}
		console.log('Takes Inserted');
		return res.redirect('/');
	});
});

app.get('/edit/:id',(req,res) => {
	
	const edit_postID = req.params.id;
	
	connection.query('SELECT * FROM student WHERE student_id=?',[edit_postID],(err,results) => {
		if(results){
			res.render('edit',{
				student:results[0]
			});
		}
	});
});

app.post('/edit/:id',(req,res) => {
	// const update_name = req.body.name;
	// const update_year = req.body.year;
	// const update_email = req.body.email;
	// const userId = req.params.id;
	const student_id = req.body.student_id
	const cid = req.body.cid
	const sect_id = req.body.section_id
	const semester = req.body.semester
	const year = req.body.year
	const grade = req.body.grade
	const id = req.params.id
	const updataParams = [cid, sect_id, semester, year, grade,id]
	connection.query('UPDATE `Takes` SET cid = ?, sect_id = ?, semester = ?, year = ?,grade= ? WHERE student_id = ?', updataParams, (err, results) => {
        if(results.changedRows === 1){
            console.log('Student Updated');
        }
		return res.redirect('/');
    });
});

app.get('/delete/:id',(req,res) => {
    connection.query('DELETE FROM `Takes` WHERE student_id = ?', [req.params.id], (err, results) => {
        return res.redirect('/');
    });	
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))